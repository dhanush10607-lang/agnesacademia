import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, Edit } from "lucide-react";
import { EditResourceForm } from "@/components/EditResourceForm";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function EditFacultyResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'faculty') redirect("/dashboard");

  // Fetch resource
  const { data: resource, error } = await supabase
    .from("resources")
    .select(`
      id, title, description, status, uploader_id,
      subject:subjects(name)
    `)
    .eq("id", id)
    .single();

  if (error || !resource) {
    notFound();
  }

  // Ensure they own it
  if (resource.uploader_id !== user.id) {
    redirect("/faculty/resources");
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-2xl">
      <Link href="/faculty/resources" className={buttonVariants({ variant: "ghost", className: "mb-6" })}>
        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Resources
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-2 flex items-center">
          <Edit className="w-8 h-8 mr-3 text-primary" /> Edit Resource
        </h1>
        <p className="text-lg text-muted-foreground">
          Update details or change the status of your resource.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Resource Information</CardTitle>
          <CardDescription>Make changes below and save to update the resource.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <EditResourceForm resource={resource as any} />
        </CardContent>
      </Card>
    </div>
  );
}
