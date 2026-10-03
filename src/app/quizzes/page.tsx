import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { BrainCircuit, Clock, HelpCircle, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

export default async function QuizzesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let subjectIds: string[] = [];

  if (user) {
    const { data: enrolledData } = await supabase
      .from("student_subjects")
      .select("subject_id")
      .eq("student_id", user.id)
      .eq("enrollment_status", "ENROLLED");
    
    if (enrolledData && enrolledData.length > 0) {
      subjectIds = enrolledData.map(e => e.subject_id);
    }
  }

  // Fetch published quizzes
  let query = supabase
    .from("quizzes")
    .select(`
      *,
      subject:subjects(name, code),
      questions:quiz_questions(count)
    `)
    .eq("status", 'published')
    .order("created_at", { ascending: false });

  if (subjectIds.length > 0) {
    query = query.in("subject_id", subjectIds);
  }

  const { data: quizzes } = await query;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-extrabold flex items-center mb-2">
            <BrainCircuit className="w-8 h-8 mr-3 text-primary" /> Practice Quizzes
          </h1>
          <p className="text-lg text-muted-foreground">
            Test your knowledge and prepare for your exams with subject-specific quizzes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes && quizzes.length > 0 ? (
            quizzes.map((quiz) => {
              const questionCount = quiz.questions && quiz.questions[0] ? quiz.questions[0].count : 0;
              return (
                <Card key={quiz.id} className="border-border shadow-sm flex flex-col h-full hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {(quiz.subject as any)?.code || "Subject"}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{quiz.title}</CardTitle>
                    {quiz.unit_name && (
                      <CardDescription className="font-medium text-foreground mt-1">
                        {quiz.unit_name}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-end">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center">
                        <HelpCircle className="w-4 h-4 mr-1" />
                        {questionCount} Qs
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {quiz.duration_minutes ? `${quiz.duration_minutes}m` : 'No limit'}
                      </div>
                    </div>
                    
                    <Link href={user ? `/quizzes/${quiz.id}` : "/login"} className={buttonVariants({ className: "w-full" })}>
                      <Play className="w-4 h-4 mr-2" /> Start Quiz
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed rounded-xl bg-muted/10">
              <BrainCircuit className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No quizzes available yet</h3>
              <p className="text-muted-foreground">Check back later when faculty members have published quizzes.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

