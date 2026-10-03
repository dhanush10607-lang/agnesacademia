"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface OnboardingData {
  department_id?: string;
  programme_id?: string;
  curriculum_id?: string;
  academic_year_id?: string;
  semester_id?: string;
  learning_interests?: string[];
  notification_prefs?: string[];
  theme_preference?: string;
  reduced_motion?: boolean;
  large_text?: boolean;
  high_contrast?: boolean;
  skipped?: boolean;
}

/**
 * Save the complete onboarding profile.
 * Academic selection is only used for personalization — never grants permissions.
 */
export async function saveOnboardingProfile(data: OnboardingData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Only update fields that were actually provided (partial saves are fine)
  const update: Record<string, unknown> = {
    onboarding_complete: true,
    updated_at: new Date().toISOString(),
  };

  if (data.department_id)       update.department_id       = data.department_id;
  if (data.programme_id)        update.programme_id        = data.programme_id;
  if (data.curriculum_id)       update.curriculum_id       = data.curriculum_id;
  if (data.academic_year_id)    update.academic_year_id    = data.academic_year_id;
  if (data.semester_id)         update.semester_id         = data.semester_id;
  if (data.learning_interests)  update.learning_interests  = data.learning_interests;
  if (data.notification_prefs)  update.notification_prefs  = data.notification_prefs;
  if (data.theme_preference)    update.theme_preference    = data.theme_preference;
  if (typeof data.reduced_motion === "boolean") update.reduced_motion = data.reduced_motion;
  if (typeof data.large_text    === "boolean") update.large_text     = data.large_text;
  if (typeof data.high_contrast === "boolean") update.high_contrast  = data.high_contrast;

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (error) {
    console.error("Onboarding save error:", error);
    return { success: false, error: "We couldn't save your profile. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Skip onboarding entirely — mark as complete so we don't show it again.
 */
export async function skipOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("profiles")
    .update({ onboarding_complete: true, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
