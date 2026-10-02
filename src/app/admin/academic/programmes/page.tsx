import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import { CreateProgrammeForm, ArchiveProgrammeButton } from "@/components/admin/AcademicControls";

export default async function AdminProgrammesPage() {
  const supabase = await createClient();

  const { data: programmes } = await supabase
    .from("programmes")
    .select("*, department:departments(name)")
    .eq("status", "active")
    .order("name", { ascending: true });

  const { data: departments } = await supabase.from("departments").select("id, name").eq("status", "active");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2 flex items-center">
          <Database className="w-8 h-8 mr-3 text-primary" /> Programmes
        </h1>
        <p className="text-muted-foreground">Manage academic programmes (e.g., B.Sc, B.Com).</p>
      </div>

      <Card className="mb-8 border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg">Add New Programme</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <CreateProgrammeForm departments={departments || []} />
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Programme Name</th>
                <th className="px-6 py-4 font-semibold">Code</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {programmes && programmes.length > 0 ? (
                programmes.map(prog => (
                  <tr key={prog.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {prog.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {prog.code}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {(prog.department as any)?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArchiveProgrammeButton id={prog.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No active programmes found.
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
