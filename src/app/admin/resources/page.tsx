import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Layers } from "lucide-react";
import { ResourceStatusSelect } from "@/components/admin/ResourceControls";
import { ProcessAIButton } from "@/components/admin/ProcessAIButton";
import { format } from "date-fns";

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q, status, page = "1" } = await searchParams;
  const supabase = await createClient();
  
  const pageNum = parseInt(page);
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  let query = supabase
    .from("resources")
    .select("*, uploader:profiles(full_name), category:resource_categories(name), subject:subjects(code)", { count: "exact" });

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }
  
  if (status) {
    query = query.eq("status", status);
  }

  const { data: resources, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2 flex items-center">
          <Layers className="w-8 h-8 mr-3 text-primary" /> Resource Management
        </h1>
        <p className="text-muted-foreground">Search, filter, and moderate all platform resources.</p>
      </div>

      <Card className="mb-6 border-border shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <form className="flex-grow flex gap-2" action="/admin/resources">
            {status && <input type="hidden" name="status" value={status} />}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                name="q" 
                defaultValue={q} 
                placeholder="Search resources by title..." 
                className="pl-9 bg-background"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          <div className="flex gap-2 shrink-0">
            <form action="/admin/resources">
              {q && <input type="hidden" name="q" value={q} />}
              <div className="flex gap-2">
                <select 
                  name="status" 
                  defaultValue={status || ""} 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="draft">Draft</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
                <Button type="submit" variant="secondary">Filter</Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Title & Category</th>
                <th className="px-6 py-4 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold">Uploaded By</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {resources && resources.length > 0 ? (
                resources.map(resource => (
                  <tr key={resource.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground line-clamp-1">{resource.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{(resource.category as any)?.name}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {(resource.subject as any)?.code || '-'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {(resource.uploader as any)?.full_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {format(new Date(resource.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <ResourceStatusSelect resourceId={resource.id} currentStatus={resource.status} />
                      <ProcessAIButton resourceId={resource.id} fileType={resource.file_type} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No resources found.
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
                href={`/admin/resources?page=${Math.max(1, pageNum - 1)}${q ? `&q=${q}`:''}${status ? `&status=${status}`:''}`}
                className={`px-3 py-1 text-sm border rounded hover:bg-muted ${pageNum === 1 ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Prev
              </a>
              <a 
                href={`/admin/resources?page=${Math.min(totalPages, pageNum + 1)}${q ? `&q=${q}`:''}${status ? `&status=${status}`:''}`}
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
