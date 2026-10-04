import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { BrainCircuit, Clock, CheckCircle, XCircle, ChevronRight, History } from "lucide-react";
import Link from "next/link";
import { format } from "@/lib/date-time";

export default async function QuizHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all attempts for the student
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select(`
      *,
      quiz:quizzes(title, subject_id, subject:subjects(code))
    `)
    .eq("student_id", user.id)
    .order("started_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto min-w-0 max-w-5xl px-3 py-6 pb-32 sm:px-4 sm:py-8">
        <div className="mb-8 flex items-start gap-3">
          <History className="mt-1 h-7 w-7 shrink-0 text-primary sm:h-8 sm:w-8" />
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-heading font-extrabold text-foreground sm:text-3xl">
              Quiz Attempt History
            </h1>
            <p className="text-muted-foreground">
              Review your past quiz performances and scores.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {attempts && attempts.length > 0 ? (
            attempts.map((attempt) => (
              <Card key={attempt.id} className="border-border shadow-sm hover:border-primary/50 transition-colors overflow-hidden">
                <CardContent className="p-0 flex flex-col sm:flex-row items-stretch">
                  <div className={`w-2 sm:w-3 shrink-0 ${attempt.status !== 'completed' ? 'bg-yellow-500' : attempt.is_passed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  
                  <div className="p-4 sm:p-6 flex-grow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-grow">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="max-w-full whitespace-normal break-words bg-primary/5 text-primary border-primary/20">
                          {((attempt.quiz as any)?.subject as any)?.code || "Subject"}
                        </Badge>
                        {attempt.status !== 'completed' && (
                          <Badge variant="secondary" className="whitespace-normal bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            In Progress / Abandoned
                          </Badge>
                        )}
                      </div>
                      <h3 className="mb-1 break-words text-lg font-bold text-foreground [overflow-wrap:anywhere]">
                        {(attempt.quiz as any)?.title || "Unknown Quiz"}
                      </h3>
                      <div className="flex min-w-0 items-start text-sm text-muted-foreground">
                        <Clock className="mr-1 mt-0.5 h-4 w-4 shrink-0" />
                        <span className="break-words [overflow-wrap:anywhere]">
                          {format(new Date(attempt.started_at), "MMM d, yyyy 'at' h:mm a 'IST'")}
                        </span>
                      </div>
                    </div>

                    {attempt.status === 'completed' && (
                      <div className="flex w-full shrink-0 items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-3 sm:w-auto sm:justify-start sm:gap-6 sm:px-6">
                        <div className="text-center">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Score</p>
                          <p className="font-black text-xl">{attempt.score}<span className="text-muted-foreground text-sm">/{attempt.total_marks}</span></p>
                        </div>
                        <div className="w-px h-10 bg-border"></div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Result</p>
                          {attempt.is_passed ? (
                            <p className="flex items-center font-black text-lg text-green-600 dark:text-green-500 sm:text-xl">
                              <CheckCircle className="w-4 h-4 mr-1" /> Pass
                            </p>
                          ) : (
                            <p className="flex items-center font-black text-lg text-red-600 dark:text-red-500 sm:text-xl">
                              <XCircle className="w-4 h-4 mr-1" /> Fail
                            </p>
                          )}
                        </div>
                        <Link href={`/quizzes/${attempt.quiz_id}/result?attempt=${attempt.id}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center border border-dashed rounded-xl bg-muted/10">
              <History className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No attempts yet</h3>
              <p className="text-muted-foreground">You haven't taken any quizzes yet.</p>
              <Link href="/quizzes" className={buttonVariants({ className: "mt-4" })}>
                Browse Quizzes
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
