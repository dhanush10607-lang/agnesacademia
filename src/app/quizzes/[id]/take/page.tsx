import { startQuizAttemptAction } from "@/app/actions/submit-quiz";
import { QuizInterface } from "@/components/QuizInterface";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function TakeQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Could not load student name for quiz watermark:", profileError);
  }

  const result = await startQuizAttemptAction(id);
  if (!result.success) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold">Quiz unavailable</h1>
        <p className="mb-6 text-muted-foreground">{result.error}</p>
        <Link href={`/quizzes/${id}`} className={buttonVariants()}>
          Return to quiz details
        </Link>
      </div>
    );
  }

  if ("completedAttemptId" in result) {
    redirect(`/quizzes/${id}/result?attempt=${result.completedAttemptId}`);
  }

  const studentLabel = profile?.full_name?.trim() || `Student ${user.id.slice(0, 8)}`;
  const watermarkLabel = `${studentLabel} · Attempt ${result.attempt.attemptId.slice(0, 8)}`;

  return <QuizInterface {...result.attempt} watermarkLabel={watermarkLabel} />;
}
