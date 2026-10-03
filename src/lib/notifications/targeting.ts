import { createClient } from "@supabase/supabase-js";

export async function getTargetUserIds(
  departmentId?: string | null,
  programmeId?: string | null,
  semesterId?: string | null,
  subjectId?: string | null,
  curriculumId?: string | null
): Promise<string[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  let query = supabase.from("profiles").select("id").eq("role", "student").eq("account_status", "active");

  if (departmentId) query = query.eq("department_id", departmentId);
  if (programmeId) query = query.eq("programme_id", programmeId);
  if (curriculumId) query = query.eq("curriculum_id", curriculumId);

  // Note: we still support legacy semester_id if needed, but it should ideally come from student_subjects
  if (semesterId) query = query.eq("semester_id", semesterId);

  const { data, error } = await query;
  if (error || !data) {
    console.error("Error targeting users:", error);
    return [];
  }

  let userIds = data.map((u) => u.id);

  if (subjectId && userIds.length > 0) {
    // Further filter by subject enrollment
    const { data: subjectData, error: subjectError } = await supabase
      .from("student_subjects")
      .select("student_id")
      .eq("subject_id", subjectId)
      .eq("enrollment_status", "ENROLLED")
      .in("student_id", userIds);

    if (subjectError || !subjectData) {
       console.error("Error fetching subject enrollments:", subjectError);
       return [];
    }
    
    // Deduplicate logic using Set
    const enrolledIds = new Set(subjectData.map(s => s.student_id));
    userIds = userIds.filter(id => enrolledIds.has(id));
  }

  return userIds;
}
