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
}: {
  attemptId: string;
  expiresAt: string | null;
  quiz: Quiz;
  questions: QuizAttemptQuestion[];
  answers: Record<string, string>;
  tabSwitchCount: number;
}) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [tabSwitchCount, setTabSwitchCount] = useState(initialTabSwitchCount);
  const [focusMessage, setFocusMessage] = useState("");
  const answersRef = useRef(initialAnswers);
  const submittingRef = useRef(false);
  const autoSubmissionTriggeredRef = useRef(false);
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
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "hidden") return;
      void recordQuizFocusEventAction(attemptId).then(result => {
        if (result.success && typeof result.tabSwitchCount === "number") {
          setTabSwitchCount(result.tabSwitchCount);
          setFocusMessage("");
        } else if (result.error) {
          setFocusMessage(result.error);
        }
      }).catch(error => {
        console.error("Could not record quiz tab-switch event:", error);
        setFocusMessage("A tab switch could not be recorded.");
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [attemptId]);

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
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="sticky top-0 z-10 border-b bg-background shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="max-w-[200px] truncate font-bold sm:max-w-md">{quiz.title}</div>
          <div className="flex items-center gap-4 sm:gap-8">
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
              {isSubmitting ? "Submitting…" : "Submit Quiz"}
            </Button>
          </div>
        </div>
        <div className="h-1 w-full bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="container mx-auto flex max-w-4xl flex-grow flex-col gap-8 px-4 py-8 md:flex-row">
        <div className="flex-grow space-y-6">
          {saveMessage && (
            <p role="status" className={`text-sm ${saveMessage.includes("could not") || saveMessage.includes("Could not") ? "text-red-600" : "text-muted-foreground"}`}>
              {saveMessage}
            </p>
          )}
          {focusMessage && <p role="alert" className="text-sm text-red-600">{focusMessage}</p>}
          <p className="text-xs text-muted-foreground">
            Tab switches are recorded for faculty review and are not, by themselves, proof of misconduct.
            {tabSwitchCount > 0 && ` Recorded switches: ${tabSwitchCount}.`}
          </p>

          <Card className="border-border shadow-md">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 flex items-start justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="rounded bg-muted px-2 py-1 text-xs font-semibold">{currentQ.marks} Marks</span>
              </div>
              <h2 className="mb-8 text-xl font-semibold sm:text-2xl">{currentQ.question_text}</h2>
              <RadioGroup
                value={answers[currentQ.id] || ""}
                onValueChange={handleSelectOption}
                className="space-y-4"
              >
                {currentQ.options.map(option => (
                  <div
                    key={option.id}
                    className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                      answers[currentQ.id] === option.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="mr-4" />
                    <Label htmlFor={option.id} className="flex-grow cursor-pointer text-base leading-relaxed">
                      {option.option_text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {saveMessage.includes("could not") || saveMessage.includes("Could not") ? (
            <Button onClick={() => void handleFinalSubmit()} disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting…" : "Retry submission"}
            </Button>
          ) : null}

          <div className="flex items-center justify-between">
            <Button onClick={() => setCurrentIdx(index => index - 1)} disabled={currentIdx === 0} variant="outline" size="lg">
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {currentIdx === questions.length - 1 ? (
              <Button onClick={() => void handleFinalSubmit()} disabled={isSubmitting} size="lg" className="bg-green-600 text-white hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" /> Finish
              </Button>
            ) : (
              <Button onClick={() => setCurrentIdx(index => index + 1)} size="lg">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="order-first shrink-0 md:order-last md:w-64">
          <Card className="sticky top-24 border-border">
            <CardContent className="p-4">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Question Map</h3>
              <div className="grid grid-cols-5 gap-2">
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
    </div>
  );
}
