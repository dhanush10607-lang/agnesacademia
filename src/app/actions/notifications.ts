"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { cookies } from "next/headers";
import { getServiceRoleSupabase } from "@/lib/notifications/delivery";

const FCM_COOKIE = "agnes_fcm_token";

export async function registerDeviceAction(token: string, browser: string, os: string, deviceType: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };
  if (!token) return { success: false, error: "Missing token" };

  try {
    // Service role is required: RLS would stop us touching rows owned by
    // the previous user who logged in on this same device.
    const admin = getServiceRoleSupabase();
    const db: any = admin || supabase;

    // 1. A device token belongs to exactly ONE user. If someone else was
    //    logged in on this device before, take the token away from them.
    if (admin) {
      await admin
        .from("push_devices")
        .delete()
        .eq("registration_token", token)
        .neq("user_id", user.id);
    }

    // 2. Register / refresh the token for the current user
    const { error } = await db.from("push_devices").upsert(
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

    // Remember the token on this browser so logout can deactivate it
    const cookieStore = await cookies();
    cookieStore.set(FCM_COOKIE, token, {
      httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 365,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to register device:", error);
    return { success: false, error: error?.message || "Database error" };
  }
}

export async function unregisterDeviceAction(token?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const cookieStore = await cookies();
  const t = token || cookieStore.get(FCM_COOKIE)?.value;

  if (!user || !t) return { success: false, error: "Not authenticated" };

  try {
    const db: any = getServiceRoleSupabase() || supabase;
    const { error } = await db
      .from("push_devices")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("registration_token", t);

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

    await sendNotifications({
      userIds: targetIds,
      title: data.title,
      message: data.message,
      category: data.category,
      actionUrl: data.actionUrl,
      priority: data.priority as any,
      sendPush: data.sendPush,
      metadata: { sent_by: user.id },
    });

    revalidatePath("/admin/notifications/history");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to send admin notification:", error);
    return { success: false, error: error?.message || "Internal server error" };
  }
}
