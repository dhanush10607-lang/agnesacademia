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

export default async function NewCurriculumPage() {
  const supabase = await createClient();

  // Fetch programmes for the dropdown
  const { data: programmes } = await supabase
    .from("programmes")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  async function createCurriculum(formData: FormData) {
    "use server";
    
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string;
    const programme_id = formData.get("programme_id") as string;
    const academic_year = formData.get("academic_year") as string;
    
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
      // In a real app we'd return an error state, but for simplicity we'll just redirect back on success
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
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Create Curriculum</h1>
          <p className="text-muted-foreground">Define a new degree subject combination.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCurriculum} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="programme_id">Programme <span className="text-red-500">*</span></Label>
              <select 
                id="programme_id" 
                name="programme_id" 
                required 
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
              <Input id="name" name="name" placeholder="e.g. B.Sc MPC (2024)" required />
              <p className="text-xs text-muted-foreground">A descriptive name for this combination.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input id="code" name="code" placeholder="e.g. BSC-MPC" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="academic_year">Academic Year</Label>
                <Input id="academic_year" name="academic_year" placeholder="e.g. 2024-2025" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Optional details..." />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Link href="/admin/academic/curricula">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" /> Create Curriculum
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
