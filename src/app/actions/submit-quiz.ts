"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitQuizAction(attemptId: string, quizId: string, answers: Record<string, string>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  // 1. Fetch the quiz and all questions with correct options securely
  const { data: quiz } = await supabase.from("quizzes").select("passing_score_percentage").eq("id", quizId).single();
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select(`
      id, marks,
      options:quiz_options(id, is_correct)
    `)
    .eq("quiz_id", quizId);

  if (!quiz || !questions) {
    return { success: false, error: "Quiz not found" };
  }

  let score = 0;
  let totalMarks = 0;
  const answerInserts = [];

  // 2. Calculate score and prepare answer rows
  for (const q of questions) {
    totalMarks += q.marks;
    const selectedOptionId = answers[q.id];
    
    // Find correct option
    const correctOption = q.options?.find((o: any) => o.is_correct);
    
    let isCorrect = false;
    let marksAwarded = 0;

    if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
      isCorrect = true;
      marksAwarded = q.marks;
      score += q.marks;
    }

    answerInserts.push({
      attempt_id: attemptId,
      question_id: q.id,
      selected_option_id: selectedOptionId || null,
      is_correct: isCorrect,
      marks_awarded: marksAwarded
    });
  }

  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
  const isPassed = percentage >= (quiz.passing_score_percentage || 40);

  try {
    // 3. Update Attempt Record
    const { error: attemptError } = await supabase
      .from("quiz_attempts")
      .update({
        completed_at: new Date().toISOString(),
        score,
        total_marks: totalMarks,
        percentage,
        is_passed: isPassed,
        status: 'completed'
      })
      .eq("id", attemptId)
      .eq("student_id", user.id);

    if (attemptError) throw attemptError;

    // 4. Insert Answers
    const { error: answersError } = await supabase
      .from("quiz_answers")
      .insert(answerInserts);

    if (answersError) throw answersError;

    return { success: true, attemptId };
  } catch (error) {
    console.error("Quiz submission error:", error);
    return { success: false, error: "Failed to submit quiz" };
  }
}

export async function startQuizAttemptAction(quizId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: attempt, error } = await supabase
    .from("quiz_attempts")
    .insert({
      quiz_id: quizId,
      student_id: user.id,
      status: 'in_progress'
    })
    .select("id")
    .single();

  if (error || !attempt) {
    return { success: false, error: "Failed to start attempt" };
  }

  return { success: true, attemptId: attempt.id };
}
