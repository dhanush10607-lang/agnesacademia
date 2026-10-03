import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import CurriculumSubjectManager from "./CurriculumSubjectManager";

export default async function CurriculumSubjectsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient();
  const { id } = await params;

  // Fetch Curriculum Details
  const { data: curriculum, error: curriculumError } = await supabase
    .from("curricula")
    .select("*, programme:programmes(name)")
    .eq("id", id)
    .single();

  if (curriculumError || !curriculum) {
    redirect("/admin/academic/curricula");
  }

  // Fetch all Subject Types
  const { data: subjectTypes } = await supabase
    .from("subject_types")
    .select("*")
    .order("display_order", { ascending: true });

  // Fetch already assigned subjects
  const { data: assignedSubjects } = await supabase
    .from("curriculum_subjects")
    .select(`
      *,
      subject:subjects(id, name, code, credits, semester:semesters(name))
    `)
    .eq("curriculum_id", id)
    .order("display_order", { ascending: true });

  // Fetch all available subjects in the system (or ideally filter by department)
  // For MVP, fetch all active subjects.
  const { data: allSubjects } = await supabase
    .from("subjects")
    .select("id, name, code, credits, semester:semesters(name)")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div className="space-y-6 pb-20">
      <Link href="/admin/academic/curricula" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Curricula
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-primary" /> 
            Manage Subjects: {curriculum.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure compulsory and elective subjects for {(curriculum.programme as any)?.name} - {curriculum.academic_year || 'All Years'}
          </p>
        </div>
      </div>

      <CurriculumSubjectManager 
        curriculumId={id}
        subjectTypes={subjectTypes || []}
        assignedSubjects={assignedSubjects || []}
        allSubjects={allSubjects || []}
      />
    </div>
  );
}
