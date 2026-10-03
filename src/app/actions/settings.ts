"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type UserSettingsUpdates = {
  theme?: "light" | "dark" | "system";
  text_size?: "standard" | "large";
  reduced_motion?: boolean;
  high_contrast?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
};

export async function updateUserSettingsAction(updates: UserSettingsUpdates) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("user_settings")
    .upsert(
      { user_id: user.id, ...updates, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Settings update error:", error);
    return { success: false, error: "Failed to update settings" };
  }

  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath("/profile/settings/appearance");
  revalidatePath("/profile/settings/notifications");
  
  return { success: true };
}
