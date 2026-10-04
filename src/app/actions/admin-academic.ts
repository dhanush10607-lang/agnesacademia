"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function isAdministrator(supabase: ServerSupabaseClient, userId: string) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return !error && profile?.role === "administrator";
}

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
  if (!(await isAdministrator(supabase, user.id))) {
    return { success: false, error: "Unauthorized" };
  }

  const nameValue = formData.get("name");
  const programmeValue = formData.get("programme_id");
  const allowedYears = ["I Year", "II Year", "III Year"];
  if (typeof nameValue !== "string" || !allowedYears.includes(nameValue)) {
    return { success: false, error: "Select a valid study year." };
  }
  if (typeof programmeValue !== "string" || !programmeValue) {
    return { success: false, error: "Select a programme." };
  }
  const name = nameValue;
  const programme_id = programmeValue;

  try {
    const { data: programme, error: programmeError } = await supabase
      .from("programmes")
      .select("id")
      .eq("id", programme_id)
      .eq("status", "active")
      .single();
    if (programmeError || !programme) {
      return { success: false, error: "Select an active programme." };
    }

    const { data: existingYear, error: existingYearError } = await supabase
      .from("academic_years")
      .select("id, status")
      .eq("programme_id", programme_id)
      .eq("name", name)
      .maybeSingle();
    if (existingYearError) throw existingYearError;
    if (existingYear?.status === "active") {
      return { success: false, error: "That study year already exists for this programme." };
    }

    if (existingYear) {
      const { error } = await supabase
        .from("academic_years")
        .update({ status: "active" })
        .eq("id", existingYear.id);
      if (error) throw error;
      await supabase.from("admin_audit_logs").insert({
        actor_id: user.id,
        action: "restore",
        target_type: "academic_year",
        target_id: existingYear.id,
        metadata: { name },
      });
      revalidatePath("/admin/academic/years");
      revalidatePath("/admin/academic/semesters");
      return { success: true };
    }

    const { data: y, error } = await supabase
      .from("academic_years")
      .insert({ name, programme_id })
      .select()
      .single();
    if (error) throw error;
    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: 'create', target_type: 'academic_year', target_id: y.id, metadata: { name } });
    revalidatePath("/admin/academic/years");
    revalidatePath("/admin/academic/semesters");
    return { success: true };
  } catch (error) { return { success: false, error: error instanceof Error ? error.message : JSON.stringify(error) }; }
}

export async function archiveYearAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };
  if (!(await isAdministrator(supabase, user.id))) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await supabase.from("academic_years").update({ status: 'archived' }).eq("id", id);
    await supabase.from("admin_audit_logs").insert({ actor_id: user.id, action: 'archive', target_type: 'academic_year', target_id: id });
    revalidatePath("/admin/academic/years");
    return { success: true };
  } catch (error) { return { success: false, error: "Failed" }; }
}

export async function createAcademicSessionAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };
  if (!(await isAdministrator(supabase, user.id))) {
    return { success: false, error: "Unauthorized" };
  }

  const nameValue = formData.get("name");
  const programmeValue = formData.get("programme_id");
  const startDateValue = formData.get("start_date");
  const endDateValue = formData.get("end_date");
  if (typeof nameValue !== "string" || !/^\d{4}-\d{4}$/.test(nameValue)) {
    return { success: false, error: "Session name must use the YYYY-YYYY format." };
  }
  if (typeof programmeValue !== "string" || !programmeValue) {
    return { success: false, error: "Select a programme." };
  }
  if (typeof startDateValue !== "string" || typeof endDateValue !== "string" ||
      !startDateValue || !endDateValue || startDateValue > endDateValue) {
    return { success: false, error: "Enter a valid session date range." };
  }

  try {
    const { data: programme, error: programmeError } = await supabase
      .from("programmes")
      .select("id")
      .eq("id", programmeValue)
      .eq("status", "active")
      .single();
    if (programmeError || !programme) {
      return { success: false, error: "Select an active programme." };
    }

    const { data: session, error } = await supabase
      .from("academic_sessions")
      .insert({
        name: nameValue,
        programme_id: programmeValue,
        start_date: startDateValue,
        end_date: endDateValue,
      })
      .select()
      .single();
    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "create",
      target_type: "academic_session",
      target_id: session.id,
      metadata: { name: nameValue },
    });
    revalidatePath("/admin/academic/years");
    return { success: true };
  } catch (error) {
    console.error("Create academic session error:", error);
    return { success: false, error: "Failed to create academic session." };
  }
}

