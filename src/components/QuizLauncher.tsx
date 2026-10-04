"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { startQuizAttemptAction, type QuizAttemptData } from "@/app/actions/submit-quiz";
import { QuizInterface } from "@/components/QuizInterface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function QuizLauncher({
  quizId,
  studentLabel,
}: {
  quizId: string;
  studentLabel: string;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState<QuizAttemptData | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const [startError, setStartError] = useState("");

  const startAttempt = async () => {
    setIsStarting(true);
    setStartError("");

    try {
      const result = await startQuizAttemptAction(quizId);
      if (!result.success) {
        setStartError(result.error);
        if (document.fullscreenElement === containerRef.current) {
          await document.exitFullscreen().catch(error => {
            console.error("Could not exit fullscreen after quiz start failed:", error);
          });
          setIsFullscreen(false);
        }
        return;
      }

      if ("completedAttemptId" in result) {
        router.replace(`/quizzes/${quizId}/result?attempt=${result.completedAttemptId}`);
        return;
      }

      setAttempt(result.attempt);
    } catch (error) {
      console.error("Could not start quiz attempt:", error);
      setStartError("Could not start the quiz. Please try again.");
      if (document.fullscreenElement === containerRef.current) {
        await document.exitFullscreen().catch(exitError => {
          console.error("Could not exit fullscreen after quiz start failed:", exitError);
        });
        setIsFullscreen(false);
      }
    } finally {
      setIsStarting(false);
    }
  };

  const startInFullscreen = async () => {
    setFullscreenError("");
    if (!containerRef.current || !document.fullscreenEnabled) {
      setFullscreenError("Fullscreen is unavailable in this browser or device.");
      return;
    }

    try {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
      await startAttempt();
    } catch (error) {
      console.error("Could not enter quiz fullscreen:", error);
      setFullscreenError("Fullscreen could not be started. You can continue without fullscreen.");
    }
  };

  const startWithoutFullscreen = async () => {
    setFullscreenError("");
    await startAttempt();
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen min-w-0 bg-background ${
        attempt
          ? "fixed inset-0 z-[100] h-dvh overflow-y-auto"
          : isFullscreen
            ? "h-dvh overflow-y-auto"
            : ""
      }`}
    >
      {attempt ? (
        <QuizInterface
          {...attempt}
          watermarkLabel={`${studentLabel} · Attempt ${attempt.attemptId.slice(0, 8)}`}
          fullscreenSession={isFullscreen}
        />
      ) : (
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Start quiz</CardTitle>
              <CardDescription>
                Start in fullscreen to keep the quiz focused. Exiting fullscreen during the attempt will submit your saved answers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fullscreenError && (
                <div role="alert" className="rounded-md bg-amber-100 p-3 text-sm text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
                  {fullscreenError}
                </div>
              )}
              {startError && (
                <div role="alert" className="rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  {startError}
                </div>
              )}
              <Button className="w-full" onClick={() => void startInFullscreen()} disabled={isStarting}>
                {isStarting ? "Starting quiz…" : "Start in fullscreen"}
              </Button>
              {fullscreenError && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => void startWithoutFullscreen()}
                  disabled={isStarting}
                >
                  {isStarting ? "Starting quiz…" : "Continue without fullscreen"}
                </Button>
              )}
            </CardContent>
          </Card>
        </main>
      )}
    </div>
  );
}
