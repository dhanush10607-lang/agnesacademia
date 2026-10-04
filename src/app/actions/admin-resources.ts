"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, updateTag } from "next/cache";
import { PUBLIC_CACHE_TAGS } from "@/lib/public-cache-tags";

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

    updateTag(PUBLIC_CACHE_TAGS.resources);
    revalidatePath("/admin/resources");
    return { success: true };
  } catch (error) {
    console.error("Update resource status error:", error);
    return { success: false, error: "Failed to update resource status" };
  }
}
