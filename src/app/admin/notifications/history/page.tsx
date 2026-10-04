import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "@/lib/date-time";
import Link from "next/link";

export default async function AdminNotificationHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "administrator") redirect("/dashboard");

  // RLS only lets a user read their OWN notifications, so the admin view must
  // use the service role to see every recipient's copy.
  const { getServiceRoleSupabase } = await import("@/lib/notifications/delivery");
  const db: any = getServiceRoleSupabase() || supabase;

  const { data: recentNotifications } = await db
    .from("notifications")
    .select(`
      id, title, category, priority, created_at, metadata,
      notification_deliveries (id, status)
    `)
    .order("created_at", { ascending: false })
    .limit(2000);

  // One broadcast = many rows (one per recipient). Group them back together.
  const groups = new Map<string, any>();
  for (const n of recentNotifications || []) {
    const key = n.metadata?.batch_id || `${n.title}|${n.category}|${String(n.created_at).slice(0, 19)}`;
    let g = groups.get(key);
    if (!g) {
      g = { id: key, title: n.title, category: n.category, priority: n.priority, created_at: n.created_at, recipients: 0, deliveries: [] as any[] };
      groups.set(key, g);
    }
    g.recipients += 1;
    g.deliveries.push(...(n.notification_deliveries || []));
  }

  const historyItems = Array.from(groups.values()).slice(0, 50).map((g: any) => {
    const deliveries = g.deliveries;
    const total = deliveries.length;
    const sent = deliveries.filter((d: any) => d.status === 'sent').length;
    const failed = deliveries.filter((d: any) => d.status === 'failed').length;
    const pending = deliveries.filter((d: any) => d.status === 'pending').length;

    let status = "Sent";
    if (total === 0) status = "In-App Only";
    else if (pending > 0 && sent === 0) status = "Processing";
    else if (failed > 0 && sent > 0) status = "Partially Sent";
    else if (failed > 0 && sent === 0) status = "Failed";

    return {
      ...g,
      stats: { total: g.recipients, sent, failed, pending },
      status
    };
  });

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/notifications">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Notification History</h1>
          <p className="text-muted-foreground mt-2">Track push notification deliveries and analytics.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Broadcasts</CardTitle>
          <CardDescription>The last 50 notifications sent across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title / Category</th>
                  <th className="px-6 py-4 font-semibold">Sent Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Recipients</th>
                  <th className="px-6 py-4 font-semibold text-center">Success</th>
                  <th className="px-6 py-4 font-semibold text-center">Failed</th>
                </tr>
              </thead>
              <tbody>
                {historyItems.length > 0 ? (
                  historyItems.map((item) => (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{item.category}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {format(new Date(item.created_at), "MMM d, yyyy h:mm a 'IST'")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${item.status === 'Sent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                            item.status === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                            item.status === 'In-App Only' ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium">
                        {item.stats.total}
                      </td>
                      <td className="px-6 py-4 text-center text-green-600 dark:text-green-500">
                        {item.stats.sent}
                      </td>
                      <td className="px-6 py-4 text-center text-red-600 dark:text-red-500">
                        {item.stats.failed}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No notification history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
