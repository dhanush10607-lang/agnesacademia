"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRoleAction(userId: string, newRole: string) {
  const supabase = await createClient();
  
  let { data: { user }, error: userError } = await supabase.auth.getUser();
  
  // Fallback to getSession if getUser fails (sometimes happens in Server Actions due to token refresh edge cases)
  if (!user || userError) {
    console.error("getUser failed in Server Action:", userError);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      user = session.user;
    }
  }

  if (!user) {
    return { success: false, error: "Not authenticated. Please refresh the page and try again." };
  }

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
  let { data: { user }, error: userError } = await supabase.auth.getUser();
  
  // Fallback to getSession if getUser fails
  if (!user || userError) {
    console.error("getUser failed in Server Action (status update):", userError);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      user = session.user;
    }
  }

  if (!user) {
    return { success: false, error: "Not authenticated. Please refresh the page and try again." };
  }

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

export async function toggleAcademicLockAction(userId: string, lockStatus: boolean) {
  const supabase = await createClient();
  let { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (!user || userError) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      user = session.user;
    }
  }

  if (!user) {
    return { success: false, error: "Not authenticated. Please refresh the page and try again." };
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== 'administrator' && profile.role !== 'faculty')) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .update({ 
        is_academic_locked: lockStatus,
        academic_locked_at: lockStatus ? new Date().toISOString() : null,
        academic_locked_by: lockStatus ? user.id : null
      })
      .eq("id", userId);

    if (error) throw error;

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: lockStatus ? 'academic_profile_locked' : 'academic_profile_unlocked',
      target_type: 'user',
      target_id: userId,
      metadata: { lock_status: lockStatus }
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Update academic lock error:", error);
    return { success: false, error: "Failed to update lock status" };
  }
}
