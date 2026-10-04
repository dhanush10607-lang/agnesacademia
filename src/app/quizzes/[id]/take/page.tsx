import { QuizLauncher } from "@/components/QuizLauncher";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

  const studentLabel = profile?.full_name?.trim() || `Student ${user.id.slice(0, 8)}`;

  return <QuizLauncher quizId={id} studentLabel={studentLabel} />;
}
