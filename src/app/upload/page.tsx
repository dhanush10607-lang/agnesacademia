import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud, Info } from "lucide-react";
import { UploadForm } from "@/components/UploadForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from("resource_categories")
    .select("id, name")
    .order("name", { ascending: true });

  // Fetch profile to get role and semester
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, semester_id")
    .eq("id", user.id)
    .single();

  // Fetch subjects. Filter by semester_id if it's a student.
  let subjectQuery = supabase
    .from("subjects")
    .select(`
      id, name,
      semester:semesters(name)
    `)
    .order("name", { ascending: true });

  if (profile?.role === "student") {
    if (profile.semester_id) {
      subjectQuery = subjectQuery.eq("semester_id", profile.semester_id);
    } else {
      // If student hasn't set their semester, they see no subjects.
      subjectQuery = subjectQuery.eq("semester_id", "00000000-0000-0000-0000-000000000000"); 
    }
  }

  const { data: subjects } = await subjectQuery;

  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4 flex items-center">
          <UploadCloud className="w-8 h-8 mr-3 text-primary" /> Contribute Resource
        </h1>
        <p className="text-lg text-muted-foreground">
          Help your peers by sharing notes, question papers, and other study materials.
        </p>
      </div>

      <Alert className="mb-8 bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900">
        <Info className="h-4 w-4" />
        <AlertTitle>Review Process</AlertTitle>
        <AlertDescription>
          All uploaded resources go through a moderation review before they are published to ensure quality and relevance. 
          Please do not upload copyrighted or inappropriate material.
        </AlertDescription>
      </Alert>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Resource Details</CardTitle>
          <CardDescription>Fill out the details below to submit your file.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <UploadForm categories={categories || []} subjects={(subjects as any) || []} />
        </CardContent>
      </Card>
    </div>
  );
}
