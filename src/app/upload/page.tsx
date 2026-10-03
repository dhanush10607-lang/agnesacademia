import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud, Info } from "lucide-react";
import { UploadForm } from "@/components/UploadForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCurriculumSemesterSubjects } from "@/lib/curriculumSubjects";

type UploadSubject = {
  id: string;
  name: string;
  semester: { name: string } | null;
};

function toUploadSubjects(rows: unknown[]): UploadSubject[] {
  return rows.flatMap((row) => {
    if (typeof row !== "object" || row === null) return [];

    const record = row as Record<string, unknown>;
    const relatedSubject = "subject" in record ? record.subject : row;
    const subject = Array.isArray(relatedSubject) ? relatedSubject[0] : relatedSubject;
    if (typeof subject !== "object" || subject === null) return [];

    const subjectRecord = subject as Record<string, unknown>;
    if (typeof subjectRecord.id !== "string" || typeof subjectRecord.name !== "string") return [];

    const relatedSemester = subjectRecord.semester;
    const semester = Array.isArray(relatedSemester) ? relatedSemester[0] : relatedSemester;
    const semesterName =
      typeof semester === "object" && semester !== null && "name" in semester && typeof semester.name === "string"
        ? semester.name
        : null;

    return [{
      id: subjectRecord.id,
      name: subjectRecord.name,
      semester: semesterName ? { name: semesterName } : null,
    }];
  }).sort((a, b) => a.name.localeCompare(b.name));
}

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from("resource_categories")
    .select("id, name")
    .order("name", { ascending: true });

  // Fetch the student's current academic context.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, semester_id, curriculum_id, semester:semesters(name)")
    .eq("id", user.id)
    .single();

  let subjects: UploadSubject[] = [];
  if (profile?.role === "student") {
    const { data: enrolledSubjects, error: enrollmentError } = await supabase
      .from("student_subjects")
      .select("subject:subjects(id, name, semester:semesters(name))")
      .eq("student_id", user.id)
      .eq("enrollment_status", "ENROLLED");

    if (enrollmentError) {
      console.error("Failed to fetch the student's enrolled subjects for upload:", enrollmentError);
    } else {
      subjects = toUploadSubjects(enrolledSubjects || []);
    }

    if (subjects.length === 0 && !enrollmentError && profile?.curriculum_id) {
      const curriculumSubjects = await getCurriculumSemesterSubjects(
        supabase,
        profile.curriculum_id,
        profile.semester_id,
        profile.semester?.[0]?.name,
      );

      subjects = toUploadSubjects(curriculumSubjects);
    }
  } else {
    const { data: availableSubjects, error: subjectError } = await supabase
      .from("subjects")
      .select(`
        id, name,
        semester:semesters(name)
      `)
      .order("name", { ascending: true });

    if (subjectError) {
      console.error("Failed to fetch subjects for upload:", subjectError);
    } else {
      subjects = toUploadSubjects(availableSubjects || []);
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4 flex items-center">
          <UploadCloud className="w-8 h-8 mr-3 text-primary" /> Contribute Resource
        </h1>
        <p className="text-lg text-muted-foreground">
          Help your peers by sharing notes, question papers, and other study materials.
        </p>
      </div>

      <Alert className="mb-8 bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900">
        <Info className="h-4 w-4" />
        <AlertTitle>Review Process</AlertTitle>
        <AlertDescription>
          All uploaded resources go through a moderation review before they are published to ensure quality and relevance. 
          Please do not upload copyrighted or inappropriate material.
        </AlertDescription>
      </Alert>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Resource Details</CardTitle>
          <CardDescription>Fill out the details below to submit your file.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <UploadForm categories={categories || []} subjects={subjects} />
        </CardContent>
      </Card>
    </div>
  );
}
