import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileText, Download, Eye, BookOpen, Clock, GraduationCap } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { TrackView } from "@/components/TrackView";
import { BookmarkButton } from "@/components/BookmarkButton";
import { checkIsBookmarked } from "@/app/actions/bookmarks";
import { ReportResourceDialog } from "@/components/ReportResourceDialog";
import { getPublicResourceFileUrl } from "@/lib/storage-file-url";

export default async function SyllabusDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the syllabus with subject details
  const { data: syllabus, error } = await supabase
    .from("syllabi")
    .select(`
      *,
      subject:subjects(name)
    `)
    .eq("id", id)
    .single();

  if (error || !syllabus) notFound();

  if (syllabus.status !== 'published' && (!user || user.id !== syllabus.created_by)) {
    notFound();
  }

  const isBookmarked = await checkIsBookmarked('syllabus', syllabus.id);

  // Fetch units
  const { data: units } = await supabase
    .from("syllabus_units")
    .select("*")
    .eq("syllabus_id", id)
    .order("unit_number", { ascending: true });

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <TrackView 
        itemType="syllabus" 
        itemId={syllabus.id} 
        title={`${(syllabus.subject as any)?.name} Syllabus`} 
        url={`/syllabi/${syllabus.id}`} 
        subjectId={syllabus.subject_id} 
      />
      <Link 
        href={`/subjects/${syllabus.subject_id}`} 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to {(syllabus.subject as any)?.name || 'Subject'}
      </Link>

      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="bg-background">Official Syllabus</Badge>
            {syllabus.course_code && (
              <Badge variant="secondary" className="font-mono">{syllabus.course_code}</Badge>
            )}
            {syllabus.status !== 'published' && (
              <Badge variant="destructive">Status: {syllabus.status.replace('_', ' ')}</Badge>
            )}
          </div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4">
            {(syllabus.subject as any)?.name} Syllabus
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {syllabus.credits && (
              <div className="flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span className="font-medium text-foreground mr-1">Credits:</span> {syllabus.credits}
              </div>
            )}
            {syllabus.contact_hours && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-medium text-foreground mr-1">Contact Hours:</span> {syllabus.contact_hours} hrs
              </div>
            )}
            <div className="flex items-center">
              <span className="font-medium text-foreground mr-1">Updated:</span> {format(new Date(syllabus.updated_at), "PPP")}
            </div>
          </div>
        </div>
        <div className="shrink-0 pt-2">
          <BookmarkButton 
            itemType="syllabus" 
            itemId={syllabus.id} 
            title={`${(syllabus.subject as any)?.name} Syllabus`} 
            url={`/syllabi/${syllabus.id}`} 
            initialIsBookmarked={isBookmarked}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {(syllabus.course_objectives || syllabus.learning_outcomes) && (
            <div className="space-y-6">
              {syllabus.course_objectives && (
                <Card className="border-border">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-lg">Course Objectives</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {syllabus.course_objectives}
                    </p>
                  </CardContent>
                </Card>
              )}
              {syllabus.learning_outcomes && (
                <Card className="border-border">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-lg">Learning Outcomes</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {syllabus.learning_outcomes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {units && units.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Units & Modules</h2>
              <div className="space-y-4">
                {units.map((unit) => (
                  <Card key={unit.id} className="border-border shadow-sm">
                    <CardHeader className="pb-3 border-b bg-muted/10 flex flex-row items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-primary mb-1">UNIT {unit.unit_number}</div>
                        <CardTitle className="text-xl">{unit.title}</CardTitle>
                      </div>
                      {unit.contact_hours && (
                        <Badge variant="secondary" className="shrink-0">
                          {unit.contact_hours} hrs
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                        {unit.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {syllabus.file_path && (
            <Card className="border-border border-primary/20 shadow-sm bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-primary/20 text-primary rounded-lg mr-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Official PDF</h3>
                    <p className="text-xs text-muted-foreground">
                      {syllabus.file_size ? formatBytes(syllabus.file_size) : 'PDF Document'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <a href="#file-preview" className={buttonVariants({ variant: "secondary", className: "w-full" })}>
                    <Eye className="w-4 h-4 mr-2" /> View Syllabus
                  </a>
                  <a
                    href={getPublicResourceFileUrl(syllabus.file_path, true)}
                    className={buttonVariants({ variant: "outline", className: "w-full" })}
                  >
                    <Download className="w-4 h-4 mr-2" /> Download Syllabus
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {(syllabus.recommended_books || syllabus.reference_materials) && (
            <Card className="border-border">
              <CardHeader className="pb-3 border-b bg-muted/30">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" /> References
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                {syllabus.recommended_books && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-foreground">Recommended Books</h4>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                      {syllabus.recommended_books}
                    </p>
                  </div>
                )}
                {syllabus.reference_materials && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-foreground">Reference Materials</h4>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                      {syllabus.reference_materials}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {syllabus.file_path && (
        <section id="file-preview" className="mt-8 scroll-mt-24">
          <h2 className="mb-4 text-xl font-semibold">Syllabus File Preview</h2>
          <iframe
            src={getPublicResourceFileUrl(syllabus.file_path)}
            title="Syllabus file preview"
            className="h-[75vh] min-h-[500px] w-full rounded-xl border bg-muted"
          />
        </section>
      )}
      <div className="mt-8 flex justify-center">
        <ReportResourceDialog itemType="syllabus" itemId={syllabus.id} />
      </div>
    </div>
  );
}
