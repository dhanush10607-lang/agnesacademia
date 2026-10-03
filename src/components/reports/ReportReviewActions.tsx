"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { updateResourceReportAction } from "@/app/actions/reports";
import { Button } from "@/components/ui/button";

export function ReportReviewActions({
  reportId,
  onReviewed,
}: {
  reportId: string;
  onReviewed?: () => void;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<"resolved" | "dismissed" | null>(null);
  const [error, setError] = useState("");

  async function review(status: "resolved" | "dismissed") {
    setPending(status);
    setError("");
    try {
      const result = await updateResourceReportAction(reportId, status);
      if (!result.success) {
        setError(result.error || "Could not update this report.");
        return;
      }
      onReviewed?.();
      router.refresh();
    } catch (reviewError) {
      console.error("Report review request failed:", reviewError);
      setError("Could not update this report. Please try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={pending !== null}
          onClick={() => review("resolved")}
        >
          <Check className="mr-1 h-4 w-4" />
          {pending === "resolved" ? "Resolving..." : "Resolve"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending !== null}
          onClick={() => review("dismissed")}
        >
          <X className="mr-1 h-4 w-4" />
          {pending === "dismissed" ? "Dismissing..." : "Dismiss"}
        </Button>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
