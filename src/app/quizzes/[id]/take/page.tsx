import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { QuizInterface } from "@/components/QuizInterface";
import { startQuizAttemptAction } from "@/app/actions/submit-quiz";

export default async function TakeQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify quiz is published
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (quizError || !quiz || quiz.status !== 'published') {
    notFound();
  }

  // Ensure they haven't exceeded attempts
  const { count: attemptCount } = await supabase
    .from("quiz_attempts")
    .select("id", { count: 'exact' })
    .eq("quiz_id", id)
    .eq("student_id", user.id);

  if (quiz.max_attempts && (attemptCount || 0) >= quiz.max_attempts) {
    redirect(`/quizzes/${id}`); // Kicks them back to intro page
  }

  // Fetch questions (DO NOT FETCH is_correct OR EXPLANATION to prevent cheating!)
  const { data: rawQuestions } = await supabase
    .from("quiz_questions")
    .select(`
      id, question_text, marks, order_index,
      options:quiz_options(id, option_text, order_index)
    `)
    .eq("quiz_id", id)
    .order("order_index", { ascending: true });

  if (!rawQuestions || rawQuestions.length === 0) {
    return <div className="p-8 text-center">This quiz has no questions yet!</div>;
  }

  // Shuffle questions randomly if we wanted to, but keeping it simple for now
  // We explicitly map to ensure no hidden fields leak from RLS bypass if we used service role
  const safeQuestions = rawQuestions.map(q => ({
    id: q.id,
    question_text: q.question_text,
    marks: q.marks,
    options: q.options?.sort((a: any, b: any) => a.order_index - b.order_index) || []
  }));

  // Create an attempt record immediately
  const res = await startQuizAttemptAction(id);
  if (!res.success || !res.attemptId) {
    return <div className="p-8 text-center text-red-500">Failed to initialize quiz session.</div>;
  }

  return <QuizInterface quiz={quiz} questions={safeQuestions} attemptId={res.attemptId} />;
}
