"use client";

import { useState } from "react";
import { createAnnouncementAction } from "@/app/actions/announcements";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bell, CheckCircle } from "lucide-react";

export function AnnouncementForm({
  subjects
}: {
  subjects: { id: string; name: string; code: string }[];
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
    const result = await createAnnouncementAction(formData);

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
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
        <h3 className="text-2xl font-bold">Announcement Posted!</h3>
        <p className="text-muted-foreground max-w-md">
          Your announcement has been published and is now visible to students.
        </p>
        <div className="flex gap-4 mt-6">
          <Button onClick={() => setSuccess(false)} variant="outline">Post Another</Button>
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
        <Label htmlFor="subject_id">Target Subject <span className="text-red-500">*</span></Label>
        <Select name="subject_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Select one of your assigned subjects">
              {(value) => {
                const subject = subjects.find(item => item.id === value);
                return subject ? `${subject.name} (${subject.code})` : "Select one of your assigned subjects";
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Announcement Title <span className="text-red-500">*</span></Label>
        <Input id="title" name="title" placeholder="E.g., Assignment 2 Deadline Extended" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
        <Textarea id="content" name="content" placeholder="Type the announcement details here..." rows={6} required />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : <><Bell className="w-4 h-4 mr-2" /> Post Announcement</>}
      </Button>
    </form>
  );
}
