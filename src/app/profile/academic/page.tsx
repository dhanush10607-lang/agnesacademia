import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowLeft, Lock, Unlock, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function AcademicInfoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      department:departments(name),
      programme:programmes(name),
      semester:semesters(name),
      academic_year:academic_years(name)
    `)
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  // Fetch subjects for this semester from curriculum
  let subjects: any[] = [];
  
  if (profile.curriculum_id) {
    const { data: currSubjects } = await supabase
      .from("curriculum_subjects")
      .select("subject:subjects!inner(*)")
      .eq("curriculum_id", profile.curriculum_id)
      .eq("subject.semester_id", profile.semester_id);
      
    if (currSubjects) {
      subjects = currSubjects.map((cs: any) => cs.subject);
      subjects.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
  }

  // Fetch global settings
  const { data: globalSettings } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "global_academic_profile_lock")
    .single();

  const isGlobalLocked = globalSettings?.value === "true" || globalSettings?.value === true;
  const isLocked = profile.is_academic_locked || isGlobalLocked;

  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl space-y-6 pb-24 md:pb-8">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Profile
      </Link>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground flex items-center">
            <GraduationCap className="w-8 h-8 mr-3 text-indigo-500" /> Academic Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Your enrollment details and current subjects.
          </p>
        </div>
        
        {isLocked ? (
          <Badge variant="outline" className="px-3 py-1.5 border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30 gap-1 w-fit">
            <Lock className="w-3.5 h-3.5" /> Locked
          </Badge>
        ) : (
          <Badge variant="outline" className="px-3 py-1.5 border-green-500 text-green-600 bg-green-50 dark:bg-green-950/30 gap-1 w-fit">
            <Unlock className="w-3.5 h-3.5" /> Editable
          </Badge>
        )}
      </div>

      {isLocked && (
        <Alert className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-900/50 dark:text-amber-300">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Academic information locked</AlertTitle>
          <AlertDescription>
            Your academic profile is currently managed by the college. Contact the administrator if this information is incorrect.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Current Enrollment</CardTitle>
            <CardDescription>Your registered programme and year.</CardDescription>
          </div>
          {!isLocked && (
            <Link href="/profile/academic/edit">
              <Button variant="outline" size="sm">Change</Button>
            </Link>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Department</dt>
              <dd className="mt-1 text-base font-semibold text-foreground">
                {profile.department?.name || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Programme</dt>
              <dd className="mt-1 text-base font-semibold text-foreground">
                {profile.programme?.name || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Academic Year</dt>
              <dd className="mt-1 text-base font-semibold text-foreground">
                {profile.academic_year?.name || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Semester</dt>
              <dd className="mt-1 text-base font-semibold text-foreground">
                {profile.semester?.name || "Not set"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>My Subjects</CardTitle>
            <CardDescription>Subjects associated with your current semester.</CardDescription>
          </div>
          <Link href="/profile/subjects">
            <Button variant="outline" size="sm">Manage</Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-6">
          {subjects && subjects.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subjects.map((sub: any) => (
                <li key={sub.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <div className="bg-primary/10 p-2 rounded-md shrink-0">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground line-clamp-1">{sub.name}</p>
                    {sub.code && <p className="text-xs text-muted-foreground mt-0.5">{sub.code}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No subjects found for this semester.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
