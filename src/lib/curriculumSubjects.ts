/**
 * Fetch subjects belonging to a curriculum, filtered to the student's semester.
 * Matches by semester_id OR by semester name (semesters can be duplicated per programme).
 */
export async function getCurriculumSemesterSubjects(
  supabase: any,
  curriculumId: string | null | undefined,
  semesterId: string | null | undefined,
  semesterName?: string | null
) {
  if (!curriculumId) return [];

  const { data, error } = await supabase
    .from("curriculum_subjects")
    .select(`
      id, is_compulsory, is_selectable, minimum_selection, maximum_selection,
      subject:subjects (*, semester:semesters(id, name)),
      subject_type:subject_types (name, display_order)
    `)
    .eq("curriculum_id", curriculumId);

  if (error) {
    console.error("Error fetching curriculum subjects:", error);
    return [];
  }

  const romans: Record<string, string> = {
    i: "1", ii: "2", iii: "3", iv: "4", v: "5", vi: "6", vii: "7", viii: "8", ix: "9", x: "10",
  };
  const norm = (s?: string | null) =>
    (s || "")
      .toLowerCase()
      .replace(/sem(ester)?\.?/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(" ")
      .map((w) => romans[w] || w)
      .join(" ");
  const target = norm(semesterName);

  return (data || []).filter((cs: any) => {
    const sub = cs.subject;
    if (!sub) return false;
    if (!semesterId && !target) return true;
    if (semesterId && sub.semester_id === semesterId) return true;
    if (target && norm(sub.semester?.name) === target) return true;
    return false;
  });
}
