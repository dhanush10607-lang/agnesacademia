"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addQuizQuestionAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const readText = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };
  const quizId = readText("quiz_id");
  const questionText = readText("question_text");
  const marksInput = readText("marks");
  const marks = marksInput ? Number(marksInput) : 1;
  const explanation = readText("explanation");
  const correctOptionIndex = readText("correct_option");
  const optionTexts = ["option_a", "option_b", "option_c", "option_d"].map(readText);

  if (!quizId || !questionText || !optionTexts[0] || !optionTexts[1] || !/^[0-3]$/.test(correctOptionIndex)) {
    return { success: false, error: "Question text, at least two options, and a correct answer are required" };
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(quizId)) {
    return { success: false, error: "Invalid quiz." };
  }
  if (questionText.length > 4000 || explanation.length > 4000 || optionTexts.some(option => option.length > 1000)) {
    return { success: false, error: "Question text or options are too long." };
  }
  if (!Number.isInteger(marks) || marks < 1 || marks > 1000) {
    return { success: false, error: "Marks must be between 1 and 1000." };
  }
  if (!optionTexts[Number(correctOptionIndex)]) {
    return { success: false, error: "Select an answer that has an option." };
  }

  const options = optionTexts
    .map((option_text, order_index) => ({ option_text, order_index, is_correct: order_index === Number(correctOptionIndex) }))
    .filter(option => option.option_text);
  const { data, error } = await supabase.rpc("add_quiz_question", {
    p_quiz_id: quizId,
    p_question_text: questionText,
    p_marks: marks,
    p_explanation: explanation || null,
    p_options: options,
  });

  if (error) {
    console.error("Add quiz question RPC failed:", error);
    return { success: false, error: "Could not save the question. Please try again." };
  }
  if (!data || typeof data !== "object" || !("success" in data) || data.success !== true) {
    return {
      success: false,
      error: data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : "Could not save the question.",
    };
  }

  revalidatePath(`/faculty/quizzes/${quizId}/questions`);
  revalidatePath(`/faculty/quizzes/${quizId}`);
  return { success: true };
}
