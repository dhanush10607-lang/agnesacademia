"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, CheckCircle, Clock } from "lucide-react";
import {
  QuizAttemptQuestion,
  recordQuizFocusEventAction,
  saveQuizAnswerAction,
  submitQuizAction,
} from "@/app/actions/submit-quiz";

type Quiz = {
  id: string;
  title: string;
  duration_minutes: number | null;
};

export function QuizInterface({
  attemptId,
  expiresAt,
  quiz,
  questions,
  answers: initialAnswers,
  tabSwitchCount: initialTabSwitchCount,
  watermarkLabel,
  fullscreenSession,
}: {
  attemptId: string;
  expiresAt: string | null;
  quiz: Quiz;
  questions: QuizAttemptQuestion[];
  answers: Record<string, string>;
  tabSwitchCount: number;
  watermarkLabel: string;
  fullscreenSession: boolean;
}) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [tabSwitchCount, setTabSwitchCount] = useState(initialTabSwitchCount);
  const [focusMessage, setFocusMessage] = useState("");
  const [connectionLost, setConnectionLost] = useState(false);
  const [isBrowserOnline, setIsBrowserOnline] = useState(true);
  const answersRef = useRef(initialAnswers);
  const submittingRef = useRef(false);
  const autoSubmissionTriggeredRef = useRef(false);
  const focusEventTriggeredRef = useRef(false);
  const pendingFocusEventRef = useRef(false);
  const retryFocusEventRef = useRef<() => void>(() => {});
  const handleFinalSubmit = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setSaveMessage("");

    try {
      const result = await submitQuizAction(attemptId, answersRef.current);
      if (result.success && result.attemptId) {
        router.push(`/quizzes/${quiz.id}/result?attempt=${result.attemptId}`);
        return;
      }
      setSaveMessage(result.error || "Could not submit the quiz. Please try again.");
    } catch (error) {
      console.error("Could not submit quiz:", error);
      setSaveMessage("Could not submit the quiz. Check your connection and retry.");
    }
    submittingRef.current = false;
    setIsSubmitting(false);
  }, [attemptId, quiz.id, router]);

  useEffect(() => {
    const handleOffline = () => {
      setIsBrowserOnline(false);
      setConnectionLost(true);
    };
    const handleOnline = () => {
      setIsBrowserOnline(true);
      setConnectionLost(false);
      if (pendingFocusEventRef.current) retryFocusEventRef.current();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    if (!navigator.onLine) handleOffline();

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  useEffect(() => {
    if (!isBrowserOnline || !pendingFocusEventRef.current) return;

    const retryTimer = window.setInterval(() => {
      if (navigator.onLine && pendingFocusEventRef.current) {
        retryFocusEventRef.current();
      }
    }, 5000);

    return () => window.clearInterval(retryTimer);
  }, [isBrowserOnline]);

  useEffect(() => {
    if (!expiresAt) return;

    const deadline = new Date(expiresAt).getTime();
    const updateRemainingTime = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0 && !autoSubmissionTriggeredRef.current) {
        autoSubmissionTriggeredRef.current = true;
        void handleFinalSubmit();
      }
    };

    updateRemainingTime();
    const timer = window.setInterval(updateRemainingTime, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, handleFinalSubmit]);

  useEffect(() => {
    const recordFocusEvent = () => {
      if (focusEventTriggeredRef.current) return;
      pendingFocusEventRef.current = false;
      focusEventTriggeredRef.current = true;
      void recordQuizFocusEventAction(attemptId, answersRef.current).then(result => {
        if (result.success && typeof result.tabSwitchCount === "number") {
          setTabSwitchCount(result.tabSwitchCount);
          setFocusMessage("");
          if (result.autoSubmitted && result.attemptId) {
            router.push(`/quizzes/${quiz.id}/result?attempt=${result.attemptId}`);
          } else {
            void handleFinalSubmit();
          }
        } else if (result.error) {
          focusEventTriggeredRef.current = false;
          pendingFocusEventRef.current = true;
          setFocusMessage(result.error);
        }
      }).catch(error => {
        console.error("Could not record quiz tab-switch event:", error);
        focusEventTriggeredRef.current = false;
        pendingFocusEventRef.current = true;
        setFocusMessage("A tab switch could not be recorded.");
      });
    };
    retryFocusEventRef.current = () => {
      if (pendingFocusEventRef.current) recordFocusEvent();
    };
    const handleFocusLoss = () => {
      pendingFocusEventRef.current = true;
      recordFocusEvent();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") handleFocusLoss();
    };
    const handleFullscreenChange = () => {
      if (fullscreenSession && !document.fullscreenElement) handleFocusLoss();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleFocusLoss);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    handleFullscreenChange();
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleFocusLoss);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      retryFocusEventRef.current = () => {};
    };
  }, [attemptId, fullscreenSession, handleFinalSubmit, quiz.id, router]);

  useEffect(() => {
    const handleScreenshotShortcut = (event: KeyboardEvent) => {
      if (event.key !== "PrintScreen" && event.code !== "PrintScreen") return;
      event.preventDefault();
      void handleFinalSubmit();
    };

    window.addEventListener("keydown", handleScreenshotShortcut);
    return () => window.removeEventListener("keydown", handleScreenshotShortcut);
  }, [handleFinalSubmit]);

  const handleSelectOption = (optionId: string) => {
    const questionId = questions[currentIdx]?.id;
    if (!questionId) return;

    const nextAnswers = { ...answersRef.current, [questionId]: optionId };
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    setSaveMessage("Saving answer…");

    void saveQuizAnswerAction(attemptId, questionId, optionId).then(result => {
      setSaveMessage(result.success ? "All answers are saved." : result.error || "Your answer could not be saved.");
    }).catch(error => {
      console.error("Could not save quiz answer:", error);
      setSaveMessage("Your answer could not be saved. Try selecting it again.");
    });
  };

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!currentQ) return <div className="p-8 text-center">No questions available.</div>;

  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-muted/20">
      <header className="sticky top-0 z-40 border-b bg-background shadow-sm">
        <div className="container mx-auto flex min-h-16 min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-2 sm:flex-nowrap sm:px-4">
          <div className="min-w-0 flex-1 truncate font-bold sm:max-w-md">{quiz.title}</div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-8">
            <div className="hidden text-sm font-medium text-muted-foreground sm:block">
              Answered: {answeredCount}/{questions.length}
            </div>
            {timeLeft !== null && (
              <div className={`flex items-center font-mono text-lg font-bold ${timeLeft < 60 ? "animate-pulse text-red-500" : "text-primary"}`}>
                <Clock className="mr-2 h-5 w-5" />
                {formatTime(timeLeft)}
              </div>
            )}
            <Button
              onClick={() => void handleFinalSubmit()}
              disabled={isSubmitting}
              variant={answeredCount === questions.length ? "default" : "outline"}
              size="sm"
            >
              {isSubmitting ? "Submitting…" : <><span className="sm:hidden">Submit</span><span className="hidden sm:inline">Submit Quiz</span></>}
            </Button>
          </div>
        </div>
        <div className="h-1 w-full bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main
        className="container mx-auto flex w-full min-w-0 max-w-4xl flex-grow select-none flex-col gap-5 px-3 py-5 pb-8 sm:gap-8 sm:px-4 sm:py-8 md:flex-row"
        onCopy={event => event.preventDefault()}
        onCut={event => event.preventDefault()}
        onContextMenu={event => event.preventDefault()}
        onDragStart={event => event.preventDefault()}
        onKeyDown={event => {
          if ((event.ctrlKey || event.metaKey) && ["c", "x"].includes(event.key.toLowerCase())) {
            event.preventDefault();
          }
        }}
      >
        <div className="min-w-0 flex-grow space-y-5 sm:space-y-6">
          {saveMessage && (
            <p role="status" className={`text-sm ${saveMessage.includes("could not") || saveMessage.includes("Could not") ? "text-red-600" : "text-muted-foreground"}`}>
              {saveMessage}
            </p>
          )}
          {focusMessage && <p role="alert" className="text-sm text-red-600">{focusMessage}</p>}
          <p className="break-words text-xs text-muted-foreground">
            Leaving this tab or quiz window may automatically submit your saved answers. Browser focus detection is best-effort and cannot prevent all ways of accessing other apps or materials. Incoming calls and other mobile interruptions may also trigger submission, depending on the device and browser.
            {tabSwitchCount > 0 && ` Recorded switches: ${tabSwitchCount}.`}
          </p>
          <p className="break-words text-xs text-muted-foreground">
            Text selection and copying are disabled in this quiz where supported. Pressing Print Screen may submit the quiz if your browser reports that key; screenshots taken through device or operating-system controls may not be detectable.
          </p>

          <Card className="relative w-full min-w-0 max-w-full overflow-hidden border-border shadow-md">
            <CardContent className="w-full min-w-0 max-w-full overflow-hidden p-4 sm:p-8">
              <div className="mb-6 flex min-w-0 items-start justify-between gap-3">
                <span className="min-w-0 break-words text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="shrink-0 whitespace-nowrap rounded bg-muted px-2 py-1 text-xs font-semibold">{currentQ.marks} Marks</span>
              </div>
              <h2 className="mb-6 w-full min-w-0 break-words text-xl font-semibold [overflow-wrap:anywhere] sm:mb-8 sm:text-2xl">{currentQ.question_text}</h2>
              <RadioGroup
                value={answers[currentQ.id] || ""}
                onValueChange={handleSelectOption}
                className="w-full min-w-0 max-w-full space-y-4"
              >
                {currentQ.options.map(option => (
                  <div
                    key={option.id}
                    className={`grid w-full min-w-0 max-w-full cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-3 overflow-hidden rounded-lg border p-3 transition-colors sm:items-center sm:p-4 ${
                      answers[currentQ.id] === option.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1 shrink-0 sm:mt-0" />
                    <Label htmlFor={option.id} className="block w-full min-w-0 cursor-pointer whitespace-normal break-words text-left text-base leading-relaxed [overflow-wrap:anywhere]">
                      <span className="block w-full min-w-0 whitespace-normal break-words [overflow-wrap:anywhere]">
                        {option.option_text}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 grid grid-cols-2 grid-rows-3 overflow-hidden"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="-rotate-12 self-center justify-self-center px-1 text-center text-[10px] font-semibold leading-5 text-foreground/15 sm:text-xs"
                >
                  {watermarkLabel}
                </div>
              ))}
            </div>
          </Card>

          {saveMessage.includes("could not") || saveMessage.includes("Could not") ? (
            <Button onClick={() => void handleFinalSubmit()} disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting…" : "Retry submission"}
            </Button>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button onClick={() => setCurrentIdx(index => index - 1)} disabled={currentIdx === 0} variant="outline" size="lg" className="min-w-0 flex-1 sm:flex-none">
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {currentIdx === questions.length - 1 ? (
              <Button onClick={() => void handleFinalSubmit()} disabled={isSubmitting} size="lg" className="min-w-0 flex-1 bg-green-600 text-white hover:bg-green-700 sm:flex-none">
                <CheckCircle className="mr-2 h-4 w-4" /> Finish
              </Button>
            ) : (
              <Button onClick={() => setCurrentIdx(index => index + 1)} size="lg" className="min-w-0 flex-1 sm:flex-none">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="order-first min-w-0 shrink-0 md:order-last md:w-64">
          <Card className="border-border md:sticky md:top-24">
            <CardContent className="p-4">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Question Map</h3>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-2">
                {questions.map((question, index) => {
                  const isAnswered = !!answers[question.id];
                  const isCurrent = index === currentIdx;
                  return (
                    <button
                      key={question.id}
                      type="button"
                      aria-label={`Go to question ${index + 1}${isAnswered ? ", answered" : ", unanswered"}`}
                      onClick={() => setCurrentIdx(index)}
                      className={`flex h-10 w-10 items-center justify-center rounded text-sm font-medium transition-colors ${
                        isCurrent ? "ring-2 ring-primary ring-offset-1" : ""
                      } ${isAnswered ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted-foreground/20"}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {connectionLost && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="connection-lost-title"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
        >
          <Card className="w-full max-w-md">
            <CardContent className="space-y-4 p-6 text-center">
              <h2 id="connection-lost-title" className="text-xl font-bold">Quiz connection lost</h2>
              <p className="text-sm text-muted-foreground">
                The quiz is temporarily locked while you are offline. It will unlock when your connection returns, and you can continue answering.
              </p>
              <p className="text-xs text-muted-foreground">
                The quiz timer continues while you are offline.
              </p>
              {saveMessage && (
                <p role="status" className="text-sm text-red-600">{saveMessage}</p>
              )}
              <p className="text-sm font-medium">
                {isBrowserOnline ? "Connection restored. Unlocking quiz…" : "Waiting for connection…"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
