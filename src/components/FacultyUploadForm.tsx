"use client";

import { useState } from "react";
import { uploadFacultyResourceAction } from "@/app/actions/faculty";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle } from "lucide-react";

export function FacultyUploadForm({
  categories,
  subjects
}: {
  categories: { id: string; name: string }[];
  subjects: { id: string; name: string; code: string }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await uploadFacultyResourceAction(formData);

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setStatus(result.status || 'published');
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
        <h3 className="text-2xl font-bold">Upload Successful!</h3>
        <p className="text-muted-foreground max-w-md">
          {status === 'published' 
            ? "Your resource has been published immediately and is now visible to students." 
            : "Your resource has been submitted and is pending review based on current institutional settings."}
        </p>
        <div className="flex gap-4 mt-6">
          <Button onClick={() => setSuccess(false)} variant="outline">Upload Another</Button>
          <Button onClick={() => router.push("/faculty")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category_id">Resource Type <span className="text-red-500">*</span></Label>
        <Select name="category_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Select resource type" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject_id">Subject <span className="text-red-500">*</span></Label>
        <Select name="subject_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Select one of your assigned subjects" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
        <Input id="title" name="title" placeholder="E.g., Module 3 Official Notes" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Briefly describe what this resource contains..." rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File <span className="text-red-500">*</span></Label>
        <Input id="file" name="file" type="file" required className="cursor-pointer" />
        <p className="text-xs text-muted-foreground mt-1">
          Max size: 100MB. Allowed: PDF, DOC, PPT, Images, ZIP.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Uploading..." : <><UploadCloud className="w-4 h-4 mr-2" /> Publish Resource</>}
      </Button>
    </form>
  );
}
