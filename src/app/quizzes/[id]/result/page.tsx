import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { BrainCircuit, CheckCircle, XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

export default async function QuizResultPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attempt: string }>;
}) {
  const { id } = await params;
  const { attempt } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!attempt) redirect(`/quizzes/${id}`);

  // Fetch attempt
  const { data: attemptRecord, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select(`
      *,
      quiz:quizzes(title, max_attempts)
    `)
    .eq("id", attempt)
    .eq("student_id", user.id)
    .single();

  if (attemptError || !attemptRecord || attemptRecord.status !== 'completed') {
    notFound();
  }

  // Fetch answers
  const { data: answers } = await supabase
    .from("quiz_answers")
    .select(`
      *,
      question:quiz_questions(question_text, explanation),
      selected_option:quiz_options(option_text)
    `)
    .eq("attempt_id", attempt);

  const correctAnswers = answers?.filter(a => a.is_correct).length || 0;
  const totalQuestions = answers?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/quizzes" className={buttonVariants({ variant: "ghost" })}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quizzes
          </Link>
          <Link href={`/quizzes/${id}`} className={buttonVariants({ variant: "outline" })}>
            <RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
          </Link>
        </div>

        <Card className="border-border shadow-md mb-8 overflow-hidden">
          <div className={`p-8 text-center text-white ${attemptRecord.is_passed ? 'bg-green-600 dark:bg-green-700' : 'bg-red-600 dark:bg-red-700'}`}>
            <BrainCircuit className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl font-heading font-extrabold mb-2">
              {attemptRecord.is_passed ? 'Quiz Passed!' : 'Quiz Failed'}
            </h1>
            <p className="font-medium opacity-90">
              {(attemptRecord.quiz as any)?.title}
            </p>
          </div>
          <CardContent className="p-8">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Score</p>
                <p className="text-4xl font-black">{attemptRecord.score} <span className="text-xl text-muted-foreground font-medium">/ {attemptRecord.total_marks}</span></p>
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Percentage</p>
                <p className="text-4xl font-black">{attemptRecord.percentage}%</p>
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Accuracy</p>
                <p className="text-4xl font-black text-primary">{correctAnswers} <span className="text-xl text-muted-foreground font-medium">/ {totalQuestions}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-6">Review Answers</h2>
        <div className="space-y-6">
          {answers?.map((answer, idx) => (
            <Card key={answer.id} className={`border-l-4 ${answer.is_correct ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {answer.is_correct ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2">
                      <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                      {(answer.question as any)?.question_text}
                    </h3>
                    
                    <div className="bg-muted/30 p-3 rounded-md mb-4 text-sm flex flex-col gap-1">
                      <span className="text-muted-foreground font-medium uppercase text-xs tracking-wider">Your Answer:</span>
                      <span className="font-medium">
                        {(answer.selected_option as any)?.option_text || <span className="italic text-muted-foreground">Skipped</span>}
                      </span>
                    </div>

                    {!answer.is_correct && (answer.question as any)?.explanation && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md text-sm text-blue-900 dark:text-blue-200">
                        <span className="font-bold">Explanation: </span> 
                        {(answer.question as any).explanation}
                      </div>
                    )}
                    
                    {/* If correct, we can also show explanation if desired */}
                    {answer.is_correct && (answer.question as any)?.explanation && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-sm text-green-900 dark:text-green-300">
                        <span className="font-bold">Explanation: </span> 
                        {(answer.question as any).explanation}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-sm font-medium whitespace-nowrap bg-muted px-2 py-1 rounded">
                    {answer.marks_awarded} / {(answer.marks_awarded > 0) ? answer.marks_awarded : '1'} Marks
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
