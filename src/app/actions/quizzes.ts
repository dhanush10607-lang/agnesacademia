"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createQuizAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  
  if (!profile || (profile.role !== 'faculty' && profile.role !== 'administrator')) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subjectId = formData.get("subject_id") as string;
    const unitName = formData.get("unit_name") as string;
    const difficulty = formData.get("difficulty") as string;
    const duration = formData.get("duration") as string;
    const passingScore = formData.get("passing_score") as string;
    const status = formData.get("status") as string;

    if (!title || !subjectId) {
      return { success: false, error: "Title and Subject are required" };
    }

    const { data: quiz, error: insertError } = await supabase
      .from("quizzes")
      .insert({
        title,
        description,
        subject_id: subjectId,
        unit_name: unitName || null,
        difficulty: difficulty || 'medium',
        duration_minutes: duration ? parseInt(duration) : null,
        passing_score_percentage: passingScore ? parseInt(passingScore) : 40,
        status: status || 'draft',
        created_by: user.id
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("DB error:", insertError);
      return { success: false, error: "Failed to create quiz" };
    }

    revalidatePath("/faculty");
    
    return { success: true, quizId: quiz.id };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Internal server error" };
  }
}
