import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import { initializeApp, cert } from "npm:firebase-admin@12.1.0/app";
import { getMessaging } from "npm:firebase-admin@12.1.0/messaging";

// Initialize Firebase Admin (Only once per isolate)
let firebaseApp: any;
function getFirebaseApp() {
  if (!firebaseApp) {
    const serviceAccountStr = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
    if (!serviceAccountStr) {
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT environment variable");
    }
    const serviceAccount = JSON.parse(serviceAccountStr);
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
  }
  return firebaseApp;
}

export default {
  async fetch(req: Request) {
    try {
      // 1. Verify Webhook secret (Optional but recommended)
      // const secret = req.headers.get("x-webhook-secret");
      // if (secret !== Deno.env.get("WEBHOOK_SECRET")) return new Response("Unauthorized", { status: 401 });

      const payload = await req.json();
      
      // We only care about inserts on the `notifications` table
      if (payload.type !== "INSERT" || payload.table !== "notifications") {
        return new Response("Ignored", { status: 200 });
      }

      const notification = payload.record;
      if (!notification.user_id) {
        return new Response("Missing user_id", { status: 400 });
      }

      // Initialize Supabase Admin client
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // History-only notification (admin unticked "send push")
      if (notification.metadata?.skip_push === true) {
        return new Response("Push skipped by sender", { status: 200 });
      }

      // Respect the user's push preference
      const { data: settings } = await supabase
        .from("user_settings")
        .select("push_notifications")
        .eq("user_id", notification.user_id)
        .maybeSingle();
      if (settings && settings.push_notifications === false) {
        return new Response("User disabled push", { status: 200 });
      }

      // 2. Find active devices for this user
      const { data: devices, error: deviceError } = await supabase
        .from("push_devices")
        .select("id, registration_token")
        .eq("user_id", notification.user_id)
        .eq("is_active", true);

      if (deviceError) {
        console.error("Error fetching devices:", deviceError);
        return new Response("Error fetching devices", { status: 500 });
      }

      if (!devices || devices.length === 0) {
        return new Response("No active devices", { status: 200 });
      }

      // 3. Create Delivery Records
      const deliveriesToInsert = devices.map((d: any) => ({
        notification_id: notification.id,
        push_device_id: d.id,
        status: 'pending'
      }));

      const { data: insertedDeliveries, error: deliveryError } = await supabase
        .from("notification_deliveries")
        .upsert(deliveriesToInsert, { onConflict: "notification_id,push_device_id", ignoreDuplicates: true })
        .select("id, push_device_id");

      if (deliveryError || !insertedDeliveries) {
        console.error("Error creating deliveries:", deliveryError);
        return new Response("Error creating deliveries", { status: 500 });
      }

      // 4. Send Firebase Push Notifications
      const app = getFirebaseApp();
      const messaging = getMessaging(app);
      
      const updates = [];

      for (const delivery of insertedDeliveries) {
        const device = devices.find((d: any) => d.id === delivery.push_device_id);
        if (!device) continue;

        try {
          const message = {
            token: device.registration_token,
            notification: {
              title: notification.title,
              body: notification.message,
            },
            data: {
              action_url: notification.action_url || '',
              category: notification.category || '',
              notification_id: notification.id,
            },
            android: {
              priority: (notification.priority === 'high' || notification.priority === 'critical' ? 'high' : 'normal') as "high" | "normal",
            }
          };

          const response = await messaging.send(message);
          
          updates.push({
            id: delivery.id,
            status: 'sent',
            provider_message_id: response,
            sent_at: new Date().toISOString()
          });
        } catch (error: any) {
          console.error("FCM Send Error for device:", device.id, error);
          
          updates.push({
            id: delivery.id,
            status: 'failed',
            error_message: error.message || "Unknown error"
          });

          // Deactivate invalid tokens
          if (
            error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered' ||
            error.code === 'messaging/invalid-argument' ||
            error.message?.includes('invalid-registration-token') ||
            error.message?.includes('registration-token-not-registered') ||
            error.message?.includes('Device unregistered') ||
            error.message?.includes('Requested entity was not found')
          ) {
            await supabase
              .from("push_devices")
              .update({ is_active: false })
              .eq("id", device.id);
          }
        }
      }

      // 5. Update Delivery Records with results
      for (const update of updates) {
        await supabase
          .from("notification_deliveries")
          .update(update)
          .eq("id", update.id);
      }

      return new Response(JSON.stringify({ success: true, processed: updates.length }), {
        headers: { "Content-Type": "application/json" },
      });

    } catch (err: any) {
      console.error("Edge function error:", err);
      return new Response(err.message, { status: 500 });
    }
  }
};
