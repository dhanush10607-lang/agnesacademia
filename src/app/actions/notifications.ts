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
