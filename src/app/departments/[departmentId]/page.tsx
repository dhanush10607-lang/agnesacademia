import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChevronRight, GraduationCap, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicDepartmentPageData } from "@/lib/public-data";

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ departmentId: string }>;
}) {
  const { departmentId } = await params;
  const { department, departmentError, programmes, programmeError } =
    await getPublicDepartmentPageData(departmentId);

  if (departmentError || !department) {
    notFound();
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/departments" className="hover:text-primary transition-colors">Departments</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{department.name}</span>
      </nav>

      <div className="mb-12">
        <Link href="/departments" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Departments
        </Link>
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4">{department.name}</h1>
        <p className="text-lg text-muted-foreground">{department.description || "View all programmes offered under this department."}</p>
      </div>

      <h2 className="text-2xl font-heading font-bold mb-6 border-b pb-2">Programmes Offered</h2>

      {programmeError ? (
        <p className="text-destructive">Error loading programmes.</p>
      ) : !programmes || programmes.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Programmes Found</h3>
            <p className="text-muted-foreground max-w-md">There are currently no programmes listed for this department.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programmes.map((prog) => (
            <Link key={prog.id} href={`/programmes/${prog.id}`} className="group block">
              <Card className="h-full border-muted shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center justify-between">
                    <span>{prog.name}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {prog.description || "View academic years and semesters."}
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
