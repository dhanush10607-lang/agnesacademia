"use server";

import { createClient } from "@/lib/supabase/server";

export async function updatePasswordAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const currentPassword = formData.get("current_password") as string;
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "All fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "New passwords do not match" };
  }

  if (newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long" };
  }

  // Supabase update user password
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    console.error("Password update error:", error);
    return { success: false, error: error.message || "Failed to update password" };
  }
  
  // Optional: Audit log
  await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: "updated_password",
    item_type: "security",
    details: "User changed their password"
  });

  return { success: true };
}
