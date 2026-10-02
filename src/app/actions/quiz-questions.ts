"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addQuizQuestionAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const quizId = formData.get("quiz_id") as string;
  const questionText = formData.get("question_text") as string;
  const marks = parseInt(formData.get("marks") as string) || 1;
  const explanation = formData.get("explanation") as string;
  
  // MCQ Options
  const optionA = formData.get("option_a") as string;
  const optionB = formData.get("option_b") as string;
  const optionC = formData.get("option_c") as string;
  const optionD = formData.get("option_d") as string;
  const correctOptionIndex = formData.get("correct_option") as string; // '0', '1', '2', '3'

  if (!quizId || !questionText || !optionA || !optionB || !correctOptionIndex) {
    return { success: false, error: "Question text, at least two options, and a correct answer are required" };
  }

  try {
    // 1. Verify ownership of quiz
    const { data: quiz } = await supabase.from("quizzes").select("created_by").eq("id", quizId).single();
    if (!quiz || quiz.created_by !== user.id) {
      return { success: false, error: "Unauthorized to edit this quiz" };
    }

    // 2. Insert Question
    const { data: question, error: qError } = await supabase
      .from("quiz_questions")
      .insert({
        quiz_id: quizId,
        question_text: questionText,
        question_type: 'mcq',
        marks: marks,
        explanation: explanation || null
      })
      .select("id")
      .single();

    if (qError || !question) throw qError;

    // 3. Insert Options
    const optionsToInsert = [
      { question_id: question.id, option_text: optionA, is_correct: correctOptionIndex === '0', order_index: 0 },
      { question_id: question.id, option_text: optionB, is_correct: correctOptionIndex === '1', order_index: 1 },
    ];

    if (optionC) optionsToInsert.push({ question_id: question.id, option_text: optionC, is_correct: correctOptionIndex === '2', order_index: 2 });
    if (optionD) optionsToInsert.push({ question_id: question.id, option_text: optionD, is_correct: correctOptionIndex === '3', order_index: 3 });

    const { error: optError } = await supabase
      .from("quiz_options")
      .insert(optionsToInsert);

    if (optError) throw optError;

    revalidatePath(`/faculty/quizzes/${quizId}/questions`);
    
    return { success: true };
  } catch (error) {
    console.error("Add question error:", error);
    return { success: false, error: "Internal server error saving question" };
  }
}
