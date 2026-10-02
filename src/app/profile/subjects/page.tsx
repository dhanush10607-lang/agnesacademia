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
    .select("is_academic_locked, semester_id, programme:programmes(name), semester:semesters(name)")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  // Fetch available subjects for this semester
  const { data: availableSubjects } = await supabase
    .from("subjects")
    .select("id, name, code")
    .eq("semester_id", profile.semester_id || '00000000-0000-0000-0000-000000000000')
    .order("name", { ascending: true });

  // Fetch currently selected subjects
  const { data: selected } = await supabase
    .from("student_subjects")
    .select("subject_id")
    .eq("student_id", user.id);

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
          Select your enrolled subjects for {profile.programme?.name} - {profile.semester?.name}.
        </p>
      </div>

      <SubjectSelector 
        availableSubjects={availableSubjects || []} 
        initialSelectedIds={selectedIds} 
        isLocked={profile.is_academic_locked || false}
      />
    </div>
  );
}
