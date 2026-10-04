import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import {
  CreateSemesterForm,
  ArchiveSemesterButton,
  ChangeSemesterSessionControl,
} from "@/components/admin/AcademicControls";

export default async function AdminSemestersPage() {
  const supabase = await createClient();

  const { data: semesters } = await supabase
    .from("semesters")
    .select("*, academic_year:academic_years(name), academic_session:academic_sessions(name), programme:programmes(name)")
    .eq("status", "active")
    .order("name", { ascending: true });

  const { data: programmes } = await supabase.from("programmes").select("id, name").eq("status", "active");
  const { data: years } = await supabase
    .from("academic_years")
    .select("id, name, programme_id")
    .eq("status", "active");
  const { data: sessions } = await supabase
    .from("academic_sessions")
    .select("id, name, programme_id")
    .eq("status", "active");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2 flex items-center">
          <Database className="w-8 h-8 mr-3 text-primary" /> Semesters
        </h1>
        <p className="text-muted-foreground">Manage semesters.</p>
      </div>

      <Card className="mb-8 border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg">Add New Semester</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <CreateSemesterForm programmes={programmes || []} years={years || []} sessions={sessions || []} />
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Semester Name</th>
                <th className="px-6 py-4 font-semibold">Programme</th>
                <th className="px-6 py-4 font-semibold">Study Year</th>
                <th className="px-6 py-4 font-semibold">Session</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {semesters && semesters.length > 0 ? (
                semesters.map(sem => (
                  <tr key={sem.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {sem.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {(sem.programme as any)?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {(sem.academic_year as any)?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <ChangeSemesterSessionControl
                        semesterId={sem.id}
                        currentSessionId={sem.academic_session_id}
                        sessions={(sessions || [])
                          .filter(session => session.programme_id === sem.programme_id)
                          .map(session => ({ id: session.id, name: session.name }))}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArchiveSemesterButton id={sem.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No active semesters found.
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
