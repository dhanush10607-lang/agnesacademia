import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Download, Calendar, User, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { format } from "@/lib/date-time";
import { TrackView } from "@/components/TrackView";
import { BookmarkButton } from "@/components/BookmarkButton";
import { checkIsBookmarked } from "@/app/actions/bookmarks";
import { ReportResourceDialog } from "@/components/ReportResourceDialog";
import { getPublicResourceFileUrl } from "@/lib/storage-file-url";
import { isOfficeFilePath } from "@/lib/office-file";
import { FilePreviewButton } from "@/components/OfficePreviewButton";

export default async function QuestionPaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: paper, error } = await supabase
    .from("question_papers")
    .select(`
      *,
      subject:subjects(name),
      programme:programmes(name),
      semester:semesters(name),
      academic_year:academic_years(name),
      uploader:profiles(full_name, role)
    `)
    .eq("id", id)
    .single();

  if (error || !paper) notFound();
  
  const { data: profile } = user ? await supabase.from('profiles').select('role').eq('id', user.id).single() : { data: null };
  if (paper.status !== 'published') {
    const isUploader = user && user.id === paper.uploader_id;
    const isModeratorOrAdmin = profile && (profile.role === 'moderator' || profile.role === 'administrator' || profile.role === 'faculty');
    if (!isUploader && !isModeratorOrAdmin) {
      notFound();
    }
  }

  const isBookmarked = await checkIsBookmarked('question_paper', paper.id);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  const formatExamType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <TrackView 
        itemType="question_paper" 
        itemId={paper.id} 
        title={paper.title} 
        url={`/question-papers/${paper.id}`} 
        subjectId={paper.subject_id} 
      />
      <Link 
        href={`/subjects/${paper.subject_id}`} 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to {paper.subject?.name}
      </Link>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6 border-b bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-background">
                  {formatExamType(paper.exam_type)}
                </Badge>
                {paper.academic_year && (
                  <Badge variant="secondary">
                    {paper.academic_year.name}
                  </Badge>
                )}
                {paper.status !== 'published' && (
                  <Badge variant="destructive" className="capitalize">
                    Status: {paper.status.replace('_', ' ')}
                  </Badge>
                )}
              </div>
              <div>
                <CardTitle className="text-3xl font-heading font-extrabold text-foreground mb-2">
                  {paper.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {paper.description || "No description provided."}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <BookmarkButton 
                itemType="question_paper" 
                itemId={paper.id} 
                title={paper.title} 
                url={`/question-papers/${paper.id}`} 
                initialIsBookmarked={isBookmarked}
              />
              {paper.file_path && (
                <>
                  <FilePreviewButton
                    filePath={paper.file_path}
                    title={paper.title}
                    className="w-full sm:w-auto"
                  />
                  <a
                    href={getPublicResourceFileUrl(paper.file_path, true)}
                    className={buttonVariants({ variant: "default", className: "w-full sm:w-auto" })}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isOfficeFilePath(paper.file_path) ? "Download Original File" : "Download PDF"}
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
                <h3 className="font-semibold text-lg mb-4">Academic Details</h3>
                <dl className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <dt className="w-32 flex items-center text-muted-foreground">Programme</dt>
                    <dd className="font-medium">{paper.programme?.name}</dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="w-32 flex items-center text-muted-foreground">Semester</dt>
                    <dd className="font-medium">{paper.semester?.name}</dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="w-32 flex items-center text-muted-foreground">Subject</dt>
                    <dd className="font-medium">{paper.subject?.name}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">File Details</h3>
                <dl className="space-y-4 text-sm">
                  {paper.exam_date && (
                    <div className="flex items-start">
                      <dt className="w-32 flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" /> Exam Date
                      </dt>
                      <dd className="font-medium">{format(new Date(paper.exam_date), "PPP")}</dd>
                    </div>
                  )}
                  <div className="flex items-start">
                    <dt className="w-32 flex items-center text-muted-foreground">
                      <User className="w-4 h-4 mr-2" /> Uploaded by
                    </dt>
                    <dd className="font-medium">
                      {paper.uploader?.full_name || "Unknown"}
                    </dd>
                  </div>
                  {paper.file_path && !isOfficeFilePath(paper.file_path) && (
                    <>
                      <div className="flex items-start">
                        <dt className="w-32 text-muted-foreground">File Type</dt>
                        <dd className="font-medium uppercase">{paper.file_type?.split('/').pop() || 'PDF'}</dd>
                      </div>
                      <div className="flex items-start">
                        <dt className="w-32 text-muted-foreground">File Size</dt>
                        <dd className="font-medium">{paper.file_size ? formatBytes(paper.file_size) : 'Unknown'}</dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {paper.file_path && (
        <section id="file-preview" className="mt-8 scroll-mt-24">
          <h2 className="mb-4 text-xl font-semibold">File Preview</h2>
          <iframe
            src={getPublicResourceFileUrl(paper.file_path)}
            title={`Preview of ${paper.title}`}
            className="h-[75vh] min-h-[500px] w-full rounded-xl border bg-muted"
          />
        </section>
      )}

      <div className="mt-8 flex justify-center">
        <ReportResourceDialog itemType="question_paper" itemId={paper.id} />
      </div>
    </div>
  );
}
