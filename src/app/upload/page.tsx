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

  // Load academic choices for the upload form; choosing them here doesn't
  // change the student's saved profile.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, semester_id, curriculum_id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    console.error("Failed to fetch the student's academic profile for upload.");
  }

  const isStudent = profile?.role === "student";
  const [
    { data: curricula, error: curriculaError },
    { data: semesters, error: semestersError },
  ] = isStudent
    ? await Promise.all([
        supabase
          .from("curricula")
          .select("id, name, programme_id")
          .eq("is_active", true)
          .order("name"),
        supabase
          .from("semesters")
          .select("id, name, programme_id")
          .eq("status", "active")
          .order("name"),
      ])
    : [{ data: [], error: null }, { data: [], error: null }];

  if (curriculaError) {
    console.error("Failed to fetch curricula for upload:", curriculaError);
    throw new Error("Unable to load curricula for upload.");
  }
  if (semestersError) {
    console.error("Failed to fetch semesters for upload:", semestersError);
    throw new Error("Unable to load semesters for upload.");
  }

  const initialCurriculumId = curricula?.some(curriculum => curriculum.id === profile?.curriculum_id)
    ? profile?.curriculum_id ?? ""
    : "";
  const initialProgrammeId = curricula?.find(curriculum => curriculum.id === initialCurriculumId)?.programme_id;
  const initialSemesterId = semesters?.some(semester =>
    semester.id === profile?.semester_id &&
    semester.programme_id === initialProgrammeId
  )
    ? profile?.semester_id ?? ""
    : "";

  let subjects: UploadSubject[] = [];
  if (isStudent && initialCurriculumId && initialSemesterId) {
    const curriculumSubjects = await getCurriculumSemesterSubjects(
      supabase,
      initialCurriculumId,
      initialSemesterId,
    );
    subjects = toUploadSubjects(curriculumSubjects);
  } else if (!isStudent) {
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
          <UploadForm
            categories={categories || []}
            subjects={subjects}
            isStudent={isStudent}
            curricula={curricula || []}
            semesters={semesters || []}
            initialCurriculumId={initialCurriculumId}
            initialSemesterId={initialSemesterId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
