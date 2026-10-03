import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPush() {
  // Get a random user who has a push device registered
  const { data: devices, error: deviceError } = await supabase
    .from("push_devices")
    .select("user_id")
    .eq("is_active", true)
    .limit(1);

  if (deviceError || !devices || devices.length === 0) {
    console.error("No active push devices found in the database. Please login on a device and allow notifications first.");
    return;
  }

  const userId = devices[0].user_id;
  console.log(`Sending test notification to user ${userId}...`);

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title: "Test Push Notification",
    message: "This is a test notification from Edge Functions!",
    category: "system",
    priority: "high"
  });

  if (error) {
    console.error("Failed to insert notification:", error);
  } else {
    console.log("Successfully inserted notification! The Webhook should now trigger the Edge Function.");
  }
}

testPush();
