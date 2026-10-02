import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { BookOpen, Target, BrainCircuit, FileText, Bookmark, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function ExamPrepPage() {
  const supabase = await createClient();

  // For a full implementation, we'd add filters for Programme -> Semester -> Subject here.
  // We'll show a simplified overview dashboard that leads into subjects for the MVP.
  
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, code, semester:semesters(name), programme:programmes(name)")
    .limit(10); // Limit for demo purposes

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-heading font-extrabold mb-4">Exam Preparation</h1>
          <p className="text-lg text-muted-foreground">
            Get ready for your exams with structured study materials, question banks, past papers, and practice quizzes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-border shadow-sm hover:border-primary/50 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Study Materials</h3>
              <p className="text-sm text-muted-foreground mb-4">Notes, presentations, and PDFs provided by faculty and peers.</p>
              <Link href="/resources" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-auto" })}>
                Browse Notes
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:border-primary/50 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Question Banks</h3>
              <p className="text-sm text-muted-foreground mb-4">Curated questions categorized by units and topics.</p>
              <Link href="/resources?category=Question+Banks" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-auto" })}>
                Find Q-Banks
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:border-primary/50 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full mb-4">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Past Papers</h3>
              <p className="text-sm text-muted-foreground mb-4">Previous semester exam papers for practice.</p>
              <Link href="/resources?category=Question+Papers" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-auto" })}>
                View Papers
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:border-primary/50 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Practice Quizzes</h3>
              <p className="text-sm text-muted-foreground mb-4">Take interactive MCQs to test your knowledge.</p>
              <Link href="/quizzes" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-auto" })}>
                Start Quiz
              </Link>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-6">Select a Subject to Study</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects?.map(subject => (
            <Link key={subject.id} href={`/exam-prep/${subject.id}`}>
              <Card className="border-border shadow-sm hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="p-5 flex justify-between items-center h-full">
                  <div>
                    <h3 className="font-bold text-lg line-clamp-1">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {(subject.programme as any)?.name} • {(subject.semester as any)?.name}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