export async function archiveAcademicSessionAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };
  if (!(await isAdministrator(supabase, user.id))) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { error } = await supabase
      .from("academic_sessions")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "archive",
      target_type: "academic_session",
      target_id: id,
    });
    revalidatePath("/admin/academic/years");
    return { success: true };
  } catch (error) {
    console.error("Archive academic session error:", error);
    return { success: false, error: "Failed to archive academic session." };
  }
}

export async function createSemesterAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };
  if (!(await isAdministrator(supabase, user.id))) {
    return { success: false, error: "Unauthorized" };
  }

  const nameValue = formData.get("name");
  const programmeValue = formData.get("programme_id");
  const yearValue = formData.get("academic_year_id");
  const sessionValue = formData.get("academic_session_id");
  if (typeof nameValue !== "string" || !nameValue.trim()) {
    return { success: false, error: "Semester name is required." };
  }
  if (typeof programmeValue !== "string" || !programmeValue ||
      typeof yearValue !== "string" || !yearValue ||
      typeof sessionValue !== "string" || !sessionValue) {
    return { success: false, error: "Select a programme, study year, and academic session." };
  }
  const name = nameValue.trim();
  const programme_id = programmeValue;
  const academic_year_id = yearValue;
  const academic_session_id = sessionValue;
  const normalizedSemester = name.trim().toLowerCase().match(/^semester\s+(1|2|3|4|5|6|i|ii|iii|iv|v|vi)$/)?.[1];
  const semesterYear = normalizedSemester
    ? (["1", "2", "i", "ii"].includes(normalizedSemester)
      ? "I Year"
      : (["3", "4", "iii", "iv"].includes(normalizedSemester) ? "II Year" : "III Year"))
    : null;

  if (!semesterYear) {
    return { success: false, error: "Semester must be named Semester 1–6 or Semester I–VI." };
  }

  try {
    const { data: academicYear, error: academicYearError } = await supabase
      .from("academic_years")
      .select("programme_id, name")
      .eq("id", academic_year_id)
      .eq("status", "active")
      .single();

    if (academicYearError || !academicYear) {
      return { success: false, error: "The selected academic year is not available." };
    }
    if (academicYear.programme_id !== programme_id) {
      return { success: false, error: "The academic year must belong to the selected programme." };
    }
    if (academicYear.name !== semesterYear) {
      return { success: false, error: `${name} must belong to ${semesterYear}.` };
    }

    const { data: academicSession, error: academicSessionError } = await supabase
      .from("academic_sessions")
      .select("programme_id")
      .eq("id", academic_session_id)
      .eq("status", "active")
      .single();
    if (academicSessionError || !academicSession) {
      return { success: false, error: "The selected academic session is not available." };
    }
    if (academicSession.programme_id !== programme_id) {
      return { success: false, error: "The academic session must belong to the selected programme." };
    }

    const { data: s, error } = await supabase.from("semesters").insert({
      name,
      programme_id,
      academic_year_id,
      academic_session_id,
    }).select().single();
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
  if (!(await isAdministrator(supabase, user.id))) {
    return { success: false, error: "Unauthorized" };
  }

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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profileError || profile?.role !== "administrator") {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const semester_id = formData.get("semester_id") as string;
  const department_id = formData.get("department_id") as string;

  if (!name || !semester_id || !department_id) {
    return { success: false, error: "Subject name, department, and semester are required." };
  }

  try {
    const { data: semester, error: semesterError } = await supabase
      .from("semesters")
      .select("id, programme_id, academic_year:academic_years(programme_id)")
      .eq("id", semester_id)
      .eq("status", "active")
      .single();

    if (semesterError || !semester) {
      return { success: false, error: "The selected semester is not available." };
    }

    const academicYear = Array.isArray(semester.academic_year)
      ? semester.academic_year[0]
      : semester.academic_year;
    const semesterProgrammeId = semester.programme_id ?? academicYear?.programme_id;
    if (!semesterProgrammeId) {
      return { success: false, error: "The selected semester is not linked to a programme." };
    }
    const { data: semesterProgramme, error: programmeError } = await supabase
      .from("programmes")
      .select("department_id")
      .eq("id", semesterProgrammeId)
      .single();

    if (programmeError || semesterProgramme?.department_id !== department_id) {
      return { success: false, error: "Select a semester that belongs to the selected department." };
    }

    const { data: s, error } = await supabase
      .from("subjects")
      .insert({ name, code, semester_id, department_id })
      .select()
      .single();
    if (error) throw error;

    const { error: subjectDepartmentError } = await supabase
      .from("subject_departments")
      .insert({ subject_id: s.id, department_id });
    if (subjectDepartmentError) throw subjectDepartmentError;

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
