import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, ChevronLeft, ShieldCheck } from "lucide-react";
import { QuizForm } from "@/components/QuizForm";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function NewQuizPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'faculty') redirect("/dashboard");

  // Fetch ONLY assigned subjects for this faculty member
  const { data: facultySubjects, error: subjectError } = await supabase
    .from("faculty_subjects")
    .select(`
      subject:subjects(
        id, name, code,
        semester:semesters(
          name,
          programme:programmes(name)
        )
      )
    `)
    .eq("faculty_id", user.id);

  if (subjectError) {
    console.error("Could not load faculty quiz subjects:", subjectError);
  }
  const assignedSubjects = (facultySubjects || []).flatMap(fs => {
    const subject = fs.subject;
    return Array.isArray(subject) ? subject : subject ? [subject] : [];
  });
  const subjectIds = assignedSubjects.map(subject => subject.id);
  const { data: curriculumSubjects, error: curriculumError } = subjectIds.length
    ? await supabase
      .from("curriculum_subjects")
      .select(`
        subject_id,
        curriculum:curricula(
          id, name, code,
          programme:programmes(name)
        )
      `)
      .in("subject_id", subjectIds)
      .eq("is_active", true)
    : { data: [], error: null };

  if (curriculumError) {
    console.error("Could not load curriculum context for faculty quiz subjects:", curriculumError);
  }

  const curriculumContext = new Map<string, { id: string; name: string; code: string | null; programmeName: string | null }[]>();
  for (const row of curriculumSubjects || []) {
    const curriculumRelation = row.curriculum;
    const linkedCurricula = Array.isArray(curriculumRelation)
      ? curriculumRelation
      : curriculumRelation
        ? [curriculumRelation]
        : [];
    const subjectCurricula = curriculumContext.get(row.subject_id) || [];
    for (const curriculum of linkedCurricula) {
      if (!subjectCurricula.some(item => item.id === curriculum.id)) {
        const programmeRelation = curriculum.programme;
        const programme = Array.isArray(programmeRelation) ? programmeRelation[0] : programmeRelation;
        subjectCurricula.push({
          id: curriculum.id,
          name: curriculum.name,
          code: curriculum.code,
          programmeName: programme?.name ?? null,
        });
      }
    }
    curriculumContext.set(row.subject_id, subjectCurricula);
  }

  const subjects = assignedSubjects.map(subject => {
    const semesterRelation = subject.semester;
    const semester = Array.isArray(semesterRelation) ? semesterRelation[0] : semesterRelation;
    const semesterProgrammeRelation = semester?.programme;
    const semesterProgramme = Array.isArray(semesterProgrammeRelation)
      ? semesterProgrammeRelation[0]
      : semesterProgrammeRelation;
    const curricula = curriculumContext.get(subject.id) || [];
    const programmes = [...new Set([
      semesterProgramme?.name,
      ...curricula.map(curriculum => curriculum.programmeName),
    ].filter((name): name is string => Boolean(name)))];

    return {
      id: subject.id,
      name: subject.name,
      code: subject.code ?? "",
      semester: semester?.name ?? null,
      programmes,
      curricula: curricula.map(({ name, code }) => ({ name, code })),
    };
  });

  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl">
      <Link href="/faculty/quizzes" className={buttonVariants({ variant: "ghost", className: "mb-6" })}>
        <ChevronLeft className="w-4 h-4 mr-2" /> Back to My Quizzes
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4 flex items-center">
          <BrainCircuit className="w-8 h-8 mr-3 text-primary" /> Create New Quiz
        </h1>
        <p className="text-lg text-muted-foreground">
          Build a quiz for your students to test their knowledge.
        </p>
      </div>

      {subjectError || curriculumError ? (
        <Card className="border-red-300 bg-red-50 text-red-700">
          <CardContent className="py-8">Could not load your assigned subjects and academic context. Refresh the page to try again.</CardContent>
        </Card>
      ) : subjects.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ShieldCheck className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
            <h3 className="text-xl font-semibold mb-2">No subjects assigned</h3>
            <p className="text-muted-foreground">You must be assigned to at least one subject before you can create quizzes.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border shadow-sm">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle>Quiz Settings</CardTitle>
            <CardDescription>First, define the core settings for this quiz. You will add questions on the next page.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <QuizForm subjects={subjects} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
