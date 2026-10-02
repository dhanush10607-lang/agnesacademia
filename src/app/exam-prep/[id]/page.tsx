import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { BookOpen, FileText, BrainCircuit, Target, ChevronLeft, Download } from "lucide-react";
import Link from "next/link";

export default async function SubjectStudyModePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: subject, error } = await supabase
    .from("subjects")
    .select("*, programme:programmes(name), semester:semesters(name)")
    .eq("id", id)
    .single();

  if (error || !subject) notFound();

  // Fetch quizzes for this subject
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, title, difficulty")
    .eq("subject_id", id)
    .eq("status", 'published');

  // Fetch resources for this subject
  const { data: resources } = await supabase
    .from("resources")
    .select("id, title, file_path, category:resource_categories(name)")
    .eq("subject_id", id)
    .eq("status", 'published');

  const notes = resources?.filter(r => (r.category as any)?.name === 'Notes') || [];
  const questionPapers = resources?.filter(r => (r.category as any)?.name === 'Question Papers') || [];
  const questionBanks = resources?.filter(r => (r.category as any)?.name === 'Question Banks') || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* Subject Header */}
      <div className="bg-primary/5 border-b py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/exam-prep" className={buttonVariants({ variant: "ghost", className: "mb-6 -ml-4" })}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Exam Prep
          </Link>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground font-medium mb-2">
                <span>{(subject.programme as any)?.name}</span>
                <span>•</span>
                <span>{(subject.semester as any)?.name}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-heading font-extrabold mb-2">{subject.name}</h1>
              <p className="text-xl text-primary font-bold">{subject.code}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-5xl flex-grow">
        
        {/* Study Mode: Important Topics Placeholder (As requested in Phase 9 item 8) */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 mr-2 text-red-500" />
            <h2 className="text-2xl font-bold">Study Mode</h2>
          </div>
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Recommended Study Order</span>
                <span className="text-xs font-normal text-muted-foreground px-2 py-1 bg-muted rounded">UNIT 1</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {[
                  "1. Introduction and Basic Concepts",
                  "2. Architecture and Data Models",
                  "3. Relational Database Design",
                  "4. Entity-Relationship Modeling",
                  "5. SQL Fundamentals"
                ].map((topic, i) => (
                  <li key={i} className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mr-4 shrink-0">
                      {i + 1}
                    </div>
                    <span className="font-medium text-foreground">{topic.split('. ')[1]}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-6 text-center italic">
                Note: Topic importance is currently simulated. In a full production system, this data would be populated by faculty or extracted from syllabus records.
              </p>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" /> Notes & Materials
              </h2>
              <div className="grid gap-3">
                {notes.length > 0 ? notes.map(n => (
                  <Card key={n.id} className="border-border shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="font-medium line-clamp-1">{n.title}</div>
                      <Link href={`/resources/${n.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        View
                      </Link>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="text-muted-foreground text-sm italic">No notes uploaded for this subject yet.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-500" /> Question Papers & Banks
              </h2>
              <div className="grid gap-3">
                {[...questionPapers, ...questionBanks].length > 0 ? [...questionPapers, ...questionBanks].map(q => (
                  <Card key={q.id} className="border-border shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium line-clamp-1 mb-1">{q.title}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          {(q.category as any)?.name}
                        </div>
                      </div>
                      <Link href={`/resources/${q.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        View
                      </Link>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="text-muted-foreground text-sm italic">No question papers uploaded yet.</p>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <BrainCircuit className="w-5 h-5 mr-2 text-green-500" /> Practice Quizzes
              </h2>
              <div className="grid gap-4">
                {quizzes && quizzes.length > 0 ? quizzes.map(q => (
                  <Card key={q.id} className="border-border border-l-4 border-l-green-500 shadow-sm">
                    <CardContent className="p-5">
                      <h3 className="font-bold mb-2 line-clamp-2">{q.title}</h3>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs font-semibold text-muted-foreground uppercase bg-muted px-2 py-1 rounded">
                          {q.difficulty}
                        </span>
                        <Link href={`/quizzes/${q.id}`} className={buttonVariants({ size: "sm" })}>
                          Take Quiz
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card className="border-dashed bg-muted/20">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      <BrainCircuit className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No practice quizzes available.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
