import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function DepartmentsPage() {
  const supabase = await createClient();
  const { data: departments, error } = await supabase
    .from("departments")
    .select("*")
    .order("name");

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
        <p className="text-lg text-muted-foreground">Browse all departments and their associated programmes.</p>
      </div>

      {!departments || departments.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Departments Found</h3>
            <p className="text-muted-foreground max-w-md">No departments have been added to the system yet. Please run the seed data migration.</p>
          </CardContent>
        </Card>
      ) : (
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
    </div>
  );
}
