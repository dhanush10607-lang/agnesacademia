"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRoleAction(userId: string, newRole: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'administrator') {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) throw error;

    // Audit log
    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: 'update_role',
      target_type: 'user',
      target_id: userId,
      metadata: { new_role: newRole }
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Update user role error:", error);
    return { success: false, error: "Failed to update role" };
  }
}

export async function updateUserStatusAction(userId: string, newStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'administrator') {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .update({ account_status: newStatus })
      .eq("id", userId);

    if (error) throw error;

    // Audit log
    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: 'update_status',
      target_type: 'user',
      target_id: userId,
      metadata: { new_status: newStatus }
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Update user status error:", error);
    return { success: false, error: "Failed to update status" };
  }
}
