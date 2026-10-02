import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRight, Book, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default async function SemesterDetailPage({
  params,
}: {
  params: Promise<{ semesterId: string }>;
}) {
  const { semesterId } = await params;
  const supabase = await createClient();

  // Fetch semester with academic year, programme and department
  const { data: semester, error: semError } = await supabase
    .from("semesters")
    .select(`
      *,
      academic_year:academic_years(
        *,
        programme:programmes(
          *,
          department:departments(*)
        )
      )
    `)
    .eq("id", semesterId)
    .single();

  if (semError || !semester) {
    notFound();
  }

  // Fetch subjects
  const { data: subjects, error: subjError } = await supabase
    .from("subjects")
    .select("*")
    .eq("semester_id", semesterId)
    .order("name");

  const prog = semester.academic_year.programme;
  const dept = prog.department;

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <Link href="/departments" className="hover:text-primary transition-colors">Departments</Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <Link href={`/programmes/${prog.id}`} className="hover:text-primary transition-colors">
          {prog.name}
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <span className="text-foreground font-medium">{semester.academic_year.name} - {semester.name}</span>
      </nav>

      <div className="mb-12">
        <Link href={`/programmes/${prog.id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Timeline
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-heading font-extrabold text-foreground">{semester.name}</h1>
          <Badge variant="outline" className="text-primary bg-primary/5">{semester.academic_year.name}</Badge>
        </div>
        <p className="text-lg text-muted-foreground">Select a subject to view its study materials, notes, and question papers.</p>
      </div>

      <h2 className="text-2xl font-heading font-bold mb-6 border-b pb-2">Subjects</h2>

      {subjError ? (
        <p className="text-destructive">Error loading subjects.</p>
      ) : !subjects || subjects.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Book className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Subjects Found</h3>
            <p className="text-muted-foreground max-w-md">There are currently no subjects listed for this semester.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/subjects/${subject.id}`} className="group block">
              <Card className="h-full border-muted shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center justify-between">
                    <span className="flex flex-col">
                      <span>{subject.name}</span>
                      {subject.code && <span className="text-xs font-mono text-muted-foreground mt-1">{subject.code}</span>}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
