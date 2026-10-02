import { createClient } from "@supabase/supabase-js";

export async function getTargetUserIds(
  departmentId?: string | null,
  programmeId?: string | null,
  semesterId?: string | null
): Promise<string[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  let query = supabase.from("profiles").select("id").eq("role", "student").eq("account_status", "active");

  if (departmentId) query = query.eq("department_id", departmentId);
  if (programmeId) query = query.eq("programme_id", programmeId);
  if (semesterId) query = query.eq("semester_id", semesterId);

  const { data, error } = await query;
  if (error || !data) {
    console.error("Error targeting users:", error);
    return [];
  }

  return data.map((u) => u.id);
}
