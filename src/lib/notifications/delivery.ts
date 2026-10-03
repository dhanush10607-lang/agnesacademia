import { createClient } from "@supabase/supabase-js"; // Use a service role client here

// Use a dedicated service role client for background notification delivery
export function getServiceRoleSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("Missing SUPABASE_SERVICE_ROLE_KEY. Notification delivery tracking will fail.");
    return null;
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

export interface NotificationPayload {
  userIds: string[];
  title: string;
  message: string;
  category: string;
  actionUrl?: string;
  priority?: "low" | "normal" | "high" | "critical";
  metadata?: any;
  /** When false, the notification is stored in history only (no push). */
  sendPush?: boolean;
}

export async function sendNotifications(payload: NotificationPayload) {
  const supabase = getServiceRoleSupabase();

  if (!supabase) throw new Error("Server is missing SUPABASE_SERVICE_ROLE_KEY");
  const userIds = Array.from(new Set(payload.userIds.filter(Boolean)));
  if (userIds.length === 0) return { inserted: 0 };

  // Every targeted user ALWAYS gets the notification in their in-app history.
  // Push preference (user_settings.push_notifications) is respected by the
  // push-notifications Edge Function, which is triggered by this INSERT via a
  // Database Webhook. metadata.skip_push lets callers suppress push entirely.
  const batchId = crypto.randomUUID();
  const notificationsToInsert = userIds.map((userId) => ({
    user_id: userId,
    title: payload.title,
    message: payload.message,
    category: payload.category,
    action_url: payload.actionUrl || null,
    priority: payload.priority || "normal",
    metadata: {
      ...(payload.metadata || {}),
      batch_id: batchId,
      skip_push: payload.sendPush === false,
    },
  }));

  // Insert in chunks to avoid oversized requests on large broadcasts
  const CHUNK = 500;
  let inserted = 0;
  for (let i = 0; i < notificationsToInsert.length; i += CHUNK) {
    const chunk = notificationsToInsert.slice(i, i + CHUNK);
    const { error } = await supabase.from("notifications").insert(chunk);
    if (error) {
      console.error("Failed to insert in-app notifications:", error);
      throw error;
    }
    inserted += chunk.length;
  }
  return { inserted, batchId };
}
