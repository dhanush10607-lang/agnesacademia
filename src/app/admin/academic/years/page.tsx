import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import {
  CreateYearForm,
  ArchiveYearButton,
  CreateAcademicSessionForm,
  ArchiveAcademicSessionButton,
} from "@/components/admin/AcademicControls";
import { format } from "@/lib/date-time";

export default async function AdminAcademicYearsPage() {
  const supabase = await createClient();

  const { data: years } = await supabase
    .from("academic_years")
    .select("*, programmes(name)")
    .eq("status", "active")
    .order("name");

  const { data: sessions } = await supabase
    .from("academic_sessions")
    .select("*, programmes(name)")
    .eq("status", "active")
    .order("start_date", { ascending: false });

  const { data: programmes } = await supabase
    .from("programmes")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2 flex items-center">
          <Database className="w-8 h-8 mr-3 text-primary" /> Study Years &amp; Sessions
        </h1>
        <p className="text-muted-foreground">Manage programme study years separately from calendar sessions.</p>
      </div>

      <Card className="mb-8 border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg">Add Programme Study Year</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <CreateYearForm
            programmes={programmes || []}
            years={(years || []).map(year => ({ id: year.id, name: year.name, programme_id: year.programme_id }))}
          />
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Study Year</th>
                <th className="px-6 py-4 font-semibold">Programme</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {years && years.length > 0 ? (
                years.map(year => (
                  <tr key={year.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {year.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {year.programmes?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArchiveYearButton id={year.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                    No active study years found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="my-8 border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg">Add Academic Session</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <CreateAcademicSessionForm programmes={programmes || []} />
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Session</th>
                <th className="px-6 py-4 font-semibold">Programme</th>
                <th className="px-6 py-4 font-semibold">Start Date</th>
                <th className="px-6 py-4 font-semibold">End Date</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions && sessions.length > 0 ? (
                sessions.map(session => (
                  <tr key={session.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{session.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{session.programmes?.name || "N/A"}</td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {session.start_date ? format(new Date(session.start_date), "MMM d, yyyy") : "N/A"}
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {session.end_date ? format(new Date(session.end_date), "MMM d, yyyy") : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArchiveAcademicSessionButton id={session.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No active academic sessions found.
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
