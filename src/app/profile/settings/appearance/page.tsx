import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppearanceClient from "./AppearanceClient";

export default async function AppearanceSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: settings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return <AppearanceClient initialSettings={settings || {}} />;
}
