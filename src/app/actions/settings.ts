"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserSettingsAction(updates: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Ensure settings record exists
  const { data: existing } = await supabase.from("user_settings").select("id").eq("user_id", user.id).single();
  
  if (!existing) {
    await supabase.from("user_settings").insert({ user_id: user.id, ...updates });
  } else {
    const { error } = await supabase
      .from("user_settings")
      .update(updates)
      .eq("user_id", user.id);

    if (error) {
      console.error("Settings update error:", error);
      return { success: false, error: "Failed to update settings" };
    }
  }

  revalidatePath("/profile");
  revalidatePath("/profile/settings/appearance");
  revalidatePath("/profile/settings/notifications");
  
  return { success: true };
}
