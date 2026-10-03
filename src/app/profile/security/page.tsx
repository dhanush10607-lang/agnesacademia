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
  }[] = [];
  let activeSessionsError = false;

  if (session?.user.id === user.id) {
    try {
      const currentSessionId = getAuthSessionId(session.access_token);
      const activeSince = new Date(Date.now() - 3 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("user_sessions")
        .select("session_id, browser, operating_system, device_type, last_seen_at")
        .eq("user_id", user.id)
        .neq("session_id", currentSessionId)
        .is("revoked_at", null)
        .gte("last_seen_at", activeSince)
        .order("last_seen_at", { ascending: false });

      if (error) {
        console.error("Could not load active sessions:", error);
        activeSessionsError = true;
      } else {
        activeSessions = data ?? [];
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
