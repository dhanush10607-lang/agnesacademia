"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateResourceStatusAction(resourceId: string, newStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'administrator') {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { error } = await supabase
      .from("resources")
      .update({ status: newStatus })
      .eq("id", resourceId);

    if (error) throw error;

    // Audit log
    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: 'update_status',
      target_type: 'resource',
      target_id: resourceId,
      metadata: { new_status: newStatus }
    });

    revalidatePath("/admin/resources");
    return { success: true };
  } catch (error) {
    console.error("Update resource status error:", error);
    return { success: false, error: "Failed to update resource status" };
  }
}
