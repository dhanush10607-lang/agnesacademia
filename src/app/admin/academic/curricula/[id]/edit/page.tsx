import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

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

  async function updateCurriculum(formData: FormData) {
    "use server";
    
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string;
    const programme_id = formData.get("programme_id") as string;
    const academic_year = formData.get("academic_year") as string;
    
    const { error } = await supabase
      .from("curricula")
      .update({
        name,
        code: code || null,
        description: description || null,
        programme_id,
        academic_year: academic_year || null
      })
      .eq("id", id);
    
    if (error) {
      console.error("Error updating curriculum:", error);
      return; 
    }
    
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
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Edit Curriculum</h1>
          <p className="text-muted-foreground">Update the details for this curriculum combination.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateCurriculum} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="programme_id">Programme <span className="text-red-500">*</span></Label>
              <select 
                id="programme_id" 
                name="programme_id" 
                required 
                defaultValue={curriculum.programme_id}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a Programme</option>
                {programmes?.map(prog => (
                  <option key={prog.id} value={prog.id}>{prog.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Curriculum Name <span className="text-red-500">*</span></Label>
              <Input id="name" name="name" defaultValue={curriculum.name} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input id="code" name="code" defaultValue={curriculum.code || ""} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="academic_year">Academic Year</Label>
                <Input id="academic_year" name="academic_year" defaultValue={curriculum.academic_year || ""} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={curriculum.description || ""} />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Link href="/admin/academic/curricula">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
