"use server";

import { createClient } from "@/lib/supabase/server";

export async function reportResourceAction(
  itemType: 'note' | 'question_paper' | 'question_bank' | 'question' | 'syllabus' | 'video' | 'other',
  itemId: string,
  reason: string,
  details: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const { error } = await supabase.from("resource_reports").insert({
      user_id: user.id,
      item_type: itemType,
      item_id: itemId,
      reason,
      details: details || null,
      status: 'pending'
    });

    if (error) {
      console.error("Report insertion error:", error);
      return { success: false, error: "Failed to submit report" };
    }

    // Also log in audit logs
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: 'reported',
      item_type: itemType,
      item_id: itemId,
      details: `Report reason: ${reason}`
    });

    return { success: true };
  } catch (error) {
    console.error("Report error:", error);
    return { success: false, error: "Internal server error" };
  }
}
