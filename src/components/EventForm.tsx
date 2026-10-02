"use client";

import { useState } from "react";
import { createEventAction } from "@/app/actions/calendar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarDays, CheckCircle } from "lucide-react";

const EVENT_CATEGORIES = [
  'Examination', 'Internal Assessment', 'Assignment Deadline', 
  'Holiday', 'College Event', 'Department Event', 
  'Seminar', 'Workshop', 'Admission', 'Other'
];

export function EventForm({
  departments,
  programmes,
  semesters
}: {
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
    const result = await createEventAction(formData);

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/calendar"), 1500);
    } else {
      setErrorMsg(result.error || "An unknown error occurred.");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h3 className="text-2xl font-bold">Event Scheduled!</h3>
        <p className="text-muted-foreground">Redirecting to the Calendar...</p>
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
        <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
        <Input id="title" name="title" placeholder="E.g., Semester III Finals" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea id="description" name="description" placeholder="Additional details..." rows={3} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
          <Select name="category" required>
            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
            <SelectContent>
              {EVENT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location (Optional)</Label>
          <Input id="location" name="location" placeholder="E.g., Main Hall, Room 302" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="start_time">Start Date & Time <span className="text-red-500">*</span></Label>
          <Input id="start_time" name="start_time" type="datetime-local" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end_time">End Date & Time <span className="text-red-500">*</span></Label>
          <Input id="end_time" name="end_time" type="datetime-local" required />
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h4 className="font-bold mb-4">Target Audience (Optional)</h4>
        <p className="text-sm text-muted-foreground mb-4 -mt-2">Leave blank to broadcast to the entire college calendar.</p>
        
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
        {isSubmitting ? "Scheduling..." : <><CalendarDays className="w-4 h-4 mr-2" /> Schedule Event</>}
      </Button>
    </form>
  );
}
