import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ChevronRight, Library } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getCurriculumSemesterSubjects, uniqueSubjects } from "@/lib/curriculumSubjects";

export default async function MySemesterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      programme:programmes(*),
      academic_year:academic_years(*),
      semester:semesters(*)
    `)
    .eq("id", user.id)
    .single();

  if (!profile || !profile.semester_id) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-6 opacity-40" />
            <h3 className="text-2xl font-bold mb-2">No Semester Assigned</h3>
            <p className="text-muted-foreground max-w-md">
              You haven't selected your current programme or semester yet. Please update your account settings to view your personalized semester details.
            </p>
            <Link href="/dashboard" className={buttonVariants({ variant: "default", className: "mt-6" })}>
              Back to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch subjects for this semester
  let subjects: any[] = [];
  
  // Try to fetch enrolled subjects first
  const { data: enrolledData } = await supabase
    .from("student_subjects")
    .select("subject:subjects(*)")
    .eq("student_id", user.id)
    .eq("enrollment_status", "ENROLLED");
    
  if (enrolledData && enrolledData.length > 0) {
    subjects = uniqueSubjects(
      enrolledData.map(e => e.subject)
    );
    subjects.sort((a, b) => a.name.localeCompare(b.name));
  } else if (profile.curriculum_id) {
    // Fetch from curriculum if no explicit enrollments exist
    const currSubjects = await getCurriculumSemesterSubjects(
      supabase,
      profile.curriculum_id,
      profile.semester_id,
      profile.semester?.name
    );
    subjects = uniqueSubjects(
      currSubjects.map((cs: any) => cs.subject)
    );
    subjects.sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-background">Current Semester</Badge>
          <Badge variant="secondary">{profile.academic_year?.name}</Badge>
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-2">
          {profile.semester.name?.toUpperCase()}
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          {profile.programme.name}
        </p>
      </div>

      <div className="grid gap-4 mt-8">
        {subjects && subjects.length > 0 ? (
          subjects.map((subj, idx) => (
            <Link key={subj.id} href={`/subjects/${subj.id}`} className="group block">
              <Card className="border-border hover:border-primary/50 transition-colors shadow-sm">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-muted rounded-full font-mono font-bold text-xl text-muted-foreground group-hover:text-primary transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-1">
                        {subj.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {subj.code && <span className="font-mono">{subj.code}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors shrink-0">
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Library className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-xl font-semibold mb-2">No subjects found</h3>
              <p className="text-muted-foreground">There are no subjects registered for this semester yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
