import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, ChevronLeft, ShieldCheck } from "lucide-react";
import { QuizForm } from "@/components/QuizForm";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function NewQuizPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'faculty') redirect("/dashboard");

  // Fetch ONLY assigned subjects for this faculty member
  const { data: facultySubjects } = await supabase
    .from("faculty_subjects")
    .select(`
      subject:subjects(id, name, code)
    `)
    .eq("faculty_id", user.id);

  const subjects = facultySubjects?.map(fs => fs.subject).filter(Boolean) || [];

  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl">
      <Link href="/faculty" className={buttonVariants({ variant: "ghost", className: "mb-6" })}>
        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4 flex items-center">
          <BrainCircuit className="w-8 h-8 mr-3 text-primary" /> Create New Quiz
        </h1>
        <p className="text-lg text-muted-foreground">
          Build a quiz for your students to test their knowledge.
        </p>
      </div>

      {subjects.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ShieldCheck className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
            <h3 className="text-xl font-semibold mb-2">No subjects assigned</h3>
            <p className="text-muted-foreground">You must be assigned to at least one subject before you can create quizzes.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border shadow-sm">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle>Quiz Settings</CardTitle>
            <CardDescription>First, define the core settings for this quiz. You will add questions on the next page.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <QuizForm subjects={subjects as any} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
