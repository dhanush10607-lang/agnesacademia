"use client";

import { useState } from "react";
import { editResourceAction } from "@/app/actions/resource-edit";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Save, CheckCircle } from "lucide-react";

export function EditResourceForm({
  resource
}: {
  resource: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    subject: { name: string };
  };
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await editResourceAction(formData);

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/faculty/resources");
      }, 2000);
    } else {
      setErrorMsg(result.error || "An unknown error occurred.");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 mb-2">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold">Resource Updated!</h3>
        <p className="text-muted-foreground max-w-md">
          Your changes have been saved successfully. Redirecting you back to your resources...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={resource.id} />
      
      {errorMsg && (
        <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2">
        <Label>Subject</Label>
        <Input value={resource.subject?.name || "Unknown"} disabled />
        <p className="text-xs text-muted-foreground">Subject cannot be changed after upload.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
        <Input id="title" name="title" defaultValue={resource.title} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          defaultValue={resource.description || ""} 
          rows={4} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
        <Select name="status" defaultValue={resource.status} required>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft (Hidden)</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="published">Published (Visible to all)</SelectItem>
            <SelectItem value="archived">Archived (Hidden)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
      </Button>
    </form>
  );
}
