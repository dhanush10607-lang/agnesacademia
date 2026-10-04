"use client";

import { useState } from "react";
import { addQuizQuestionAction } from "@/app/actions/quiz-questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle } from "lucide-react";

export function QuizQuestionForm({ quizId }: { quizId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await addQuizQuestionAction(formData);

    setIsSubmitting(false);

    if (result.success) {
      // Reset form
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorMsg(result.error || "An unknown error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-w-0 space-y-6">
      <input type="hidden" name="quiz_id" value={quizId} />

      {errorMsg && (
        <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="question_text">Question Text <span className="text-red-500">*</span></Label>
        <Textarea id="question_text" name="question_text" required rows={3} placeholder="What is the time complexity of binary search?" />
      </div>

      <div className="space-y-4">
        <Label>Multiple Choice Options & Correct Answer <span className="text-red-500">*</span></Label>
        <p className="text-xs text-muted-foreground -mt-2">Select the radio button next to the correct answer.</p>
        
        <RadioGroup name="correct_option" defaultValue="0" className="space-y-3">
          <div className="flex min-w-0 items-center gap-3">
            <RadioGroupItem value="0" id="opt0" className="shrink-0" />
            <Input className="min-w-0 flex-1" id="option_a" name="option_a" placeholder="Option A" required />
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <RadioGroupItem value="1" id="opt1" className="shrink-0" />
            <Input className="min-w-0 flex-1" id="option_b" name="option_b" placeholder="Option B" required />
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <RadioGroupItem value="2" id="opt2" className="shrink-0" />
            <Input className="min-w-0 flex-1" id="option_c" name="option_c" placeholder="Option C (Optional)" />
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <RadioGroupItem value="3" id="opt3" className="shrink-0" />
            <Input className="min-w-0 flex-1" id="option_d" name="option_d" placeholder="Option D (Optional)" />
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="marks">Marks</Label>
          <Input id="marks" name="marks" type="number" min="1" defaultValue="1" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation (Optional)</Label>
        <Textarea id="explanation" name="explanation" rows={2} placeholder="Shown to students after they complete the quiz." />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : <><PlusCircle className="w-4 h-4 mr-2" /> Add Question</>}
      </Button>
    </form>
  );
}
