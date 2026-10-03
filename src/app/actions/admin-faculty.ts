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

export async function updateFacultyAssignments(facultyId: string, subjectIds: string[], departmentIds: string[]) {
  const supabase = await createClient();
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };
  
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "administrator") return { success: false, error: "Unauthorized" };

  try {
    // 1. Update Subjects
    await supabase.from("faculty_subjects").delete().eq("faculty_id", facultyId);
    if (subjectIds.length > 0) {
      const { error: insertError } = await supabase.from("faculty_subjects").insert(
        subjectIds.map(subject_id => ({ faculty_id: facultyId, subject_id: subject_id }))
      );
      if (insertError) throw insertError;
    }

    // 2. Update Departments
    await supabase.from("faculty_departments").delete().eq("faculty_id", facultyId);
    if (departmentIds.length > 0) {
      const { error: insertError } = await supabase.from("faculty_departments").insert(
        departmentIds.map(dept_id => ({ faculty_id: facultyId, department_id: dept_id }))
      );
      if (insertError) throw insertError;
    }

    revalidatePath("/admin/users/faculty-assignments");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating faculty assignments:", err);
    return { success: false, error: err.message };
  }
}
