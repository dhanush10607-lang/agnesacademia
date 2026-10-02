import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, LayoutDashboard, Users, BookOpen, Layers, BarChart3, Settings, ScrollText, Database, Shield } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== 'administrator') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You do not have the required administrator privileges to access this area.
          </p>
          <Link href="/dashboard" className="text-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const navGroups = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard }
      ]
    },
    {
      title: "Academic Structure",
      items: [
        { name: "Departments", href: "/admin/academic/departments", icon: Database },
        { name: "Programmes", href: "/admin/academic/programmes", icon: Database },
        { name: "Academic Years", href: "/admin/academic/years", icon: Database },
        { name: "Semesters", href: "/admin/academic/semesters", icon: Database },
        { name: "Subjects", href: "/admin/academic/subjects", icon: BookOpen },
      ]
    },
    {
      title: "Users",
      items: [
        { name: "Students", href: "/admin/users?role=student", icon: Users },
        { name: "Faculty", href: "/admin/users?role=faculty", icon: Users },
        { name: "Moderators", href: "/admin/users?role=moderator", icon: Users },
        { name: "Administrators", href: "/admin/users?role=administrator", icon: Users },
        { name: "Profile Settings", href: "/admin/academic-profile-settings", icon: Settings },
      ]
    },
    {
      title: "Resources",
      items: [
        { name: "All Resources", href: "/admin/resources", icon: Layers },
        { name: "Pending Resources", href: "/admin/resources?status=pending_review", icon: Layers },
        { name: "Reports", href: "/admin/resources/reports", icon: Layers },
        { name: "Categories", href: "/admin/resources/categories", icon: Layers },
      ]
    },
    {
      title: "Academic",
      items: [
        { name: "Question Papers", href: "/admin/resources?type=question_paper", icon: BookOpen },
        { name: "Question Banks", href: "/admin/resources?type=question_bank", icon: BookOpen },
        { name: "Syllabus", href: "/admin/resources?type=syllabus", icon: BookOpen },
        { name: "Assignments", href: "/admin/resources?type=assignment", icon: BookOpen },
        { name: "Quizzes", href: "/admin/quizzes", icon: BookOpen },
      ]
    },
    {
      title: "Communication",
      items: [
        { name: "Notices", href: "/admin/notices", icon: BookOpen },
        { name: "Calendar", href: "/admin/calendar", icon: BookOpen },
      ]
    },
    {
      title: "System",
      items: [
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { name: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 bg-background border-r border-border flex-col shrink-0">
        <div className="p-6 border-b border-border flex items-center">
          <Shield className="w-6 h-6 text-primary mr-2" />
          <h2 className="font-heading font-extrabold text-lg tracking-tight">Admin Portal</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          {navGroups.map((group, i) => (
            <div key={i}>
              <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map(item => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="flex items-center px-2 py-1.5 text-sm font-medium rounded-md hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
                    >
                      <item.icon className="w-4 h-4 mr-3 text-muted-foreground" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border text-center">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            &larr; Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
