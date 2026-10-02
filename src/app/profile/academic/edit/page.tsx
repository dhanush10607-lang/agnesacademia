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
    .select("is_academic_locked, department_id, programme_id, academic_year_id, semester_id")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  if (profile.is_academic_locked) {
    redirect("/profile/academic"); // Block access if locked
  }

  // Pre-fetch initial data to hydrate the form faster
  const { data: departments } = await supabase.from("departments").select("id, name").order("name");

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
        currentProfile={{
          department_id: profile.department_id,
          programme_id: profile.programme_id,
          academic_year_id: profile.academic_year_id,
          semester_id: profile.semester_id,
        }}
      />
    </div>
  );
}
