"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function moderateResourceAction(
  resourceId: string, 
  action: 'approve' | 'reject', 
  reason?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Check if user is moderator/admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== 'moderator' && profile.role !== 'administrator')) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const status = action === 'approve' ? 'published' : 'rejected';
    
    // Update resource
    const { error: updateError } = await supabase
      .from("resources")
      .update({ 
        status, 
        moderation_note: reason || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", resourceId);

    if (updateError) {
      console.error("Moderation update error:", updateError);
      return { success: false, error: "Failed to update resource status" };
    }

    // Log to audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: action === 'approve' ? 'approved' : 'rejected',
      item_type: 'note', // Simplified
      item_id: resourceId,
      details: reason ? `Reason: ${reason}` : undefined
    });

    revalidatePath("/moderation");
    
    return { success: true };
  } catch (error) {
    console.error("Moderation error:", error);
    return { success: false, error: "Internal server error" };
  }
}
