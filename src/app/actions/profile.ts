"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePersonalProfileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const fullName = formData.get("full_name") as string;
  const avatarUrl = formData.get("avatar_url") as string;

  // Check if profile is academically locked and user is a student
  const { data: profile } = await supabase.from("profiles").select("role, is_academic_locked").eq("id", user.id).single();
  
  const updates: any = {};
  if (avatarUrl !== null) updates.avatar_url = avatarUrl;
  
  // Only allow name update if not locked or not student
  if (profile && (profile.role !== 'student' || !profile.is_academic_locked)) {
    if (fullName) updates.full_name = fullName;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Failed to update profile" };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/personal");
  
  return { success: true };
}
