import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import { CreateDepartmentForm, ArchiveDepartmentButton } from "@/components/admin/DepartmentControls";

export default async function AdminDepartmentsPage() {
  const supabase = await createClient();

  const { data: departments } = await supabase
    .from("departments")
    .select("*, profiles(count), programmes(count)")
    .eq("status", "active")
    .order("name", { ascending: true });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2 flex items-center">
          <Database className="w-8 h-8 mr-3 text-primary" /> Departments
        </h1>
        <p className="text-muted-foreground">Manage the root organizational structures of the college.</p>
      </div>

      <Card className="mb-8 border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg">Add New Department</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <CreateDepartmentForm />
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Department Name</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold text-center">Users Enrolled</th>
                <th className="px-6 py-4 font-semibold text-center">Programmes</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments && departments.length > 0 ? (
                departments.map(dept => (
                  <tr key={dept.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {dept.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded font-medium">
                        {(dept.profiles as any)?.[0]?.count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded font-medium">
                        {(dept.programmes as any)?.[0]?.count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArchiveDepartmentButton id={dept.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No active departments found.
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
