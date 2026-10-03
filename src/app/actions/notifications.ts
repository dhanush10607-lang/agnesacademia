"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function registerDeviceAction(token: string, browser: string, os: string, deviceType: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  try {
    const { error } = await supabase.from("push_devices").upsert(
      {
        user_id: user.id,
        registration_token: token,
        browser,
        operating_system: os,
        device_type: deviceType,
        is_active: true,
        last_seen_at: new Date().toISOString()
      },
      { onConflict: 'user_id,registration_token' }
    );

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Failed to register device:", error);
    return { success: false, error: "Database error" };
  }
}

export async function unregisterDeviceAction(token: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  try {
    const { error } = await supabase
      .from("push_devices")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("registration_token", token);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Failed to unregister device:", error);
    return { success: false, error: "Database error" };
  }
}

export async function markNotificationReadAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false };

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/notifications");
  return { success: true };
}

export async function markAllNotificationsReadAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false };

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  revalidatePath("/notifications");
  return { success: true };
}

export async function sendAdminNotificationAction(data: {
  title: string;
  message: string;
  category: string;
  priority: string;
  actionUrl: string;
  sendPush: boolean;
  targeting: {
    departmentId: string | null;
    programmeId: string | null;
    semesterId: string | null;
    subjectId?: string | null;
    curriculumId?: string | null;
  }
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "administrator") return { success: false, error: "Unauthorized" };

  try {
    const { getTargetUserIds } = await import("@/lib/notifications/targeting");
    const { sendNotifications } = await import("@/lib/notifications/delivery");

    const targetIds = await getTargetUserIds(
      data.targeting.departmentId,
      data.targeting.programmeId,
      data.targeting.semesterId,
      data.targeting.subjectId,
      data.targeting.curriculumId
    );

    if (targetIds.length === 0) {
      return { success: false, error: "No users matched the selected targeting criteria." };
    }

    if (data.sendPush) {
      await sendNotifications({
        userIds: targetIds,
        title: data.title,
        message: data.message,
        category: data.category,
        actionUrl: data.actionUrl,
        priority: data.priority as any,
      });
    } else {
      // Just insert in-app notifications if push is disabled
      const notificationsToInsert = targetIds.map((userId) => ({
        user_id: userId,
        title: data.title,
        message: data.message,
        category: data.category,
        action_url: data.actionUrl,
        priority: data.priority,
      }));
    
      const { error: insertError } = await supabase
        .from("notifications")
        .insert(notificationsToInsert);
        
      if (insertError) throw insertError;
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return { success: false, error: "Internal server error" };
  }
}
