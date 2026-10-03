import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, AlertTriangle, ShieldCheck, ExternalLink, Filter, Flag, Search, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ModerationActionArea } from "@/components/ModerationActionArea";

export default async function ModerationDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const filter = typeof resolvedParams.filter === 'string' ? resolvedParams.filter : 'pending';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  
  if (!profile || (profile.role !== 'moderator' && profile.role !== 'administrator')) {
    redirect("/"); // Unauthorized
  }

  // Map filters to resource statuses
  let statusFilter = "pending_review";
  if (filter === "approved") statusFilter = "published";
  else if (filter === "rejected") statusFilter = "rejected";
  
  // Note: 'reported' filter might require a join with resource_reports, keeping simple for this phase
  
  let query = supabase
    .from("resources")
    .select(`
      *,
      subject:subjects(name),
      category:resource_categories(name),
      uploader:profiles(full_name, role)
    `)
    .order("created_at", { ascending: false });

  if (filter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: resources } = await query;

  const filters = [
    { id: 'pending', label: 'Pending Review' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'all', label: 'All Resources' },
  ];

  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4 flex items-center">
          <ShieldCheck className="w-8 h-8 mr-3 text-primary" /> Moderation Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Review and moderate student-contributed academic resources.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/moderation/reports" className={buttonVariants({ variant: "outline" })}>
            <Flag className="mr-2 h-4 w-4" />
            Review user reports
          </Link>
          <Link href="/search" className={buttonVariants({ variant: "outline" })}>
            <Search className="mr-2 h-4 w-4" />
            Search Resources
          </Link>
          <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <div className="flex items-center text-sm font-medium text-muted-foreground mr-2">
          <Filter className="w-4 h-4 mr-2" /> Filter:
        </div>
        {filters.map(f => (
          <Link 
            key={f.id} 
            href={`/moderation?filter=${f.id}`}
            className={buttonVariants({ 
              variant: filter === f.id ? "default" : "outline",
              size: "sm",
              className: "rounded-full"
            })}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <Card key={resource.id} className="border-border shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-stretch">
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-background">{(resource.category as any)?.name}</Badge>
                      <Badge variant="secondary">{(resource.subject as any)?.name}</Badge>
                      {resource.status === 'pending_review' && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200">Pending</Badge>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {resource.description || "No description provided."}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">By:</span> 
                      {(resource.uploader as any)?.full_name || "Unknown"}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}
                    </div>
                    {resource.file_type && (
                      <div className="flex items-center uppercase text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        {resource.file_type.split('/').pop()}
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <div className="bg-muted/30 border-t md:border-t-0 md:border-l border-border p-6 flex flex-col justify-center gap-4 md:w-64 shrink-0">
                  <Link 
                    href={`/resources/${resource.id}`} 
                    target="_blank"
                    className={buttonVariants({ variant: "outline", className: "w-full" })}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview Resource
                  </Link>
                  
                  {resource.status === 'pending_review' ? (
                    <ModerationActionArea resourceId={resource.id} />
                  ) : (
                    <div className="text-center p-3 rounded bg-background border">
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-muted-foreground capitalize">{resource.status.replace('_', ' ')}</p>
                      {resource.moderation_note && (
                        <p className="text-xs mt-2 text-red-500 line-clamp-2" title={resource.moderation_note}>
                          Reason: {resource.moderation_note}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <ShieldCheck className="h-16 w-16 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-xl font-semibold mb-2">Queue is empty</h3>
              <p className="text-muted-foreground max-w-md">
                There are no resources matching the current filter. 
                {filter === 'pending' && " You're all caught up!"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
