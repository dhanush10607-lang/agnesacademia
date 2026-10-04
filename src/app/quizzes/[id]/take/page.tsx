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

  return <QuizInterface {...result.attempt} />;
}
