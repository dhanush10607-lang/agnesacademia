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
    const { data: facultyProfile, error: facultyProfileError } = await supabase
      .from("profiles")
      .select("role, department_id")
      .eq("id", facultyId)
      .single();
    if (facultyProfileError) throw facultyProfileError;
    if (facultyProfile.role !== "faculty") {
      return { success: false, error: "Selected user is not a faculty member." };
    }

    // 1. Update Subjects
    const { error: deleteSubjectsError } = await supabase
      .from("faculty_subjects")
      .delete()
      .eq("faculty_id", facultyId);
    if (deleteSubjectsError) throw deleteSubjectsError;

    if (subjectIds.length > 0) {
      const { error: insertError } = await supabase.from("faculty_subjects").insert(
        subjectIds.map(subject_id => ({ faculty_id: facultyId, subject_id: subject_id }))
      );
      if (insertError) throw insertError;
    }

    // 2. Update Departments
    const { error: deleteDepartmentsError } = await supabase
      .from("faculty_departments")
      .delete()
      .eq("faculty_id", facultyId);
    if (deleteDepartmentsError) throw deleteDepartmentsError;

    if (departmentIds.length > 0) {
      const { error: insertError } = await supabase.from("faculty_departments").insert(
        departmentIds.map(dept_id => ({ faculty_id: facultyId, department_id: dept_id }))
      );
      if (insertError) throw insertError;
    }

    const primaryDepartmentId = facultyProfile.department_id && departmentIds.includes(facultyProfile.department_id)
      ? facultyProfile.department_id
      : departmentIds[0] || null;
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({ department_id: primaryDepartmentId })
      .eq("id", facultyId);
    if (updateProfileError) throw updateProfileError;

    revalidatePath("/admin/users/faculty-assignments");
    revalidatePath("/admin/users");
    revalidatePath("/faculty");
    revalidatePath("/dashboard");
    revalidatePath("/calendar");
    revalidatePath("/notices");
    revalidatePath("/profile/academic");
    return { success: true };
  } catch (err) {
    console.error("Error updating faculty assignments:", err);
    const errorMessage = err instanceof Error
      ? err.message
      : typeof err === "object" && err !== null && "message" in err && typeof err.message === "string"
        ? err.message
        : "Failed to update faculty assignments.";
    return { success: false, error: errorMessage };
  }
}
