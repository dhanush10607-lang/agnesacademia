"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateResourceReportAction(
  reportId: string,
  status: "resolved" | "dismissed"
) {
  if (!/^[0-9a-f-]{36}$/i.test(reportId)) {
    return { success: false, error: "Invalid report." };
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Sign in to manage reports." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || !["moderator", "administrator"].includes(profile.role)) {
    return { success: false, error: "You are not authorized to manage reports." };
  }

  const { data: report, error } = await supabase
    .from("resource_reports")
    .update({
      status,
      resolved_at: new Date().toISOString(),
      resolved_by: user.id,
    })
    .eq("id", reportId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Could not update resource report:", error);
    return { success: false, error: "Could not update this report. Please try again." };
  }

  if (!report) {
    return { success: false, error: "This report has already been reviewed." };
  }

  revalidatePath("/admin/resources/reports");
  revalidatePath("/moderation/reports");
  return { success: true };
}
