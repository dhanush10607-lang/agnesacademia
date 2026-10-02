"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, Flag, CheckCircle, Clock } from "lucide-react";
import { submitQuizAction } from "@/app/actions/submit-quiz";

type Question = {
  id: string;
  question_text: string;
  marks: number;
  options: { id: string; option_text: string }[];
};

export function QuizInterface({
  quiz,
  questions,
  attemptId
}: {
  quiz: any;
  questions: Question[];
  attemptId: string;
}) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(quiz.duration_minutes ? quiz.duration_minutes * 60 : null);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const res = await submitQuizAction(attemptId, quiz.id, answers);
    if (res.success) {
      router.push(`/quizzes/${quiz.id}/result?attempt=${attemptId}`);
    } else {
      alert("Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (timeLeft === null) return;
    
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentIdx].id]: optionId }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  };

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentQ) return <div>No questions available.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      {/* Quiz Header (Sticky) */}
      <header className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold truncate max-w-[200px] sm:max-w-md">{quiz.title}</div>
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="text-sm font-medium text-muted-foreground hidden sm:block">
              Answered: {answeredCount}/{questions.length}
            </div>
            
            {timeLeft !== null && (
              <div className={`flex items-center font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                <Clock className="w-5 h-5 mr-2" />
                {formatTime(timeLeft)}
              </div>
            )}
            
            <Button onClick={handleFinalSubmit} disabled={isSubmitting} variant={answeredCount === questions.length ? "default" : "outline"} size="sm">
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl flex flex-col md:flex-row gap-8">
        
        {/* Question Area */}
        <div className="flex-grow space-y-6">
          <Card className="border-border shadow-md">
            <CardContent className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="bg-muted px-2 py-1 rounded text-xs font-semibold">
                  {currentQ.marks} Marks
                </span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-semibold mb-8">
                {currentQ.question_text}
              </h2>

              <RadioGroup 
                value={answers[currentQ.id] || ""} 
                onValueChange={handleSelectOption}
                className="space-y-4"
              >
                {currentQ.options.map((opt) => (
                  <div key={opt.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${answers[currentQ.id] === opt.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-border'}`}>
                    <RadioGroupItem value={opt.id} id={opt.id} className="mr-4" />
                    <Label htmlFor={opt.id} className="flex-grow cursor-pointer text-base leading-relaxed">
                      {opt.option_text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <Button onClick={handlePrev} disabled={currentIdx === 0} variant="outline" size="lg">
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            
            {currentIdx === questions.length - 1 ? (
              <Button onClick={handleFinalSubmit} disabled={isSubmitting} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" /> Finish
              </Button>
            ) : (
              <Button onClick={handleNext} size="lg">
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigator Palette */}
        <div className="md:w-64 shrink-0 order-first md:order-last">
          <Card className="border-border sticky top-24">
            <CardContent className="p-4">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Question Map</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-sm font-medium transition-colors
                        ${isCurrent ? 'ring-2 ring-primary ring-offset-1' : ''}
                        ${isAnswered ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted-foreground/20'}
                      `}
                    >
                      {idx + 1}
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
