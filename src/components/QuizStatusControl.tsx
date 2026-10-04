"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setQuizStatusAction } from "@/app/actions/quizzes";
import { Button } from "@/components/ui/button";

export function QuizStatusControl({
  quizId,
  status,
}: {
  quizId: string;
  status: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const nextStatus = status === "published" ? "draft" : "published";

  const updateStatus = async () => {
    setIsPending(true);
    setError("");
    const result = await setQuizStatusAction(quizId, nextStatus);
    setIsPending(false);
    if (!result.success) {
      setError(result.error || "Could not update quiz status.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button type="button" variant={status === "published" ? "outline" : "default"} onClick={updateStatus} disabled={isPending}>
        {isPending ? "Updating…" : status === "published" ? "Unpublish quiz" : "Publish quiz"}
      </Button>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
