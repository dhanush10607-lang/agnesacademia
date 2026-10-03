"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getAuthSessionId } from "@/lib/auth/session-id";

export async function updatePasswordAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const currentPassword = formData.get("current_password");
  const newPassword = formData.get("new_password");
  const confirmPassword = formData.get("confirm_password");

  if (
    typeof currentPassword !== "string" || !currentPassword ||
    typeof newPassword !== "string" || !newPassword ||
    typeof confirmPassword !== "string" || !confirmPassword
  ) {
    return { success: false, error: "All fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "New passwords do not match" };
  }

  if (newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long" };
  }

  if (newPassword === currentPassword) {
    return { success: false, error: "Choose a password different from your current password." };
  }

  if (!user.email || !user.app_metadata?.providers?.includes("email")) {
    return { success: false, error: "Password changes are managed by your sign-in provider." };
  }

  const { error: verificationError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verificationError) {
    return { success: false, error: "Your current password is incorrect." };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    console.error("Password update error:", error);
    return { success: false, error: "Failed to update password. Please try again." };
  }

  revalidatePath("/profile/security");

  return { success: true };
}

export async function signOutOtherSessionsAction() {
  const supabase = await createClient();
  const [
    { data: { user }, error: userError },
    { data: { session }, error: sessionError },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()]);

  if (userError || sessionError || !user || !session || session.user.id !== user.id) {
    return { success: false, error: "Your session has expired. Sign in again." };
  }

  let currentSessionId: string;
  try {
    currentSessionId = getAuthSessionId(session.access_token);
  } catch (error) {
    console.error("Could not identify the current auth session:", error);
    return { success: false, error: "Could not identify the current session. Please try again." };
  }

  const { error } = await supabase.auth.signOut({ scope: "others" });

  if (error) {
    console.error("Other session sign-out failed:", error);
    return { success: false, error: "Could not sign out other devices. Please try again." };
  }

  const signedOutAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("user_sessions")
    .update({ revoked_at: signedOutAt, last_seen_at: signedOutAt })
    .eq("user_id", user.id)
    .neq("session_id", currentSessionId)
    .is("revoked_at", null);

  if (updateError) {
    console.error("Other auth sessions were signed out, but session tracking was not updated:", updateError);
  }

  revalidatePath("/profile/security");
  return { success: true };
}
