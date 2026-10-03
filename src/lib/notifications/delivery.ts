import { createClient } from "@supabase/supabase-js"; // Use a service role client here

// Use a dedicated service role client for background notification delivery
function getServiceRoleSupabase() {
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
}

export async function sendNotifications(payload: NotificationPayload) {
  const supabase = getServiceRoleSupabase();
  
  if (!supabase) return; // Cannot process without service role key
  if (payload.userIds.length === 0) return;

  // 1. Fetch user preferences (for the relevant category)
  const { data: userSettings } = await supabase
    .from("user_settings")
    .select("user_id, email_notifications, push_notifications")
    .in("user_id", payload.userIds);

  const pushEnabledUserIds = new Set(
    (userSettings || [])
      .filter((s) => s.push_notifications !== false)
      .map((s) => s.user_id)
    );

  // Fallback: if no settings found, default to true
  const targetUserIds = payload.userIds.filter(id => 
    pushEnabledUserIds.has(id) || !userSettings?.find(s => s.user_id === id)
  );

  if (targetUserIds.length === 0) return;

  // 2. Create in-app notifications
  // This INSERT will trigger the Supabase Edge Function (push-notifications)
  // via a Database Webhook, which handles the FCM push delivery.
  const notificationsToInsert = targetUserIds.map((userId) => ({
    user_id: userId,
    title: payload.title,
    message: payload.message,
    category: payload.category,
    action_url: payload.actionUrl,
    priority: payload.priority || "normal",
    metadata: payload.metadata || {},
  }));

  const { error: insertError } = await supabase
    .from("notifications")
    .insert(notificationsToInsert);

  if (insertError) {
    console.error("Failed to insert in-app notifications:", insertError);
  }
}
