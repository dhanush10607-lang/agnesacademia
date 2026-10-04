"use client";

import { useState } from "react";
import { createQuizAction } from "@/app/actions/quizzes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BrainCircuit, CheckCircle } from "lucide-react";

export function QuizForm({
  subjects
}: {
  subjects: { id: string; name: string; code: string }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newQuizId, setNewQuizId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await createQuizAction(formData);

    setIsSubmitting(false);

    if (result.success && result.quizId) {
      setSuccess(true);
      setNewQuizId(result.quizId);
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
        <h3 className="text-2xl font-bold">Quiz Details Created!</h3>
        <p className="text-muted-foreground max-w-md">
          Next, you need to add questions and options to this quiz before publishing it.
        </p>
        <div className="flex gap-4 mt-6">
          <Button onClick={() => router.push(`/faculty/quizzes/${newQuizId}/questions`)} variant="default">
            Add Questions Now
          </Button>
          <Button onClick={() => router.push("/faculty/quizzes")} variant="outline">
            Manage Quizzes
          </Button>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Quiz Title <span className="text-red-500">*</span></Label>
          <Input id="title" name="title" placeholder="E.g., Mid-Term Prep Quiz" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject_id">Subject <span className="text-red-500">*</span></Label>
          <Select name="subject_id" required>
            <SelectTrigger>
              <SelectValue placeholder="Select subject">
                {(value) => {
                  const subject = subjects.find(item => item.id === value);
                  return subject ? `${subject.name} (${subject.code})` : "Select subject";
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea id="description" name="description" placeholder="Briefly describe what this quiz covers..." rows={2} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unit_name">Unit / Module</Label>
          <Input id="unit_name" name="unit_name" placeholder="E.g., Unit 3" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select name="difficulty" defaultValue="medium">
            <SelectTrigger>
              <SelectValue>
                {(value) => ({ easy: "Easy", medium: "Medium", hard: "Hard" }[String(value ?? "")] || "")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (Minutes)</Label>
          <Input id="duration" name="duration" type="number" min="1" max="180" placeholder="E.g., 30" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="space-y-2">
          <Label htmlFor="passing_score">Passing Score (%)</Label>
          <Input id="passing_score" name="passing_score" type="number" min="1" max="100" defaultValue="40" />
        </div>
        <p className="text-sm text-muted-foreground">
          New quizzes are saved as drafts. Add and verify questions before publishing them to students.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : <><BrainCircuit className="w-4 h-4 mr-2" /> Create Quiz</>}
      </Button>
    </form>
  );
}
