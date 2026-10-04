import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Download, Eye, Clock } from "lucide-react";
import { format } from "@/lib/date-time";

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range = "30" } = await searchParams;
  const supabase = await createClient();

  const days = parseInt(range);
  const fromDate = !isNaN(days) ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString() : null;

  // Basic analytics logic
  // Top viewed resources
  let topViewedQuery = supabase
    .from("resources")
    .select("id, title, view_count, department:departments(name)")
    .order("view_count", { ascending: false })
    .limit(5);

  let topDownloadedQuery = supabase
    .from("resources")
    .select("id, title, download_count, department:departments(name)")
    .order("download_count", { ascending: false })
    .limit(5);

  let recentActivityQuery = supabase
    .from("recently_viewed")
    .select("*, profile:profiles(full_name)")
    .order("viewed_at", { ascending: false })
    .limit(10);

  if (fromDate) {
    topViewedQuery = topViewedQuery.gte("created_at", fromDate);
    topDownloadedQuery = topDownloadedQuery.gte("created_at", fromDate);
    recentActivityQuery = recentActivityQuery.gte("viewed_at", fromDate);
  }

  const { data: topViewed } = await topViewedQuery;
  const { data: topDownloaded } = await topDownloadedQuery;
  const { data: recentActivity } = await recentActivityQuery;

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold mb-2 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-primary" /> Platform Analytics
          </h1>
          <p className="text-muted-foreground">Aggregated data and activity trends.</p>
        </div>
        
        <form className="flex gap-2" action="/admin/analytics">
          <select 
            name="range"
            defaultValue={range}
            className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <button type="submit" className="px-3 h-10 border rounded-md text-sm hover:bg-muted font-medium">Filter</button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-border shadow-sm">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="text-lg flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-500" /> Most Viewed Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {topViewed?.map((r, i) => (
                <li key={r.id} className="p-4 flex items-center justify-between hover:bg-muted/10">
                  <div className="flex items-center">
                    <span className="w-6 font-bold text-muted-foreground">{i + 1}.</span>
                    <div>
                      <p className="font-medium line-clamp-1">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{(r.department as any)?.name}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">{r.view_count || 0} views</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="text-lg flex items-center">
              <Download className="w-5 h-5 mr-2 text-green-500" /> Most Downloaded Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {topDownloaded?.map((r, i) => (
                <li key={r.id} className="p-4 flex items-center justify-between hover:bg-muted/10">
                  <div className="flex items-center">
                    <span className="w-6 font-bold text-muted-foreground">{i + 1}.</span>
                    <div>
                      <p className="font-medium line-clamp-1">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{(r.department as any)?.name}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0 bg-green-100 text-green-800 hover:bg-green-100">{r.download_count || 0} DLs</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b pb-4">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-500" /> Recent User Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Item</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity?.map((act, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/10">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {format(new Date(act.viewed_at), "MMM d, HH:mm 'IST'")}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {(act.profile as any)?.full_name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-muted px-2 py-1 rounded capitalize">Viewed</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="line-clamp-1">{act.title}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
// need Badge import
import { Badge } from "@/components/ui/badge";
