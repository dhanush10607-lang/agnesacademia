import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, XCircle, Archive, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function MySubmissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch student's submitted resources
  const { data: resources } = await supabase
    .from("resources")
    .select(`
      *,
      subject:subjects(name),
      category:resource_categories(name)
    `)
    .eq("uploader_id", user.id)
    .order("created_at", { ascending: false });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending_review': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'archived': return <Archive className="w-5 h-5 text-gray-500" />;
      default: return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200">Approved</Badge>;
      case 'pending_review': return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200">Pending</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200">Rejected</Badge>;
      case 'archived': return <Badge variant="secondary">Archived</Badge>;
      default: return <Badge variant="outline">Draft</Badge>;
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4">
            My Submissions
          </h1>
          <p className="text-lg text-muted-foreground">
            Track the status of the study materials you've contributed.
          </p>
        </div>
        <Link href="/upload" className={buttonVariants()}>
          Submit New Resource
        </Link>
      </div>

      <div className="grid gap-4 mt-8">
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <Card key={resource.id} className="border-border shadow-sm">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="p-3 bg-muted rounded-xl shrink-0">
                    {getStatusIcon(resource.status)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold truncate">
                        {resource.status === 'published' ? (
                          <Link href={`/resources/${resource.id}`} className="hover:text-primary transition-colors">
                            {resource.title}
                          </Link>
                        ) : (
                          resource.title
                        )}
                      </h3>
                      {getStatusBadge(resource.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px] uppercase font-normal bg-background">
                        {(resource.category as any)?.name}
                      </Badge>
                      <span>•</span>
                      <span className="truncate">{(resource.subject as any)?.name}</span>
                      <span>•</span>
                      <span>Submitted {format(new Date(resource.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 shrink-0">
                  {resource.status === 'rejected' && resource.moderation_note && (
                    <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 rounded text-xs max-w-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{resource.moderation_note}</span>
                    </div>
                  )}
                  {resource.status === 'published' && (
                    <Link href={`/resources/${resource.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      View Resource
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground max-w-md">
                You haven't contributed any study materials yet. Upload notes, past papers, or other helpful resources to help your peers!
              </p>
              <Link href="/upload" className={buttonVariants({ className: "mt-6" })}>
                Submit a Resource
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
