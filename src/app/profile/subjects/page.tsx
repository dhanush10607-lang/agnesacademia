import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import SubjectSelector from "./SubjectSelector";

export default async function SubjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_academic_locked, semester_id, curriculum_id, programme:programmes(name), semester:semesters(name), curriculum:curricula(name)")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  // Fetch available subjects
  let availableSubjects: any[] = [];
  
  if (profile.curriculum_id) {
    // New Multi-subject model
    const { data: curriculumData, error } = await supabase
      .from("curriculum_subjects")
      .select(`
        id, is_compulsory, is_selectable, minimum_selection, maximum_selection,
        subject:subjects!inner (id, name, code, subject_type_id, semester_id),
        subject_type:subject_types (name, display_order)
      `)
      .eq("curriculum_id", profile.curriculum_id)
      .eq("subject.semester_id", profile.semester_id);
      
    if (error) console.error("Error fetching curriculum subjects:", error);
      
    availableSubjects = curriculumData?.map((cs: any) => ({
      ...cs.subject,
      is_compulsory: cs.is_compulsory,
      is_selectable: cs.is_selectable,
      minimum_selection: cs.minimum_selection,
      maximum_selection: cs.maximum_selection,
      subject_type: cs.subject_type?.name || 'Other',
      type_order: cs.subject_type?.display_order || 99
    })) || [];
  } else {
    // Fallback to legacy single-major model
    const { data: legacySubjects } = await supabase
      .from("subjects")
      .select("id, name, code")
      .eq("semester_id", profile.semester_id || '00000000-0000-0000-0000-000000000000')
      .order("name", { ascending: true });
      
    availableSubjects = legacySubjects?.map(s => ({
      ...s,
      is_compulsory: true,
      subject_type: 'Legacy',
      type_order: 0
    })) || [];
  }

  // Fetch currently selected subjects
  const { data: selected } = await supabase
    .from("student_subjects")
    .select("subject_id")
    .eq("student_id", user.id)
    .eq("enrollment_status", "ENROLLED");

  const selectedIds = selected?.map(s => s.subject_id) || [];

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl space-y-6 pb-24 md:pb-8">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Profile
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-extrabold flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-green-500" /> My Subjects
        </h1>
        <p className="text-muted-foreground mt-2">
          Select your enrolled subjects for {profile.curriculum ? (profile.curriculum as any)?.name : (profile.programme as any)?.name} - {(profile.semester as any)?.name}.
        </p>
      </div>

      <SubjectSelector 
        availableSubjects={availableSubjects} 
        initialSelectedIds={selectedIds} 
        isLocked={profile.is_academic_locked || false}
      />
    </div>
  );
}
