"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDepartmentAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'administrator') {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return { success: false, error: "Department name is required" };

  try {
    const { data: dept, error } = await supabase
      .from("departments")
      .insert({ name, description })
      .select()
      .single();

    if (error) throw error;

    // Audit log
    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: 'create',
      target_type: 'department',
      target_id: dept.id,
      metadata: { name }
    });

    revalidatePath("/admin/academic/departments");
    return { success: true };
  } catch (error) {
    console.error("Create department error:", error);
    return { success: false, error: "Failed to create department" };
  }
}

export async function archiveDepartmentAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'administrator') {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { error } = await supabase
      .from("departments")
      .update({ status: 'archived' })
      .eq("id", id);

    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: 'archive',
      target_type: 'department',
      target_id: id
    });

    revalidatePath("/admin/academic/departments");
    return { success: true };
  } catch (error) {
    console.error("Archive department error:", error);
    return { success: false, error: "Failed to archive department" };
  }
}

export async function createProgrammeAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const departmentValue = formData.get("department_id");
  const department_id = typeof departmentValue === "string" && departmentValue
    ? departmentValue
    : null;

  try {
    const { data: p, error } = await supabase.from("programmes").insert({ name, code, department_id }).select().single();
    if (error) throw error;
    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: 'create', target_type: 'programme', target_id: p.id, metadata: { name, code } });
    revalidatePath("/admin/academic/programmes");
    return { success: true };
  } catch (error) { return { success: false, error: "Failed" }; }
}

export async function archiveProgrammeAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    await supabase.from("programmes").update({ status: 'archived' }).eq("id", id);
    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: 'archive', target_type: 'programme', target_id: id });
    revalidatePath("/admin/academic/programmes");
    return { success: true };
  } catch (error) { return { success: false, error: "Failed" }; }
}

export async function createYearAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const name = formData.get("name") as string;
  const programme_id = formData.get("programme_id") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  try {
    const { data: y, error } = await supabase.from("academic_years").insert({ name, programme_id, start_date, end_date }).select().single();
    if (error) throw error;
    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: 'create', target_type: 'academic_year', target_id: y.id, metadata: { name } });
    revalidatePath("/admin/academic/years");
    return { success: true };
  } catch (error) { return { success: false, error: error instanceof Error ? error.message : JSON.stringify(error) }; }
}

export async function archiveYearAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    await supabase.from("academic_years").update({ status: 'archived' }).eq("id", id);
    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: 'archive', target_type: 'academic_year', target_id: id });
    revalidatePath("/admin/academic/years");
    return { success: true };
  } catch (error) { return { success: false, error: "Failed" }; }
}

export async function createSemesterAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const name = formData.get("name") as string;
  const programme_id = formData.get("programme_id") as string;
  const academic_year_id = formData.get("academic_year_id") as string;

  try {
    const { data: academicYear, error: academicYearError } = await supabase
      .from("academic_years")
      .select("programme_id")
      .eq("id", academic_year_id)
      .eq("status", "active")
      .single();

    if (academicYearError || !academicYear) {
      return { success: false, error: "The selected academic year is not available." };
    }
    if (academicYear.programme_id !== programme_id) {
      return { success: false, error: "The academic year must belong to the selected programme." };
    }

    const { data: s, error } = await supabase.from("semesters").insert({ name, programme_id, academic_year_id }).select().single();
    if (error) throw error;
    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: 'create', target_type: 'semester', target_id: s.id, metadata: { name } });
    revalidatePath("/admin/academic/semesters");
    return { success: true };
  } catch (error) { return { success: false, error: "Failed" }; }
}

export async function archiveSemesterAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    await supabase.from("semesters").update({ status: 'archived' }).eq("id", id);
    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: 'archive', target_type: 'semester', target_id: id });
    revalidatePath("/admin/academic/semesters");
    return { success: true };
  } catch (error) { return { success: false, error: "Failed" }; }
}

export async function createSubjectAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const semester_id = formData.get("semester_id") as string;
  const department_ids = formData.getAll("department_ids") as string[];

  try {
    const { data: s, error } = await supabase.from("subjects").insert({ name, code, semester_id }).select().single();
    if (error) throw error;

    if (department_ids.length > 0) {
      const deptInserts = department_ids.map(id => ({ subject_id: s.id, department_id: id }));
      await supabase.from("subject_departments").insert(deptInserts);
    }

    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: 'create', target_type: 'subject', target_id: s.id, metadata: { name, code } });
    revalidatePath("/admin/academic/subjects");
    return { success: true };
  } catch (error) { return { success: false, error: "Failed" }; }
}

export async function archiveSubjectAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    await supabase.from("subjects").update({ status: 'archived' }).eq("id", id);
    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: 'archive', target_type: 'subject', target_id: id });
    revalidatePath("/admin/academic/subjects");
    return { success: true };
  } catch (error) { return { success: false, error: "Failed" }; }
}
