"use client";

import { useState } from "react";
import { createNoticeAction } from "@/app/actions/notices";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Megaphone, CheckCircle } from "lucide-react";

export function NoticeForm({
  categories,
  departments,
  programmes,
  semesters
}: {
  categories: any[];
  departments: any[];
  programmes: any[];
  semesters: any[];
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
    const result = await createNoticeAction(formData);

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/notices"), 1500);
    } else {
      setErrorMsg(result.error || "An unknown error occurred.");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h3 className="text-2xl font-bold">Notice Published!</h3>
        <p className="text-muted-foreground">Redirecting to the Notice Board...</p>
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
        <Label htmlFor="title">Notice Title <span className="text-red-500">*</span></Label>
        <Input id="title" name="title" placeholder="E.g., Semester III Internal Examination Time Table" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Notice Content <span className="text-red-500">*</span></Label>
        <Textarea id="content" name="content" placeholder="Detailed information about the notice..." rows={6} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category_id">Category <span className="text-red-500">*</span></Label>
          <Select name="category_id" required>
            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select name="priority" defaultValue="normal">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="important">Important</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h4 className="font-bold mb-4">Target Audience (Optional)</h4>
        <p className="text-sm text-muted-foreground mb-4 -mt-2">Leave blank to broadcast to the entire college.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Department</Label>
            <Select name="department_id">
              <SelectTrigger><SelectValue placeholder="Any Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Department</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Programme</Label>
            <Select name="programme_id">
              <SelectTrigger><SelectValue placeholder="Any Programme" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Programme</SelectItem>
                {programmes.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Semester</Label>
            <Select name="semester_id">
              <SelectTrigger><SelectValue placeholder="Any Semester" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Semester</SelectItem>
                {semesters.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Publishing..." : <><Megaphone className="w-4 h-4 mr-2" /> Publish Notice</>}
      </Button>
    </form>
  );
}
