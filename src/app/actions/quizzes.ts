"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function readText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function createQuizAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "faculty") return { success: false, error: "Only faculty can create quizzes" };

  const title = readText(formData, "title");
  const description = readText(formData, "description");
  const subjectId = readText(formData, "subject_id");
  const unitName = readText(formData, "unit_name");
  const difficulty = readText(formData, "difficulty") || "medium";
  const durationInput = readText(formData, "duration");
  const passingInput = readText(formData, "passing_score") || "40";
  const duration = durationInput ? Number(durationInput) : null;
  const passingScore = Number(passingInput);

  if (!title || title.length > 160 || !subjectId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subjectId)) {
    return { success: false, error: "Enter a quiz title (up to 160 characters) and select a subject." };
  }
  if (description.length > 2000 || unitName.length > 100) {
    return { success: false, error: "Description or unit name is too long." };
  }
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return { success: false, error: "Select a valid difficulty." };
  }
  if (duration !== null && (!Number.isInteger(duration) || duration < 1 || duration > 180)) {
    return { success: false, error: "Duration must be between 1 and 180 minutes." };
  }
  if (!Number.isInteger(passingScore) || passingScore < 1 || passingScore > 100) {
    return { success: false, error: "Passing score must be between 1 and 100 percent." };
  }

  const { data: assignment, error: assignmentError } = await supabase
    .from("faculty_subjects")
    .select("subject_id")
    .eq("faculty_id", user.id)
    .eq("subject_id", subjectId)
    .maybeSingle();
  if (assignmentError) {
    console.error("Faculty subject authorization check failed:", assignmentError);
    return { success: false, error: "Could not verify your subject assignment." };
  }
  if (!assignment) return { success: false, error: "You can only create quizzes for subjects assigned to you." };

  const { data: quiz, error: insertError } = await supabase
    .from("quizzes")
    .insert({
      title,
      description: description || null,
      subject_id: subjectId,
      unit_name: unitName || null,
      difficulty,
      duration_minutes: duration,
      passing_score_percentage: passingScore,
      status: "draft",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (insertError || !quiz) {
    console.error("Quiz creation failed:", insertError);
    return { success: false, error: "Failed to create quiz." };
  }

  revalidatePath("/faculty/quizzes");
  revalidatePath("/faculty");
  return { success: true, quizId: quiz.id };
}

export async function setQuizStatusAction(quizId: string, status: "draft" | "published") {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(quizId)) {
    return { success: false, error: "Invalid quiz." };
  }
  if (status !== "draft" && status !== "published") {
    return { success: false, error: "Invalid quiz status." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "faculty") return { success: false, error: "Only faculty can manage quizzes." };

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id, status")
    .eq("id", quizId)
    .eq("created_by", user.id)
    .maybeSingle();
  if (quizError) {
    console.error("Quiz authorization check failed:", quizError);
    return { success: false, error: "Could not load this quiz." };
  }
  if (!quiz) return { success: false, error: "You are not authorized to manage this quiz." };

  if (status === "published") {
    const { data: questions, error: questionsError } = await supabase
      .from("quiz_questions")
      .select("id")
      .eq("quiz_id", quizId);
    if (questionsError) {
      console.error("Quiz publication question check failed:", questionsError);
      return { success: false, error: "Could not verify quiz questions." };
    }
    if (!questions?.length) return { success: false, error: "Add at least one question before publishing." };

    const { data: options, error: optionsError } = await supabase
      .from("quiz_faculty_options")
      .select("question_id, is_correct")
      .in("question_id", questions.map(question => question.id));
    if (optionsError) {
      console.error("Quiz publication answer-key check failed:", optionsError);
      return { success: false, error: "Could not verify question options." };
    }

    const optionsByQuestion = new Map<string, { total: number; correct: number }>();
    for (const option of options || []) {
      const summary = optionsByQuestion.get(option.question_id) || { total: 0, correct: 0 };
      summary.total += 1;
      if (option.is_correct) summary.correct += 1;
      optionsByQuestion.set(option.question_id, summary);
    }
    if (questions.some(question => {
      const summary = optionsByQuestion.get(question.id);
      return !summary || summary.total < 2 || summary.correct !== 1;
    })) {
      return { success: false, error: "Every question needs at least two options and exactly one correct answer." };
    }
  }

  const { error: updateError } = await supabase
    .from("quizzes")
    .update({ status })
    .eq("id", quizId)
    .eq("created_by", user.id);
  if (updateError) {
    console.error("Quiz status update failed:", updateError);
    return {
      success: false,
      error: updateError.message.includes("in-progress attempt")
        ? "This quiz cannot be unpublished while a student is taking it."
        : "Could not update quiz status.",
    };
  }

  revalidatePath("/faculty/quizzes");
  revalidatePath(`/faculty/quizzes/${quizId}`);
  revalidatePath("/quizzes");
  return { success: true };
}
