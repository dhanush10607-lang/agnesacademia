import { getFirebaseAdmin } from "@/lib/firebase/server";
import { createClient } from "@supabase/supabase-js"; // Use a service role client here

// Use a dedicated service role client for background notification delivery
function getServiceRoleSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
  const admin = getFirebaseAdmin();
  
  if (payload.userIds.length === 0) return;

  // 1. Fetch user preferences (for the relevant category)
  // We need to map our app_settings / user_settings preferences
  // For simplicity, let's assume category matches a preference key
  // e.g., category 'notice' -> user_settings.notices
  // This will require fetching user_settings
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
  const notificationsToInsert = targetUserIds.map((userId) => ({
    user_id: userId,
    title: payload.title,
    message: payload.message,
    category: payload.category,
    action_url: payload.actionUrl,
    priority: payload.priority || "normal",
    metadata: payload.metadata || {},
  }));

  const { data: insertedNotifications, error: insertError } = await supabase
    .from("notifications")
    .insert(notificationsToInsert)
    .select("id, user_id");

  if (insertError || !insertedNotifications) {
    console.error("Failed to insert in-app notifications:", insertError);
    return;
  }

  // 3. Fetch active devices for target users
  const { data: devices } = await supabase
    .from("push_devices")
    .select("id, user_id, registration_token")
    .in("user_id", targetUserIds)
    .eq("is_active", true);

  if (!devices || devices.length === 0) return;

  // 4. Create Delivery Records (Deduplication)
  const deliveriesToInsert = [];
  const messagingPayloads = [];

  for (const device of devices) {
    const notification = insertedNotifications.find(n => n.user_id === device.user_id);
    if (!notification) continue;

    deliveriesToInsert.push({
      notification_id: notification.id,
      push_device_id: device.id,
      status: 'pending'
    });
  }

  if (deliveriesToInsert.length === 0) return;

  const { data: insertedDeliveries } = await supabase
    .from("notification_deliveries")
    .insert(deliveriesToInsert)
    .select("id, notification_id, push_device_id");

  if (!insertedDeliveries) return;

  // 5. Send via Firebase Admin SDK
  const updates: any[] = [];
  
  for (const delivery of insertedDeliveries) {
    const device = devices.find(d => d.id === delivery.push_device_id);
    const notification = insertedNotifications.find(n => n.id === delivery.notification_id);

    if (!device || !notification) continue;

    try {
      const message = {
        token: device.registration_token,
        notification: {
          title: payload.title,
          body: payload.message,
        },
        data: {
          action_url: payload.actionUrl || '',
          category: payload.category,
          notification_id: notification.id,
        },
        android: {
          priority: payload.priority === 'high' || payload.priority === 'critical' ? 'high' : 'normal',
        }
      };

      const response = await admin.messaging().send(message);
      
      updates.push({
        id: delivery.id,
        status: 'sent',
        provider_message_id: response,
        sent_at: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Firebase send error:", error);
      updates.push({
        id: delivery.id,
        status: 'failed',
        error_message: error.message
      });

      // If token is invalid, mark device as inactive
      if (
        error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered'
      ) {
        await supabase
          .from("push_devices")
          .update({ is_active: false })
          .eq("id", device.id);
      }
    }
  }

  // 6. Update Delivery Records
  for (const update of updates) {
    await supabase
      .from("notification_deliveries")
      .update(update)
      .eq("id", update.id);
  }
}
