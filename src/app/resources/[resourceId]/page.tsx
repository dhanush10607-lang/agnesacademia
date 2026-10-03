import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { FileText, Download, Eye, Calendar, User, Folder, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { TrackView } from "@/components/TrackView";
import { BookmarkButton } from "@/components/BookmarkButton";
import { checkIsBookmarked } from "@/app/actions/bookmarks";
import { ReportResourceDialog } from "@/components/ReportResourceDialog";
import { getPublicResourceFileUrl } from "@/lib/storage-file-url";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ resourceId: string }>;
}) {
  const { resourceId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: resource, error } = await supabase
    .from("resources")
    .select(`
      *,
      subject:subjects(*),
      category:resource_categories(*),
      uploader:profiles(full_name, role)
    `)
    .eq("id", resourceId)
    .single();

  if (error || !resource) {
    notFound();
  }

  // Fetch user profile to check role
  const { data: profile } = user ? await supabase.from('profiles').select('role').eq('id', user.id).single() : { data: null };

  // Determine if user can view this resource (either published, or they are the uploader, or they are moderator/admin)
  if (resource.status !== 'published') {
    const isUploader = user && user.id === resource.uploader_id;
    const isModeratorOrAdmin = profile && (profile.role === 'moderator' || profile.role === 'administrator' || profile.role === 'faculty');
    if (!isUploader && !isModeratorOrAdmin) {
      notFound();
    }
  }

  const isBookmarked = await checkIsBookmarked('note', resource.id);

  // Format file size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <TrackView 
        itemType="note" 
        itemId={resource.id} 
        title={resource.title} 
        url={`/resources/${resource.id}`} 
        subjectId={resource.subject_id} 
      />
      <Link 
        href={`/subjects/${resource.subject_id}`} 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to {resource.subject?.name}
      </Link>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6 border-b bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-background">
                  <Folder className="w-3 h-3 mr-1" />
                  {resource.category?.name}
                </Badge>
                {resource.status !== 'published' && (
                  <Badge variant="secondary" className="capitalize">
                    Status: {resource.status.replace('_', ' ')}
                  </Badge>
                )}
              </div>
              <div>
                <CardTitle className="text-3xl font-heading font-extrabold text-foreground mb-2">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {resource.description || "No description provided."}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <BookmarkButton 
                itemType="note" 
                itemId={resource.id} 
                title={resource.title} 
                url={`/resources/${resource.id}`} 
                initialIsBookmarked={isBookmarked}
              />
              {resource.file_path && (
                <>
                  <a href="#file-preview" className={buttonVariants({ variant: "outline", className: "w-full sm:w-auto" })}>
                    <Eye className="w-4 h-4 mr-2" />
                    View File
                  </a>
                  <a
                    href={getPublicResourceFileUrl(resource.file_path, true)}
                    className={buttonVariants({ variant: "default", className: "w-full sm:w-auto" })}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </a>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Resource Information</h3>
                <dl className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <dt className="w-32 flex items-center text-muted-foreground">
                      <FileText className="w-4 h-4 mr-2" /> Subject
                    </dt>
                    <dd className="font-medium">{resource.subject?.name}</dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="w-32 flex items-center text-muted-foreground">
                      <User className="w-4 h-4 mr-2" /> Uploaded by
                    </dt>
                    <dd className="font-medium">
                      {resource.uploader?.full_name || "Unknown User"} 
                      <span className="text-muted-foreground ml-1 capitalize">({resource.uploader?.role})</span>
                    </dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="w-32 flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" /> Published on
                    </dt>
                    <dd className="font-medium">
                      {format(new Date(resource.created_at), "PPP")}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">File Details</h3>
                {resource.file_path ? (
                  <dl className="space-y-4 text-sm">
                    <div className="flex items-start">
                      <dt className="w-24 text-muted-foreground">File Type</dt>
                      <dd className="font-medium uppercase">{resource.file_type?.split('/').pop() || 'Unknown'}</dd>
                    </div>
                    <div className="flex items-start">
                      <dt className="w-24 text-muted-foreground">File Size</dt>
                      <dd className="font-medium">{resource.file_size ? formatBytes(resource.file_size) : 'Unknown'}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No file attached to this resource.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {resource.file_path && (
        <section id="file-preview" className="mt-8 scroll-mt-24">
          <h2 className="mb-4 text-xl font-semibold">File Preview</h2>
          <iframe
            src={getPublicResourceFileUrl(resource.file_path)}
            title={`Preview of ${resource.title}`}
            className="h-[75vh] min-h-[500px] w-full rounded-xl border bg-muted"
          />
        </section>
      )}

      <div className="mt-8 flex justify-center">
        <ReportResourceDialog itemType="note" itemId={resource.id} />
      </div>
    </div>
  );
}
