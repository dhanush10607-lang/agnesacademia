import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FacultyAssignmentManager } from "@/components/admin/FacultyAssignmentManager";
import { GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assign Faculty Subjects | Admin",
  description: "Manage subject assignments for faculty members.",
};

export default async function FacultyAssignmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "administrator") redirect("/dashboard");

  // Fetch all faculty members
  const { data: facultyList } = await supabase
    .from("profiles")
    .select("id, full_name, email, department:departments(name)")
    .eq("role", "faculty")
    .order("full_name");

  // Fetch all active subjects with hierarchy
  const { data: subjectsList } = await supabase
    .from("subjects")
    .select(`
      id, 
      name, 
      code, 
      semester:semesters(
        name, 
        academic_year:academic_years(
          name, 
          programme:programmes(name)
        )
      )
    `)
    .eq("status", "active")
    .order("name");

  // Fetch existing assignments to pre-populate
  const { data: assignmentsData } = await supabase
    .from("faculty_subjects")
    .select("faculty_id, subject_id");

  // Group assignments by faculty_id
  const initialAssignments: Record<string, string[]> = {};
  if (assignmentsData) {
    assignmentsData.forEach(row => {
      if (!initialAssignments[row.faculty_id]) {
        initialAssignments[row.faculty_id] = [];
      }
      initialAssignments[row.faculty_id].push(row.subject_id);
    });
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/users?role=faculty" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-extrabold flex items-center">
            <GraduationCap className="w-7 h-7 mr-3 text-primary" /> Faculty Subject Assignments
          </h1>
          <p className="text-muted-foreground mt-1">Assign and manage which subjects faculty members are responsible for teaching.</p>
        </div>
      </div>

      <FacultyAssignmentManager 
        facultyList={(facultyList as any) || []}
        subjectsList={(subjectsList as any) || []}
        initialAssignments={initialAssignments}
      />
    </div>
  );
}
