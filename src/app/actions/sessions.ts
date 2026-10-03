"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getAuthSessionId } from "@/lib/auth/session-id";

const DEVICE_COOKIE = "agnes_device_id";

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

  const cookieStore = await cookies();
  let deviceId = cookieStore.get(DEVICE_COOKIE)?.value;

  if (!deviceId || !/^[0-9a-f-]{36}$/i.test(deviceId)) {
    deviceId = randomUUID();
    cookieStore.set(DEVICE_COOKIE, deviceId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const { error } = await supabase.from("user_sessions").upsert(
    {
      session_id: sessionId,
      device_id: deviceId,
      user_id: user.id,
      browser: browser.slice(0, 80),
      operating_system: operatingSystem.slice(0, 80),
      device_type: deviceType.slice(0, 40),
      last_seen_at: new Date().toISOString(),
      revoked_at: null,
    },
    { onConflict: "user_id,device_id" }
  );

  if (error) {
    console.error("Could not update active session tracking:", error);
    return { success: false, error: "Could not update active session tracking." };
  }

  return { success: true };
}
