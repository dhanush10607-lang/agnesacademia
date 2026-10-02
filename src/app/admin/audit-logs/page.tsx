import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText, Filter } from "lucide-react";
import { format } from "date-fns";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>;
}) {
  const { action, page = "1" } = await searchParams;
  const supabase = await createClient();
  
  const pageNum = parseInt(page);
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  let query = supabase
    .from("admin_audit_logs")
    .select("*, actor:profiles(full_name, role)", { count: "exact" });

  if (action) {
    query = query.eq("action", action);
  }

  const { data: logs, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2 flex items-center">
          <ScrollText className="w-8 h-8 mr-3 text-primary" /> System Audit Logs
        </h1>
        <p className="text-muted-foreground">Immutable record of administrative and moderation actions.</p>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">Actor</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Target</th>
                <th className="px-6 py-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs && logs.length > 0 ? (
                logs.map(log => (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {(log.actor as any)?.full_name || 'System'}
                      <div className="text-[10px] text-muted-foreground capitalize mt-0.5">{(log.actor as any)?.role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-mono bg-muted rounded border uppercase tracking-wider font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-muted-foreground uppercase">{log.target_type}</span>
                      <div className="font-mono text-[10px] mt-1">{log.target_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <pre className="text-[10px] p-2 bg-muted/30 rounded max-w-[200px] overflow-x-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-between items-center bg-muted/10">
            <span className="text-sm text-muted-foreground">
              Showing {offset + 1} to {Math.min(offset + limit, count || 0)} of {count}
            </span>
            <div className="flex gap-2">
              <a 
                href={`/admin/audit-logs?page=${Math.max(1, pageNum - 1)}`}
                className={`px-3 py-1 text-sm border rounded hover:bg-muted ${pageNum === 1 ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Prev
              </a>
              <a 
                href={`/admin/audit-logs?page=${Math.min(totalPages, pageNum + 1)}`}
                className={`px-3 py-1 text-sm border rounded hover:bg-muted ${pageNum === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Next
              </a>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
