import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, History, Users } from "lucide-react";
import Link from "next/link";
import AdminNotificationForm from "./AdminNotificationForm";

export default async function AdminNotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "administrator") redirect("/dashboard");

  // Fetch some stats
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
  const { count: devicesCount } = await supabase.from("push_devices").select("*", { count: 'exact', head: true }).eq("is_active", true);

  // Fetch departments/programmes/semesters for targeting
  const { data: departments } = await supabase.from("departments").select("id, name").eq("status", "active");
  const { data: programmes } = await supabase.from("programmes").select("id, code, name").eq("status", "active");
  const { data: semesters } = await supabase.from("semesters").select("id, number, academic_year_id").eq("status", "active");

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Push Notification Center</h1>
          <p className="text-muted-foreground mt-2">Manage and broadcast push notifications securely.</p>
        </div>
        <Link href="/admin/notifications/history">
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" /> View History
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Compose Notification</CardTitle>
              <CardDescription>Target specific groups or broadcast to all active devices.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminNotificationForm 
                departments={departments || []}
                programmes={programmes || []}
                semesters={semesters || []}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Reach Overview</CardTitle>
              <CardDescription>Platform-wide active endpoints.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Users className="w-8 h-8 text-primary opacity-80" />
                <div>
                  <div className="text-2xl font-bold">{usersCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-green-500/5 border border-green-500/10 dark:bg-green-500/10">
                <Send className="w-8 h-8 text-green-600 dark:text-green-500 opacity-80" />
                <div>
                  <div className="text-2xl font-bold">{devicesCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Active Push Devices</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
