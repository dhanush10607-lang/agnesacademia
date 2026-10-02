import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Layers, Bell, CheckCircle, BrainCircuit, Database } from "lucide-react";

export default async function AdminDashboardOverview() {
  const supabase = await createClient();

  // Fetch the pre-computed stats from our view
  const { data: stats, error } = await supabase
    .from('admin_overview_stats')
    .select('*')
    .single();

  if (error || !stats) {
    return <div className="p-4 text-red-500 border border-red-200 bg-red-50 rounded-lg">Failed to load overview statistics. Have you run the Phase 11 SQL migration?</div>;
  }

  const statCards = [
    { title: "Total Students", value: stats.total_students, icon: Users, color: "text-blue-500" },
    { title: "Total Faculty", value: stats.total_faculty, icon: Users, color: "text-purple-500" },
    { title: "Total Departments", value: stats.total_departments, icon: Database, color: "text-slate-500" },
    { title: "Total Programmes", value: stats.total_programmes, icon: Database, color: "text-slate-500" },
    { title: "Total Subjects", value: stats.total_subjects, icon: BookOpen, color: "text-orange-500" },
    { title: "Published Resources", value: stats.total_resources, icon: Layers, color: "text-green-500" },
    { title: "Pending Submissions", value: stats.pending_submissions, icon: CheckCircle, color: "text-yellow-500" },
    { title: "Published Notices", value: stats.published_notices, icon: Bell, color: "text-blue-500" },
    { title: "Active Quizzes", value: stats.active_quizzes, icon: BrainCircuit, color: "text-indigo-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2">Platform Overview</h1>
        <p className="text-muted-foreground">High-level statistics and health metrics for the platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-xl bg-muted/50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
