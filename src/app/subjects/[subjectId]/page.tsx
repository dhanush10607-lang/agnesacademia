import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, FileText, ChevronLeft, Download, Eye, FolderOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { buttonVariants } from "@/components/ui/button";

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const supabase = await createClient();

  // Fetch subject with all parents
  const { data: subject, error: subjError } = await supabase
    .from("subjects")
    .select(`
      *,
      semester:semesters(
        *,
        academic_year:academic_years(
          *,
          programme:programmes(*)
        )
      )
    `)
    .eq("id", subjectId)
    .single();

  if (subjError || !subject) {
    notFound();
  }

  // Fetch notes category ID
  const { data: notesCategory } = await supabase
    .from("resource_categories")
    .select("id")
    .eq("name", "Notes")
    .single();

  // Fetch published notes resources
  let resources: any[] = [];
  if (notesCategory) {
    const { data } = await supabase
      .from("resources")
      .select("id, title, description, created_at, file_type, file_size")
      .eq("subject_id", subjectId)
      .eq("category_id", notesCategory.id)
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (data) resources = data;
  }

  // Fetch Question Papers
  const { data: questionPapers } = await supabase
    .from("question_papers")
    .select("id, title, description, exam_type, academic_year_id, exam_date, file_type, file_size, created_at")
    .eq("subject_id", subjectId)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Fetch Question Banks
  const { data: questionBanks } = await supabase
    .from("question_banks")
    .select("id, title, description, created_at")
    .eq("subject_id", subjectId)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Fetch Syllabus
  const { data: syllabus } = await supabase
    .from("syllabi")
    .select("id, course_code, credits, course_objectives, file_type, file_size, created_at")
    .eq("subject_id", subjectId)
    .eq("status", "published")
    .maybeSingle();

  const sem = subject.semester;
  const prog = sem.academic_year.programme;

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
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <Link href={`/programmes/${prog.id}`} className="hover:text-primary transition-colors">
          {prog.name}
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <Link href={`/semesters/${sem.id}`} className="hover:text-primary transition-colors">
          {sem.name}
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <span className="text-foreground font-medium">{subject.name}</span>
      </nav>

      <div className="mb-8">
        <Link href={`/semesters/${sem.id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to {sem.name}
        </Link>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <h1 className="text-4xl font-heading font-extrabold text-foreground">{subject.name}</h1>
          {subject.code && <Badge variant="secondary" className="w-fit text-sm font-mono">{subject.code}</Badge>}
        </div>
        <p className="text-lg text-muted-foreground">Study materials, resources, and question papers.</p>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="w-full flex justify-start overflow-x-auto rounded-none border-b bg-transparent h-auto p-0 space-x-6">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">Overview</TabsTrigger>
          <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">Notes</TabsTrigger>
          <TabsTrigger value="question_papers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">Question Papers</TabsTrigger>
          <TabsTrigger value="question_bank" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">Question Bank</TabsTrigger>
          <TabsTrigger value="syllabus" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">Syllabus</TabsTrigger>
          <TabsTrigger value="assignments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">Assignments</TabsTrigger>
          <TabsTrigger value="videos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6">
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-lg font-semibold mb-1">Overview coming soon</h3>
              <p className="text-muted-foreground">Subject syllabus and overview will be added in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="pt-6">
          {resources.length > 0 ? (
            <div className="grid gap-4">
              {resources.map((res) => (
                <div key={res.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors bg-card">
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg line-clamp-1">{res.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{res.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{format(new Date(res.created_at), "MMM d, yyyy")}</span>
                        {res.file_size && (
                          <>
                            <span>•</span>
                            <span>{formatBytes(res.file_size)}</span>
                          </>
                        )}
                        {res.file_type && (
                          <>
                            <span>•</span>
                            <span className="uppercase">{res.file_type.split('/').pop()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link 
                    href={`/resources/${res.id}`} 
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-6 opacity-40" />
                <h3 className="text-xl font-semibold mb-2">No notes available</h3>
                <p className="text-muted-foreground max-w-md">No lecture notes have been published for this subject yet. Please check back later or contact your faculty.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* QUESTION PAPERS */}
        <TabsContent value="question_papers" className="pt-6">
          {questionPapers && questionPapers.length > 0 ? (
            <div className="grid gap-4">
              {questionPapers.map((qp) => (
                <div key={qp.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors bg-card">
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className="text-xs bg-background">
                          {formatExamType(qp.exam_type)}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-lg line-clamp-1">{qp.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{qp.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{format(new Date(qp.created_at), "MMM d, yyyy")}</span>
                        {qp.file_size && (
                          <>
                            <span>•</span>
                            <span>{formatBytes(qp.file_size)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link 
                    href={`/question-papers/${qp.id}`} 
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Paper
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                <FolderOpen className="h-16 w-16 text-muted-foreground mb-6 opacity-40" />
                <h3 className="text-xl font-semibold mb-2">No question papers available</h3>
                <p className="text-muted-foreground max-w-md">There are no question papers published for this subject yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* QUESTION BANK */}
        <TabsContent value="question_bank" className="pt-6">
          {questionBanks && questionBanks.length > 0 ? (
            <div className="grid gap-4">
              {questionBanks.map((qb) => (
                <div key={qb.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors bg-card">
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg line-clamp-1">{qb.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{qb.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>Created: {format(new Date(qb.created_at), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href={`/question-banks/${qb.id}`} 
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Question Bank
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                <FolderOpen className="h-16 w-16 text-muted-foreground mb-6 opacity-40" />
                <h3 className="text-xl font-semibold mb-2">No question bank available</h3>
                <p className="text-muted-foreground max-w-md">There is no question bank published for this subject yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SYLLABUS */}
        <TabsContent value="syllabus" className="pt-6">
          {syllabus ? (
            <Card className="border bg-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Course Syllabus</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                      {syllabus.course_code && (
                        <div><span className="font-medium text-foreground">Code:</span> {syllabus.course_code}</div>
                      )}
                      {syllabus.credits && (
                        <div><span className="font-medium text-foreground">Credits:</span> {syllabus.credits}</div>
                      )}
                      <div><span className="font-medium text-foreground">Updated:</span> {format(new Date(syllabus.created_at), "MMM d, yyyy")}</div>
                    </div>
                  </div>
                  <Link href={`/syllabi/${syllabus.id}`} className={buttonVariants({ variant: "default" })}>
                    <Eye className="w-4 h-4 mr-2" /> View Full Syllabus
                  </Link>
                </div>
                {syllabus.course_objectives && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Course Objectives</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{syllabus.course_objectives}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-6 opacity-40" />
                <h3 className="text-xl font-semibold mb-2">Syllabus not available</h3>
                <p className="text-muted-foreground max-w-md">The syllabus for this subject has not been published yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Coming soon states for other tabs */}
        {['assignments', 'videos'].map((tab) => (
          <TabsContent key={tab} value={tab} className="pt-6">
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                <h3 className="text-lg font-semibold mb-1 capitalize">{tab.replace('_', ' ')} coming soon</h3>
                <p className="text-muted-foreground">This section is currently under development.</p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
