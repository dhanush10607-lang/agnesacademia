import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, Archive, CheckCircle, UploadCloud, ChevronLeft, Edit } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default async function FacultyResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'faculty') redirect("/dashboard");

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
      case 'archived': return <Archive className="w-5 h-5 text-gray-500" />;
      default: return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <Link href="/faculty" className={buttonVariants({ variant: "ghost", className: "mb-6" })}>
        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-primary" /> Manage Resources
          </h1>
          <p className="text-lg text-muted-foreground">
            View, edit, and archive your uploaded materials.
          </p>
        </div>
        <Link href="/faculty/upload" className={buttonVariants()}>
          <UploadCloud className="w-4 h-4 mr-2" /> Upload New
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
                        <Link href={`/resources/${resource.id}`} className="hover:text-primary transition-colors">
                          {resource.title}
                        </Link>
                      </h3>
                      <Badge variant="outline" className="capitalize">{resource.status.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px] uppercase font-normal">
                        {(resource.category as any)?.name}
                      </Badge>
                      <span>•</span>
                      <span className="truncate">{(resource.subject as any)?.name}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <Link href={`/resources/${resource.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Preview
                  </Link>
                  <Link href={`/faculty/resources/${resource.id}/edit`} className={buttonVariants({ variant: "default", size: "sm" })}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground max-w-md">
                You haven't uploaded any study materials yet.
              </p>
              <Link href="/faculty/upload" className={buttonVariants({ className: "mt-6" })}>
                Upload a Resource
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
