import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AcademicEditForm from "./AcademicEditForm";

export default async function EditAcademicProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_academic_locked, department_id, programme_id, curriculum_id, academic_year_id, semester_id")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  const { data: globalSettings } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "global_academic_profile_lock")
    .single();

  const isGlobalLocked = globalSettings?.value === "true" || globalSettings?.value === true;

  if (profile.is_academic_locked || isGlobalLocked) {
    redirect("/profile/academic"); // Block access if locked
  }

  // Pre-fetch initial data to hydrate the form faster
  const { data: departments } = await supabase.from("departments").select("id, name").order("name");
  
  // Patch missing department_id for legacy or seeded accounts
  if (!profile.department_id && profile.programme_id) {
    const { data: prog } = await supabase.from("programmes").select("department_id").eq("id", profile.programme_id).single();
    if (prog) profile.department_id = prog.department_id;
  }
  
  let initialProgrammes: any[] = [];
  let initialCurricula: any[] = [];
  let initialYears: any[] = [];
  let initialSemesters: any[] = [];

  if (profile.department_id) {
    const { data } = await supabase.from("programmes").select("id, name").eq("department_id", profile.department_id).order("name");
    if (data) initialProgrammes = data;
  }
  if (profile.programme_id) {
    const { data: currData } = await supabase.from("curricula").select("id, name").eq("programme_id", profile.programme_id).eq("is_active", true).order("name");
    if (currData) initialCurricula = currData;

    const { data: yearData } = await supabase.from("academic_years").select("id, name").eq("programme_id", profile.programme_id).order("name");
    if (yearData) initialYears = yearData;
  }
  if (profile.academic_year_id) {
    const { data } = await supabase.from("semesters").select("id, name").eq("academic_year_id", profile.academic_year_id).order("name");
    if (data) initialSemesters = data;
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-2xl space-y-6 pb-24 md:pb-8">
      <Link href="/profile/academic" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Academic Profile
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-extrabold text-foreground">Change Programme</h1>
        <p className="text-muted-foreground mt-2">
          Update your academic structure. Your dashboard and subjects will automatically update.
        </p>
      </div>

      <AcademicEditForm 
        departments={departments || []} 
        initialProgrammes={initialProgrammes}
        initialCurricula={initialCurricula}
        initialYears={initialYears}
        initialSemesters={initialSemesters}
        currentProfile={{
          department_id: profile.department_id,
          programme_id: profile.programme_id,
          curriculum_id: profile.curriculum_id,
          academic_year_id: profile.academic_year_id,
          semester_id: profile.semester_id,
        }}
      />
    </div>
  );
}
