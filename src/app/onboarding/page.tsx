import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to AGNES ACADEMIA — Let's Get You Set Up",
  description: "Personalize your academic space in under a minute.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, onboarding_complete")
    .eq("id", user.id)
    .single();

  // Non-students go directly to dashboard
  if (profile?.role !== "student") redirect("/dashboard");

  // Already completed onboarding → dashboard
  if ((profile as any)?.onboarding_complete) redirect("/dashboard");

  // Fetch academic structure for wizard dropdowns
  const [
    { data: departments },
    { data: programmes },
    { data: curricula },
    { data: years },
    { data: semesters },
    { data: subjects },
  ] = await Promise.all([
    supabase.from("departments").select("id, name").eq("status", "active").order("name"),
    supabase.from("programmes").select("id, name, department_id, code").eq("status", "active").order("name"),
    supabase.from("curricula").select("id, name, programme_id, code").eq("is_active", true).order("name"),
    supabase.from("academic_years").select("id, name, programme_id").order("name"),
    supabase.from("semesters").select("id, name, academic_year_id").order("name"),
    supabase.from("subjects").select("id, name, code").eq("status", "active").order("name"),
  ]);

  const studentName = (profile as any)?.full_name
    ?? user.email?.split("@")[0]
    ?? "Student";

  return (
    <OnboardingWizard
      departments={departments || []}
      programmes={programmes   || []}
      curricula={curricula     || []}
      years={years             || []}
      semesters={semesters     || []}
      subjects={subjects       || []}
      studentName={studentName}
    />
  );
}
