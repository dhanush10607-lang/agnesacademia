import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, ChevronLeft, ListChecks } from "lucide-react";
import { QuizQuestionForm } from "@/components/QuizQuestionForm";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function ManageQuizQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch quiz
  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !quiz) notFound();

  // Ensure they own it (unless admin, but we'll enforce ownership here for simplicity)
  if (quiz.created_by !== user.id) {
    redirect("/faculty");
  }

  // Fetch existing questions
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select(`
      *,
      options:quiz_options(*)
    `)
    .eq("quiz_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <Link href="/faculty" className={buttonVariants({ variant: "ghost", className: "mb-6" })}>
        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground mb-2 flex items-center">
            <BrainCircuit className="w-8 h-8 mr-3 text-primary" /> {quiz.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage questions and answers for this quiz.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Existing Questions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center">
            <ListChecks className="w-5 h-5 mr-2 text-primary" /> 
            Existing Questions ({questions?.length || 0})
          </h2>
          
          <div className="space-y-4">
            {questions && questions.length > 0 ? (
              questions.map((q, idx) => (
                <Card key={q.id} className="border-border">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg">
                        <span className="text-muted-foreground mr-2">{idx + 1}.</span> 
                        {q.question_text}
                      </h3>
                      <span className="text-xs bg-muted px-2 py-1 rounded font-medium shrink-0">
                        {q.marks} Mark(s)
                      </span>
                    </div>
                    
                    <div className="space-y-2 pl-6">
                      {q.options?.sort((a: any, b: any) => a.order_index - b.order_index).map((opt: any) => (
                        <div key={opt.id} className={`p-2 rounded-md text-sm border ${opt.is_correct ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-muted/30 border-transparent'}`}>
                          {opt.option_text} {opt.is_correct && <span className="text-green-600 dark:text-green-400 font-medium text-xs ml-2">(Correct Answer)</span>}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="mt-4 pl-6 text-sm text-muted-foreground bg-muted/20 p-3 rounded-md">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No questions added yet. Use the form to add your first question.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Add Question Form */}
        <div className="space-y-6">
          <Card className="border-border shadow-sm sticky top-24">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Add New Question</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <QuizQuestionForm quizId={id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
