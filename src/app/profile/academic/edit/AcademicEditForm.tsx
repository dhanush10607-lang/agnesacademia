"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function AcademicEditForm({
  initialProgrammes = [],
  initialCurricula = [],
  initialYears = [],
  initialSemesters = [],
  currentProfile
}: {
  initialProgrammes?: any[];
  initialCurricula?: any[];
  initialYears?: any[];
  initialSemesters?: any[];
  currentProfile: any;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [progId, setProgId] = useState<string>(currentProfile.programme_id || "");
  const [currId, setCurrId] = useState<string>(currentProfile.curriculum_id || "");
  const [yearId, setYearId] = useState<string>(currentProfile.academic_year_id || "");
  const [semId, setSemId] = useState<string>(currentProfile.semester_id || "");

  const [programmes, setProgrammes] = useState<any[]>(initialProgrammes);
  const [curricula, setCurricula] = useState<any[]>(initialCurricula);
  const [years, setYears] = useState<any[]>(initialYears);
  const [semesters, setSemesters] = useState<any[]>(initialSemesters);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Programmes are already passed as initialProgrammes, no need to fetch based on deptId

  // Load Years & Curricula when Prog changes
  useEffect(() => {
    if (!progId) return;
    supabase.from("academic_years").select("id, name").eq("programme_id", progId).order("name")
      .then(({ data }) => setYears(data || []));
    supabase.from("curricula").select("id, name").eq("programme_id", progId).eq("is_active", true).order("name")
      .then(({ data }) => setCurricula(data || []));
  }, [progId, supabase]);

  // Load Semesters when Year changes
  useEffect(() => {
    if (!yearId) return;
    supabase.from("semesters").select("id, name").eq("academic_year_id", yearId).order("name")
      .then(({ data }) => setSemesters(data || []));
  }, [yearId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progId || !yearId || !semId) {
      setErrorMsg("Please select all fields");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if the semester change invalidates subjects.
    // To be safe, we just clear their selected subjects when they change semester.
    if (semId !== currentProfile.semester_id) {
      await supabase.from("student_subjects").delete().eq("student_id", user.id);
    }

    // Infer department_id from selected programme
    const selectedProg = programmes.find(p => p.id === progId);
    const inferredDeptId = selectedProg?.department_id ?? null;

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update({
        department_id: inferredDeptId,
        programme_id: progId,
        curriculum_id: currId || null,
        academic_year_id: yearId,
        semester_id: semId
      })
      .eq("id", user.id)
      .select("id")
      .maybeSingle();

    setIsSubmitting(false);

    if (error || !updatedProfile) {
      if (error) console.error("Academic profile update failed:", error);
      setErrorMsg("Failed to update profile. Please try again.");
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/profile/academic");
        router.refresh();
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center space-y-4 bg-card rounded-xl border">
        <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold">Academic Profile Updated!</h3>
        <p className="text-muted-foreground">Redirecting you back...</p>
      </div>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
              {errorMsg}
            </div>
          )}
          
          {(semId && semId !== currentProfile.semester_id) && (
            <div className="p-3 bg-amber-50 text-amber-800 rounded-md text-sm border border-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Warning:</strong> Changing your semester will automatically clear your currently selected subjects. You will need to re-select them on the next page.
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Programme</Label>
            <Select 
              value={programmes.some(p => p.id === progId) ? progId : ""} 
              onValueChange={(val) => { setProgId(val || ""); setCurrId(""); setYearId(""); setSemId(""); }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Programme">
                  {(value) => programmes.find(programme => programme.id === value)?.name || "Select Programme"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {programmes.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Curriculum</Label>
            <Select 
              disabled={!progId} 
              value={curricula.some(c => c.id === currId) ? currId : ""} 
              onValueChange={(val) => { setCurrId(val || ""); }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Curriculum">
                  {(value) => curricula.find(curriculum => curriculum.id === value)?.name || "Select Curriculum"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {curricula.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Academic Year</Label>
            <Select 
              disabled={!progId} 
              value={years.some(y => y.id === yearId) ? yearId : ""} 
              onValueChange={(val) => { setYearId(val || ""); setSemId(""); }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year">
                  {(value) => years.find(year => year.id === value)?.name || "Select Year"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Semester</Label>
            <Select 
              disabled={!yearId} 
              value={semesters.some(s => s.id === semId) ? semId : ""} 
              onValueChange={(val) => setSemId(val || "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Semester">
                  {(value) => semesters.find(semester => semester.id === value)?.name || "Select Semester"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {semesters.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => router.push("/profile/academic")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !semId}>
              {isSubmitting ? "Saving..." : "Confirm Change"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
