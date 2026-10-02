import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, ChevronLeft } from "lucide-react";
import { NoticeForm } from "@/components/NoticeForm";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function NewNoticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'faculty' && profile.role !== 'administrator') redirect("/dashboard");

  // Fetch metadata for selects
  const { data: categories } = await supabase.from("notice_categories").select("*").order("name");
  const { data: departments } = await supabase.from("departments").select("*").order("name");
  const { data: programmes } = await supabase.from("programmes").select("*").order("name");
  const { data: semesters } = await supabase.from("semesters").select("*").order("name");

  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl">
      <Link href="/faculty" className={buttonVariants({ variant: "ghost", className: "mb-6" })}>
        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4 flex items-center">
          <Megaphone className="w-8 h-8 mr-3 text-primary" /> Create Notice
        </h1>
        <p className="text-lg text-muted-foreground">
          Publish an official announcement to the Notice Board.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Notice Details</CardTitle>
          <CardDescription>Fill in the details below. Targeted notices will only appear on the dashboards of the specified audience.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <NoticeForm 
            categories={categories || []}
            departments={departments || []}
            programmes={programmes || []}
            semesters={semesters || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
