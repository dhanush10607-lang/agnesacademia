import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { BrainCircuit, Clock, HelpCircle, Plus } from "lucide-react";

export default async function FacultyQuizzesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "faculty") redirect("/dashboard");

  const { data: quizzes, error } = await supabase
    .from("quizzes")
    .select(`
      id, title, status, created_at, duration_minutes,
      subject:subjects(name, code),
      questions:quiz_questions(count),
      attempts:quiz_attempts(count)
    `)
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  if (error) console.error("Could not load faculty quizzes:", error);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center text-3xl font-heading font-extrabold">
            <BrainCircuit className="mr-3 h-8 w-8 text-primary" /> My Quizzes
          </h1>
          <p className="mt-2 text-muted-foreground">Create quizzes, manage questions, and monitor student attempts.</p>
        </div>
        <Link href="/faculty/quizzes/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" /> Create Quiz
        </Link>
      </div>

      {error ? (
        <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          Quizzes could not be loaded. Please refresh the page.
        </div>
      ) : quizzes?.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {quizzes.map(quiz => {
            const subject = Array.isArray(quiz.subject) ? quiz.subject[0] : quiz.subject;
            const questionCount = quiz.questions?.[0]?.count || 0;
            const attemptCount = quiz.attempts?.[0]?.count || 0;
            return (
              <Card key={quiz.id} className="flex flex-col border-border shadow-sm">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Badge variant={quiz.status === "published" ? "default" : "secondary"} className="capitalize">
                      {quiz.status}
                    </Badge>
                    <span className="truncate text-sm text-muted-foreground">{subject?.code || subject?.name || "Subject"}</span>
                  </div>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-grow flex-col justify-between gap-5">
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center"><HelpCircle className="mr-1.5 h-4 w-4" />{questionCount} questions</span>
                    <span className="flex items-center"><Clock className="mr-1.5 h-4 w-4" />{quiz.duration_minutes ? `${quiz.duration_minutes} min` : "No time limit"}</span>
                    <span>{attemptCount} attempts</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/faculty/quizzes/${quiz.id}/questions`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      Manage Questions
                    </Link>
                    <Link href={`/faculty/quizzes/${quiz.id}`} className={buttonVariants({ size: "sm" })}>
                      Monitor Attempts
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <BrainCircuit className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-bold">No quizzes created yet</h2>
          <p className="mb-5 mt-2 text-muted-foreground">Create a quiz for one of your assigned subjects.</p>
          <Link href="/faculty/quizzes/new" className={buttonVariants()}>Create your first quiz</Link>
        </div>
      )}
    </main>
  );
}
