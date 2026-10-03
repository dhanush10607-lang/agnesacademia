"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthSessionId } from "@/lib/auth/session-id";

export async function recordCurrentSessionAction(
  browser: string,
  operatingSystem: string,
  deviceType: string
) {
  const supabase = await createClient();
  const [
    { data: { user }, error: userError },
    { data: { session }, error: sessionError },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()]);

  if (userError || sessionError || !user || !session || session.user.id !== user.id) {
    return { success: false, error: "Your session could not be verified." };
  }

  let sessionId: string;
  try {
    sessionId = getAuthSessionId(session.access_token);
  } catch (error) {
    console.error("Could not identify the active auth session:", error);
    return { success: false, error: "Your session could not be identified." };
  }

  const { error } = await supabase.from("user_sessions").upsert(
    {
      session_id: sessionId,
      user_id: user.id,
      browser: browser.slice(0, 80),
      operating_system: operatingSystem.slice(0, 80),
      device_type: deviceType.slice(0, 40),
      last_seen_at: new Date().toISOString(),
      revoked_at: null,
    },
    { onConflict: "session_id" }
  );

  if (error) {
    console.error("Could not update active session tracking:", error);
    return { success: false, error: "Could not update active session tracking." };
  }

  return { success: true };
}
