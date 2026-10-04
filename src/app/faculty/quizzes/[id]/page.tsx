import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { QuizMonitorRefresh } from "@/components/QuizMonitorRefresh";
import { ChevronLeft, Clock, Eye, Users } from "lucide-react";
import { format } from "@/lib/date-time";

export default async function QuizMonitorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "faculty") redirect("/dashboard");

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id, title, status, subject:subjects(name, code), questions:quiz_questions(id)")
    .eq("id", id)
    .eq("created_by", user.id)
    .maybeSingle();
  if (quizError) {
    console.error("Could not load quiz for monitoring:", quizError);
    return <div className="container mx-auto px-4 py-12 text-red-600">Could not load this quiz monitor.</div>;
  }
  if (!quiz) notFound();

  const { data: attempts, error: attemptsError } = await supabase
    .from("quiz_attempts")
    .select(`
      id, student_id, started_at, expires_at, completed_at,
      status, score, total_marks, percentage, is_passed, tab_switch_count,
      student:profiles(full_name)
    `)
    .eq("quiz_id", id)
    .order("started_at", { ascending: false });
  const attemptIds = attempts?.map(attempt => attempt.id) || [];
  const { data: answers, error: answersError } = attemptIds.length
    ? await supabase
        .from("quiz_answers")
        .select("attempt_id, selected_option_id")
        .in("attempt_id", attemptIds)
    : { data: [], error: null };
  if (answersError) console.error("Could not load quiz answer progress:", answersError);

  const answeredCountByAttempt = new Map<string, number>();
  for (const answer of answers || []) {
    if (!answer.selected_option_id) continue;
    answeredCountByAttempt.set(answer.attempt_id, (answeredCountByAttempt.get(answer.attempt_id) || 0) + 1);
  }

  const subject = Array.isArray(quiz.subject) ? quiz.subject[0] : quiz.subject;
  const activeCount = attempts?.filter(attempt => attempt.status === "in_progress").length || 0;

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <Link href="/faculty/quizzes" className={buttonVariants({ variant: "ghost", className: "mb-6" })}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to My Quizzes
      </Link>

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-heading font-extrabold">{quiz.title}</h1>
            <Badge variant={quiz.status === "published" ? "default" : "secondary"} className="capitalize">{quiz.status}</Badge>
          </div>
          <p className="text-muted-foreground">{subject?.code ? `${subject.code} · ` : ""}{subject?.name || "Subject"} · {attempts?.length || 0} total attempts</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/faculty/quizzes/${id}/questions`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Manage Questions
          </Link>
          <QuizMonitorRefresh />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-5"><Users className="h-5 w-5 text-primary" /><div><p className="text-sm text-muted-foreground">Total attempts</p><p className="text-2xl font-bold">{attempts?.length || 0}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><Clock className="h-5 w-5 text-primary" /><div><p className="text-sm text-muted-foreground">In progress</p><p className="text-2xl font-bold">{activeCount}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><Eye className="h-5 w-5 text-primary" /><div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold">{attempts?.filter(attempt => attempt.status === "completed").length || 0}</p></div></CardContent></Card>
      </div>

      {attemptsError || answersError ? (
        <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          Student attempts or answer progress could not be loaded. Please refresh the page.
        </div>
      ) : attempts?.length ? (
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Started</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Progress</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Tab switches</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {attempts.map(attempt => {
                  const student = Array.isArray(attempt.student) ? attempt.student[0] : attempt.student;
                  const expired = attempt.status === "in_progress" && attempt.expires_at && new Date(attempt.expires_at) <= new Date();
                  return (
                    <tr key={attempt.id} className="align-top">
                      <td className="px-4 py-4 font-medium">{student?.full_name || "Student"}</td>
                      <td className="px-4 py-4 text-muted-foreground">{format(new Date(attempt.started_at), "MMM d, yyyy h:mm a 'IST'")}</td>
                      <td className="px-4 py-4">
                        <Badge variant={attempt.status === "completed" ? "outline" : "secondary"} className="capitalize">
                          {expired ? "Time expired" : attempt.status.replace("_", " ")}
                        </Badge>
                        {attempt.completed_at && <div className="mt-1 text-xs text-muted-foreground">Submitted {format(new Date(attempt.completed_at), "MMM d, yyyy h:mm a 'IST'")}</div>}
                      </td>
                      <td className="px-4 py-4">{answeredCountByAttempt.get(attempt.id) || 0} / {quiz.questions?.length || 0}</td>
                      <td className="px-4 py-4">
                        {attempt.status === "completed" ? `${attempt.score ?? 0} / ${attempt.total_marks ?? 0} (${attempt.percentage ?? 0}%)` : "—"}
                      </td>
                      <td className="px-4 py-4">
                        {attempt.tab_switch_count}
                        <span className="ml-1 text-xs text-muted-foreground">logged</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
            The monitor refreshes every 15 seconds. A recorded tab switch is a review signal, not proof of misconduct.
            Expired active attempts finalize when the student reconnects or submits.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-bold">No attempts yet</h2>
          <p className="mt-2 text-muted-foreground">Student attempts will appear here after they begin this quiz.</p>
        </div>
      )}
    </main>
  );
}
