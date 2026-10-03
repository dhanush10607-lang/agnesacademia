import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { CreateSubjectForm, ArchiveSubjectButton } from "@/components/admin/AcademicControls";

export default async function AdminSubjectsPage() {
  const supabase = await createClient();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("*, semester:semesters(name), department:departments(name)")
    .eq("status", "active")
    .order("name", { ascending: true });

  const { data: semesterRows } = await supabase
    .from("semesters")
    .select("id, name, programme_id, academic_year_id")
    .eq("status", "active");
  const yearIds = [...new Set((semesterRows ?? []).map((semester) => semester.academic_year_id))];
  const { data: years } = yearIds.length
    ? await supabase.from("academic_years").select("id, name, programme_id").in("id", yearIds)
    : { data: [] };
  const programmeIds = [...new Set([
    ...(semesterRows ?? []).map((semester) => semester.programme_id).filter((id): id is string => Boolean(id)),
    ...(years ?? []).map((year) => year.programme_id),
  ])];
  const { data: programmes } = programmeIds.length
    ? await supabase.from("programmes").select("id, department_id").in("id", programmeIds)
    : { data: [] };
  const programmeDepartments = new Map((programmes ?? []).map((programme) => [programme.id, programme.department_id]));
  const academicYears = new Map((years ?? []).map((year) => [year.id, year]));
  const semesters = (semesterRows ?? []).flatMap((semester) => {
    const year = academicYears.get(semester.academic_year_id);
    const programmeId = semester.programme_id ?? year?.programme_id;
    const departmentId = programmeId ? programmeDepartments.get(programmeId) : null;

    return departmentId
      ? [{
          id: semester.id,
          name: year ? `${semester.name} · ${year.name}` : semester.name,
          department_id: departmentId,
        }]
      : [];
  });
  const { data: departments } = await supabase
    .from("departments")
    .select("id, name")
    .eq("status", "active");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-primary" /> Subjects
        </h1>
        <p className="text-muted-foreground">Manage academic subjects and courses.</p>
      </div>

      <Card className="mb-8 border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg">Add New Subject</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <CreateSubjectForm semesters={semesters || []} departments={departments || []} />
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Subject Name</th>
                <th className="px-6 py-4 font-semibold">Code</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Semester</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects && subjects.length > 0 ? (
                subjects.map(subj => (
                  <tr key={subj.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {subj.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {subj.code}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {(subj.department as any)?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {(subj.semester as any)?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArchiveSubjectButton id={subj.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No active subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
