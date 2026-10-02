"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getFacultySubjects(facultyId: string) {
  const supabase = await createClient();
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };
  
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "administrator") return { success: false, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("faculty_subjects")
    .select("subject_id")
    .eq("faculty_id", facultyId);

  if (error) {
    console.error("Error fetching faculty subjects:", error);
    return { success: false, error: error.message };
  }

  return { success: true, subjectIds: data.map(row => row.subject_id) };
}

export async function updateFacultySubjects(facultyId: string, subjectIds: string[]) {
  const supabase = await createClient();
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };
  
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "administrator") return { success: false, error: "Unauthorized" };

  try {
    // 1. Delete existing assignments
    const { error: deleteError } = await supabase
      .from("faculty_subjects")
      .delete()
      .eq("faculty_id", facultyId);

    if (deleteError) throw deleteError;

    // 2. Insert new assignments
    if (subjectIds.length > 0) {
      const { error: insertError } = await supabase
        .from("faculty_subjects")
        .insert(
          subjectIds.map(subject_id => ({
            faculty_id: facultyId,
            subject_id: subject_id
          }))
        );

      if (insertError) throw insertError;
    }

    revalidatePath("/admin/users/faculty-assignments");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating faculty subjects:", err);
    return { success: false, error: err.message };
  }
}
