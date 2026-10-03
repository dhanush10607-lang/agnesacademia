import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppearanceClient from "./AppearanceClient";

export default async function AppearanceSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: settings, error } = await supabase
    .from("user_settings")
    .select("theme, text_size, reduced_motion, high_contrast")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error loading appearance settings:", error);
    throw new Error("Unable to load appearance settings.");
  }

  return <AppearanceClient initialSettings={settings || {}} />;
}
