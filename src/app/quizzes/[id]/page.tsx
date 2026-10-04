import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { BrainCircuit, Clock, HelpCircle, Info, Play, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function QuizIntroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch quiz details
  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select(`
      *,
      subject:subjects(name, code)
    `)
    .eq("id", id)
    .single();

  if (error || !quiz || quiz.status !== 'published') {
    notFound();
  }

  const { data: questionCountData, error: questionCountError } = await supabase
    .from("quiz_public_question_counts")
    .select("question_count")
    .eq("quiz_id", id)
    .maybeSingle();
  if (questionCountError) {
    console.error("Could not load quiz question count:", questionCountError);
  }
  const questionCount = questionCountData?.question_count || 0;

  // Check attempt limits
  const { count: attemptCount } = await supabase
    .from("quiz_attempts")
    .select("id", { count: 'exact' })
    .eq("quiz_id", id)
    .eq("student_id", user.id)
    .neq("status", "abandoned");

  const hasReachedLimit = quiz.max_attempts && (attemptCount || 0) >= quiz.max_attempts;
  const subject = Array.isArray(quiz.subject) ? quiz.subject[0] : quiz.subject;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow container mx-auto flex max-w-3xl items-start justify-center px-3 py-6 pb-32 sm:items-center sm:px-4 sm:py-12">
        <div className="w-full min-w-0">
          <Link href="/quizzes" className={buttonVariants({ variant: "ghost", className: "mb-6 max-w-full whitespace-normal" })}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Quizzes
          </Link>
          
          <Card className="border-border shadow-md overflow-hidden">
            <div className="border-b bg-primary/5 p-5 text-center sm:p-8">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <h1 className="mb-2 break-words text-2xl font-heading font-extrabold sm:text-3xl">{quiz.title}</h1>
              <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 break-words text-sm font-medium text-muted-foreground sm:text-base">
                {subject?.code && <span>{subject.code}</span>}
                {subject?.code && subject?.name && <span aria-hidden="true">•</span>}
                {subject?.name && <span>{subject.name}</span>}
                {quiz.unit_name && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span>{quiz.unit_name}</span>
                  </>
                )}
              </p>
            </div>
            
            <CardContent className="p-5 sm:p-8">
              {quiz.description && (
                <div className="mx-auto mb-8 max-w-xl text-center">
                  <p className="break-words text-muted-foreground [overflow-wrap:anywhere]">{quiz.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-xl">
                  <HelpCircle className="w-6 h-6 text-primary mb-2" />
                  <span className="text-2xl font-bold">{questionCount}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Questions</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-xl">
                  <Clock className="w-6 h-6 text-primary mb-2" />
                  <span className="text-2xl font-bold">{quiz.duration_minutes ? quiz.duration_minutes : '∞'}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Minutes</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-xl">
                  <Info className="w-6 h-6 text-primary mb-2" />
                  <span className="text-2xl font-bold">{quiz.passing_score_percentage}%</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">To Pass</span>
                </div>
              </div>

              <div className="mb-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                <h4 className="font-bold mb-1 flex items-center">
                  <Info className="w-4 h-4 mr-2" /> Instructions
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 sm:pl-8">
                  <li>Once started, the timer cannot be paused.</li>
                  <li>Do not refresh the page during the exam.</li>
                  <li>Your answers will be automatically submitted when time runs out.</li>
                  {quiz.max_attempts && (
                    <li>You have <strong>{quiz.max_attempts - (attemptCount || 0)} attempts remaining</strong> out of {quiz.max_attempts}.</li>
                  )}
                </ul>
              </div>

              <div className="flex flex-col items-center">
                {hasReachedLimit ? (
                  <div className="text-red-500 font-bold mb-4">You have reached the maximum number of attempts for this quiz.</div>
                ) : (
                  <form action={`/quizzes/${quiz.id}/take`} method="POST" className="w-full sm:w-auto">
                    {/* A server action could also initiate the attempt, but we'll navigate to the actual client interface */}
                    <Link href={`/quizzes/${quiz.id}/take`} className={buttonVariants({ size: "lg", className: "w-full sm:w-64" })}>
                      <Play className="w-5 h-5 mr-2" /> Begin Attempt Now
                    </Link>
                  </form>
                )}
                
                {(attemptCount || 0) > 0 && (
                  <Link href={`/quiz-history`} className="text-sm text-primary hover:underline mt-4">
                    View previous attempts
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
