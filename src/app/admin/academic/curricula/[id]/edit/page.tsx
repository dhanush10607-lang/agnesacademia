import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { EditCurriculumForm } from "./EditCurriculumForm";

export default async function EditCurriculumPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  // Fetch the current curriculum
  const { data: curriculum, error: currError } = await supabase
    .from("curricula")
    .select("*")
    .eq("id", id)
    .single();

  if (currError || !curriculum) {
    redirect("/admin/academic/curricula");
  }

  // Fetch programmes for the dropdown
  const { data: programmes } = await supabase
    .from("programmes")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  const { data: sessions, error: sessionsError } = await supabase
    .from("academic_sessions")
    .select("id, name, programme_id")
    .eq("status", "active")
    .order("name");

  if (sessionsError) {
    console.error("Error loading academic sessions for curriculum edit:", sessionsError);
    throw new Error("Unable to load academic sessions for curriculum edit.");
  }

  async function updateCurriculum(formData: FormData) {
    "use server";
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profileError || profile?.role !== "administrator") {
      throw new Error("You are not authorized to update curricula.");
    }

    const nameValue = formData.get("name");
    const codeValue = formData.get("code");
    const descriptionValue = formData.get("description");
    const programmeValue = formData.get("programme_id");
    const academicSessionValue = formData.get("academic_session_id");
    if (typeof nameValue !== "string" || !nameValue.trim() ||
        typeof programmeValue !== "string" || !programmeValue ||
        (codeValue !== null && typeof codeValue !== "string") ||
        (descriptionValue !== null && typeof descriptionValue !== "string") ||
        (academicSessionValue !== null && typeof academicSessionValue !== "string")) {
      throw new Error("Enter valid curriculum details.");
    }

    let academic_year: string | null = null;
    if (academicSessionValue) {
      const { data: academicSession, error: sessionError } = await supabase
        .from("academic_sessions")
        .select("name, programme_id")
        .eq("id", academicSessionValue)
        .eq("status", "active")
        .single();
      if (sessionError || !academicSession) {
        console.error("Error validating curriculum session:", sessionError);
        throw new Error("The selected academic session is not available.");
      }
      if (academicSession.programme_id !== programmeValue) {
        throw new Error("The selected academic session must belong to this programme.");
      }
      academic_year = academicSession.name;
    }

    const { error } = await supabase
      .from("curricula")
      .update({
        name: nameValue.trim(),
        code: typeof codeValue === "string" ? codeValue || null : null,
        description: typeof descriptionValue === "string" ? descriptionValue || null : null,
        programme_id: programmeValue,
        academic_year
      })
      .eq("id", id);
    
    if (error) {
      console.error("Error updating curriculum:", error);
      throw new Error("Unable to update the curriculum.");
    }
    
    revalidatePath("/admin/academic/curricula");
    revalidatePath(`/admin/academic/curricula/${id}/edit`);
    redirect("/admin/academic/curricula");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/academic/curricula">
          <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Edit Curriculum</h1>
          <p className="text-muted-foreground">Update the details for this curriculum combination.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditCurriculumForm
            programmes={programmes || []}
            sessions={sessions || []}
            curriculum={curriculum}
            action={updateCurriculum}
          />
        </CardContent>
      </Card>
    </div>
  );
}
