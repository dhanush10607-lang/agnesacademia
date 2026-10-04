import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { BrainCircuit, Clock, HelpCircle, Play } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurriculumSemesterSubjects } from "@/lib/curriculumSubjects";

export default async function QuizzesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let subjectIds: string[] = [];
  let subjectFilterError = "";
  let emptyMessage = "No quizzes are available for subjects in your current curriculum and semester.";

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, curriculum_id, semester_id, semester:semesters(name)")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Could not load student quiz profile:", profileError);
    subjectFilterError = "Your curriculum and semester could not be loaded.";
  } else if (profile?.role !== "student") {
    emptyMessage = "Quizzes are available to student accounts.";
  } else if (!profile.curriculum_id || !profile.semester_id) {
    emptyMessage = "Set your current curriculum and semester in your academic profile to see relevant quizzes.";
  } else {
    const semester = Array.isArray(profile.semester) ? profile.semester[0] : profile.semester;
    const curriculumSubjects = await getCurriculumSemesterSubjects(
      supabase,
      profile.curriculum_id,
      profile.semester_id,
      semester?.name,
    );
    const curriculumSubjectIds: string[] = curriculumSubjects.flatMap(
      ({ subject }: { subject: { id: string } | null }) =>
      subject?.id ? [subject.id] : [],
    );

    if (curriculumSubjectIds.length > 0) {
      const { data: enrolledData, error: enrollmentError } = await supabase
        .from("student_subjects")
        .select("subject_id")
        .eq("student_id", user.id)
        .eq("enrollment_status", "ENROLLED");

      if (enrollmentError) {
        console.error("Could not load student quiz enrollments:", enrollmentError);
        subjectFilterError = "Your current subjects could not be loaded.";
      } else if (enrolledData?.length) {
        const enrolledIds = new Set(enrolledData.map(enrollment => enrollment.subject_id));
        subjectIds = curriculumSubjectIds.filter(subjectId => enrolledIds.has(subjectId));
      } else {
        subjectIds = curriculumSubjectIds;
      }
    }
  }

  const { data: quizzes, error: quizError } = subjectIds.length > 0
    ? await supabase
        .from("quizzes")
        .select(`
          *,
          subject:subjects(name, code)
        `)
        .eq("status", "published")
        .in("subject_id", subjectIds)
        .order("created_at", { ascending: false })
    : { data: [], error: null };
  if (quizError) console.error("Could not load published quizzes:", quizError);

  const quizIds = quizzes?.map(quiz => quiz.id) || [];
  const { data: questionCounts, error: countError } = quizIds.length
    ? await supabase
        .from("quiz_public_question_counts")
        .select("quiz_id, question_count")
        .in("quiz_id", quizIds)
    : { data: [], error: null };
  if (countError) console.error("Could not load published quiz question counts:", countError);
  const countByQuizId = new Map(
    (questionCounts || []).map(row => [row.quiz_id, row.question_count] as const),
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto min-w-0 max-w-6xl px-3 py-6 pb-32 sm:px-4 sm:py-8">
        <div className="mb-8">
          <h1 className="mb-2 flex items-start gap-2 text-2xl font-heading font-extrabold sm:items-center sm:gap-3 sm:text-4xl">
            <BrainCircuit className="mt-1 h-6 w-6 shrink-0 text-primary sm:mt-0 sm:h-8 sm:w-8" />
            <span>Practice Quizzes</span>
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Test your knowledge and prepare for your exams with subject-specific quizzes.
          </p>
        </div>

        {(subjectFilterError || quizError || countError) && (
          <div role="alert" className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
            {subjectFilterError || (quizError ? "Quizzes could not be loaded." : "Question counts could not be loaded.")} Please refresh the page.
          </div>
        )}
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {quizzes && quizzes.length > 0 ? (
            quizzes.map((quiz) => {
              const questionCount = countByQuizId.get(quiz.id) || 0;
              const subject = Array.isArray(quiz.subject) ? quiz.subject[0] : quiz.subject;
              return (
                <Card key={quiz.id} className="border-border shadow-sm flex flex-col h-full hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                      <Badge variant="outline" className="max-w-full whitespace-normal break-words bg-primary/5 text-primary border-primary/20">
                        {subject?.name || "Subject"}
                      </Badge>
                      <Badge variant="secondary" className="shrink-0 capitalize">
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="break-words text-xl [overflow-wrap:anywhere] line-clamp-2">{quiz.title}</CardTitle>
                    {quiz.unit_name && (
                      <CardDescription className="mt-1 break-words font-medium text-foreground [overflow-wrap:anywhere]">
                        {quiz.unit_name}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-end">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center">
                        <HelpCircle className="w-4 h-4 mr-1" />
                        {questionCount} Qs
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {quiz.duration_minutes ? `${quiz.duration_minutes}m` : 'No limit'}
                      </div>
                    </div>
                    
                    <Link href={user ? `/quizzes/${quiz.id}` : "/login"} className={buttonVariants({ className: "w-full" })}>
                      <Play className="w-4 h-4 mr-2" /> Start Quiz
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed rounded-xl bg-muted/10">
              <BrainCircuit className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No quizzes available</h3>
              <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
