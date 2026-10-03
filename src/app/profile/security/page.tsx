import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SecurityClient } from "./SecurityClient";
import { getAuthSessionId } from "@/lib/auth/session-id";

export default async function SecurityPage() {
  const supabase = await createClient();
  const [
    { data: { user } },
    { data: { session } },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()]);

  if (!user) {
    redirect("/login");
  }

  const providers = user.app_metadata?.providers;
  const supportsPassword = Array.isArray(providers) && providers.includes("email");
  let activeSessions: {
    session_id: string;
    browser: string;
    operating_system: string;
    device_type: string;
    last_seen_at: string;
    revoked_at: string | null;
    is_active: boolean;
    is_signed_out: boolean;
  }[] = [];
  let activeSessionsError = false;

  if (session?.user.id === user.id) {
    try {
      const currentSessionId = getAuthSessionId(session.access_token);
      const activeSince = new Date(Date.now() - 3 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("user_sessions")
        .select("session_id, browser, operating_system, device_type, last_seen_at, revoked_at")
        .eq("user_id", user.id)
        .neq("session_id", currentSessionId)
        .order("last_seen_at", { ascending: false });

      if (error) {
        console.error("Could not load active sessions:", error);
        activeSessionsError = true;
      } else {
        activeSessions = (data ?? []).map((trackedSession) => ({
          ...trackedSession,
          is_active:
            trackedSession.revoked_at === null &&
            trackedSession.last_seen_at >= activeSince,
          is_signed_out: trackedSession.revoked_at !== null,
        }));
      }
    } catch (error) {
      console.error("Could not identify the current auth session:", error);
      activeSessionsError = true;
    }
  }

  return (
    <SecurityClient
      email={user.email || null}
      supportsPassword={supportsPassword}
      activeSessions={activeSessions}
      activeSessionsError={activeSessionsError}
    />
  );
}
