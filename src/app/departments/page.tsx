import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function DepartmentsPage() {
  const supabase = await createClient();
  const [
    { data: departments, error },
    { data: unassignedProgrammes, error: programmesError },
  ] = await Promise.all([
    supabase
      .from("departments")
      .select("*")
      .eq("status", "active")
      .order("name"),
    supabase
      .from("programmes")
      .select("id, name, description")
      .is("department_id", null)
      .eq("status", "active")
      .order("name"),
  ]);

  if (error) {
    return (
      <div className="container px-4 py-24 mx-auto text-center">
        <h2 className="text-2xl font-bold text-destructive">Error Loading Departments</h2>
        <p className="text-muted-foreground mt-2">{error.message}</p>
        <p className="mt-4 text-sm text-muted-foreground">Make sure you have connected Supabase and run the migrations.</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 mx-auto max-w-5xl">
      <div className="mb-12">
        <Badge variant="outline" className="mb-4">Academic Hierarchy</Badge>
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4">College Departments</h1>
        <p className="text-lg text-muted-foreground">Browse departments and programmes offered by the college.</p>
      </div>

      {departments && departments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Link key={dept.id} href={`/departments/${dept.id}`} className="group block">
              <Card className="h-full border-muted shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center justify-between">
                    <span>{dept.name}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {dept.description || "View programmes and subjects for this department."}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!departments?.length && !unassignedProgrammes?.length && !programmesError && (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mb-2 text-xl font-semibold">No Departments or Programmes Found</h3>
            <p className="max-w-md text-muted-foreground">No academic departments or programmes have been added yet.</p>
          </CardContent>
        </Card>
      )}

      {programmesError ? (
        <p className="mt-8 text-destructive">Error loading programmes.</p>
      ) : unassignedProgrammes && unassignedProgrammes.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-6 border-b pb-2 text-2xl font-heading font-bold">Other Programmes</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {unassignedProgrammes.map(programme => (
              <Link key={programme.id} href={`/programmes/${programme.id}`} className="group block">
                <Card className="h-full border-muted shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between font-heading">
                      <span>{programme.name}</span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {programme.description || "View curricula, academic years, and semesters."}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
