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
  const quizDetails = Array.isArray(attemptRecord.quiz) ? attemptRecord.quiz[0] : attemptRecord.quiz;

  // Fetch answers
  const { data: answers, error: answersError } = await supabase
    .from("quiz_answers")
    .select(`
      id, question_id, selected_option_id, is_correct, marks_awarded,
      question_text_snapshot, explanation_snapshot, selected_option_text_snapshot,
      correct_option_text_snapshot, question_marks_snapshot,
      question:quiz_questions(question_text, explanation)
    `)
    .eq("attempt_id", attempt);
  if (answersError) console.error("Could not load submitted quiz answers:", answersError);

  const correctAnswers = answers?.filter(a => a.is_correct).length || 0;
  const totalQuestions = answers?.length || 0;
  const questionIds = answers?.map(answer => answer.question_id) || [];
  const { data: publicOptions, error: optionsError } = questionIds.length
    ? await supabase
        .from("quiz_public_options")
        .select("id, option_text")
        .in("question_id", questionIds)
    : { data: [], error: null };
  if (optionsError) console.error("Could not load legacy quiz answer labels:", optionsError);
  const optionsById = new Map((publicOptions || []).map(option => [option.id, option.option_text]));

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-4xl px-3 py-6 pb-28 sm:px-4 sm:py-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/quizzes" className={buttonVariants({ variant: "ghost", className: "w-full justify-start sm:w-auto" })}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quizzes
          </Link>
          <Link href={`/quizzes/${id}`} className={buttonVariants({ variant: "outline", className: "w-full sm:w-auto" })}>
            <RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
          </Link>
        </div>

        <Card className="border-border shadow-md mb-8 overflow-hidden">
          <div className={`p-5 text-center text-white sm:p-8 ${attemptRecord.is_passed ? 'bg-green-600 dark:bg-green-700' : 'bg-red-600 dark:bg-red-700'}`}>
            <BrainCircuit className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h1 className="mb-2 break-words text-2xl font-heading font-extrabold sm:text-3xl">
              {attemptRecord.is_passed ? 'Quiz Passed!' : 'Quiz Failed'}
            </h1>
            <p className="break-words font-medium opacity-90">
              {quizDetails?.title}
            </p>
          </div>
          <CardContent className="p-4 sm:p-8">
            <div className="grid grid-cols-1 gap-5 text-center sm:grid-cols-3 sm:gap-8">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Score</p>
                <p className="text-3xl font-black sm:text-4xl">{attemptRecord.score} <span className="text-lg font-medium text-muted-foreground sm:text-xl">/ {attemptRecord.total_marks}</span></p>
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Percentage</p>
                <p className="text-3xl font-black sm:text-4xl">{attemptRecord.percentage}%</p>
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Accuracy</p>
                <p className="text-3xl font-black text-primary sm:text-4xl">{correctAnswers} <span className="text-lg font-medium text-muted-foreground sm:text-xl">/ {totalQuestions}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-6">Review Answers</h2>
        {answersError && (
          <div role="alert" className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
            Your answer review could not be loaded. Refresh the page to try again.
          </div>
        )}
        <div className="space-y-6">
          {answers?.map((answer, idx) => {
            const question = Array.isArray(answer.question) ? answer.question[0] : answer.question;
            const questionText = answer.question_text_snapshot || question?.question_text;
            const explanation = answer.explanation_snapshot || question?.explanation;
            return (
              <Card key={answer.id} className={`border-l-4 ${answer.is_correct ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardContent className="min-w-0 p-4 sm:p-6">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <div className="flex min-w-0 items-start gap-3 sm:flex-1">
                    <div className="mt-1 shrink-0">
                      {answer.is_correct ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <h3 className="mb-2 break-words text-lg font-semibold [overflow-wrap:anywhere]">
                        <span className="mr-2 text-muted-foreground">{idx + 1}.</span>
                        {questionText}
                      </h3>

                      <div className="mb-4 flex flex-col gap-1 rounded-md bg-muted/30 p-3 text-sm">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your Answer:</span>
                        <span className="break-words font-medium [overflow-wrap:anywhere]">
                          {answer.selected_option_text_snapshot || optionsById.get(answer.selected_option_id || "") || <span className="italic text-muted-foreground">Skipped</span>}
                        </span>
                      </div>

                      {!answer.is_correct && explanation && (
                        <div className="break-words rounded-md bg-blue-50 p-4 text-sm text-blue-900 [overflow-wrap:anywhere] dark:bg-blue-950/30 dark:text-blue-200">
                          <span className="font-bold">Explanation: </span>
                          {explanation}
                        </div>
                      )}

                      {answer.is_correct && explanation && (
                        <div className="break-words rounded-md bg-green-50 p-4 text-sm text-green-900 [overflow-wrap:anywhere] dark:bg-green-900/20 dark:text-green-300">
                          <span className="font-bold">Explanation: </span>
                          {explanation}
                        </div>
                      )}
                      {!answer.is_correct && answer.correct_option_text_snapshot && (
                        <div className="mt-3 break-words text-sm text-green-700 [overflow-wrap:anywhere] dark:text-green-400">
                          <span className="font-bold">Correct answer: </span>{answer.correct_option_text_snapshot}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="self-end whitespace-normal rounded bg-muted px-2 py-1 text-sm font-medium sm:self-start sm:shrink-0">
                    {answer.marks_awarded} / {answer.question_marks_snapshot || 1} Marks
                  </div>
                </div>
              </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
