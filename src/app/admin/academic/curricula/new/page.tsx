import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { revalidatePath, updateTag } from "next/cache";
import { PUBLIC_CACHE_TAGS } from "@/lib/public-cache-tags";
import { NewCurriculumForm } from "./NewCurriculumForm";

export default async function NewCurriculumPage() {
  const supabase = await createClient();

  const [
    { data: programmes, error: programmesError },
    { data: academicSessions, error: academicSessionsError },
  ] = await Promise.all([
    supabase
      .from("programmes")
      .select("id, name")
      .eq("status", "active")
      .order("name"),
    supabase
      .from("academic_sessions")
      .select("id, name, programme_id")
      .eq("status", "active")
      .order("name"),
  ]);

  if (programmesError) {
    console.error("Error loading programmes for curriculum creation:", programmesError);
    throw new Error("Unable to load programmes for curriculum creation.");
  }

  if (academicSessionsError) {
    console.error("Error loading academic sessions for curriculum creation:", academicSessionsError);
    throw new Error("Unable to load academic sessions for curriculum creation.");
  }

  async function createCurriculum(formData: FormData) {
    "use server";
    
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string;
    const programme_id = formData.get("programme_id") as string;
    const academicSessionId = formData.get("academic_session_id") as string;
    let academic_year: string | null = null;

    if (academicSessionId) {
      const { data: academicSession, error: academicSessionError } = await supabase
        .from("academic_sessions")
        .select("name, programme_id")
        .eq("id", academicSessionId)
        .eq("status", "active")
        .single();

      if (academicSessionError || !academicSession) {
        console.error("Error validating curriculum academic session:", academicSessionError);
        throw new Error("The selected academic session could not be found.");
      }
      if (academicSession.programme_id !== programme_id) {
        throw new Error("The selected academic session does not belong to this programme.");
      }

      academic_year = academicSession.name;
    }

    const { error } = await supabase.from("curricula").insert({
      name,
      code: code || null,
      description: description || null,
      programme_id,
      academic_year: academic_year || null,
      is_active: true
    });
    
    if (error) {
      console.error("Error creating curriculum:", error);
      throw new Error("Unable to create the curriculum.");
    }
    
    updateTag(PUBLIC_CACHE_TAGS.programmes);
    revalidatePath("/admin/academic/curricula");
    redirect("/admin/academic/curricula");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/academic/curricula">
          <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Create Curriculum</h1>
          <p className="text-muted-foreground">Define a new degree subject combination.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum Details</CardTitle>
        </CardHeader>
        <CardContent>
          <NewCurriculumForm
            programmes={programmes || []}
            academicSessions={academicSessions || []}
            action={createCurriculum}
          />
        </CardContent>
      </Card>
    </div>
  );
}
