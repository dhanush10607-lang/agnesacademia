import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRight, Calendar, ChevronLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProgrammePageData } from "@/lib/public-data";

export default async function ProgrammeDetailPage({
  params,
}: {
  params: Promise<{ programmeId: string }>;
}) {
  const { programmeId } = await params;
  const {
    programme,
    programmeError: progError,
    curricula,
    curriculaError,
    academicYears,
    academicYearsError: yearsError,
  } = await getPublicProgrammePageData(programmeId);

  if (progError || !programme) {
    notFound();
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <Link href="/departments" className="hover:text-primary transition-colors">Departments</Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        {programme.department && (
          <>
            <Link href={`/departments/${programme.department_id}`} className="hover:text-primary transition-colors">
              {programme.department.name}
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </>
        )}
        <span className="text-foreground font-medium">{programme.name}</span>
      </nav>

      <div className="mb-12">
        {programme.department && (
          <Link href={`/departments/${programme.department_id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to {programme.department.name}
          </Link>
        )}
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4">{programme.name}</h1>
        <p className="text-lg text-muted-foreground">{programme.description || "Select an academic year and semester to view subjects."}</p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-heading font-bold mb-6 border-b pb-2">Curricula / Combinations</h2>
        {curriculaError ? (
          <p className="text-destructive">Error loading curricula.</p>
        ) : !curricula || curricula.length === 0 ? (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="py-8 text-center text-muted-foreground">
              No curricula or combinations are listed for this programme yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {curricula.map((curriculum) => (
              <Card key={curriculum.id}>
                <CardHeader className="flex-row items-start gap-3 space-y-0">
                  <BookOpen className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <CardTitle className="text-base">{curriculum.name}</CardTitle>
                    {curriculum.academic_year && (
                      <p className="mt-1 text-sm text-muted-foreground">{curriculum.academic_year}</p>
                    )}
                    {curriculum.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{curriculum.description}</p>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>

      <h2 className="text-2xl font-heading font-bold mb-6 border-b pb-2">Academic Timeline</h2>

      {yearsError ? (
        <p className="text-destructive">Error loading academic timeline.</p>
      ) : !academicYears || academicYears.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Timeline Available</h3>
            <p className="text-muted-foreground max-w-md">There are currently no academic years or semesters listed for this programme.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {academicYears.map((year) => (
            <div key={year.id} className="bg-muted/10 rounded-xl p-6 border">
              <h3 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" /> {year.name}
              </h3>
              
              {!year.semesters || year.semesters.length === 0 ? (
                <p className="text-sm text-muted-foreground">No semesters found for this year.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {year.semesters
                    .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))
                    .map((semester: { id: string; name: string }) => (
                    <Link key={semester.id} href={`/semesters/${semester.id}`} className="block group">
                      <Card className="border-muted shadow-sm hover:shadow-md hover:border-primary/30 transition-all bg-background">
                        <CardHeader className="p-4">
                          <CardTitle className="font-heading text-base flex items-center justify-between">
                            <span>{semester.name}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
