"use server";

import { createClient } from "@/lib/supabase/server";

export type UploadCurriculumSubject = {
  id: string;
  name: string;
  semester: { name: string } | null;
};

type UploadResourceRecord = {
  title: string;
  description: string;
  subject_id: string;
  category_id: string;
  file_path: string;
  file_type: string;
  file_size: number;
};

export async function getUploadCurriculumSubjects(
  curriculumId: string,
  semesterId: string,
): Promise<{ success: true; subjects: UploadCurriculumSubject[] } | { success: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: curriculum, error: curriculumError } = await supabase
    .from("curricula")
    .select("programme_id, is_active")
    .eq("id", curriculumId)
    .eq("is_active", true)
    .single();
  if (curriculumError || !curriculum) {
    console.error("Load upload curriculum failed:", curriculumError);
    return { success: false, error: "The selected curriculum is not available." };
  }

  const { data: semester, error: semesterError } = await supabase
    .from("semesters")
    .select("id, name, programme_id")
    .eq("id", semesterId)
    .eq("status", "active")
    .single();
  if (semesterError || !semester) {
    console.error("Load upload semester failed:", semesterError);
    return { success: false, error: "The selected semester is not available." };
  }
  if (curriculum.programme_id !== semester.programme_id) {
    return { success: false, error: "The semester must belong to the selected curriculum's programme." };
  }

  const { data: semesterSubjects, error: subjectsError } = await supabase
    .from("subjects")
    .select("id, name, semester:semesters(name)")
    .eq("semester_id", semester.id)
    .eq("is_active", true)
    .order("name");
  if (subjectsError) {
    console.error("Load semester subjects for upload failed:", subjectsError);
    return { success: false, error: "Unable to load subjects for this semester." };
  }

  const subjects = (semesterSubjects || []).flatMap(subject => {
    const relatedSemester = subject.semester;
    const subjectSemester = Array.isArray(relatedSemester) ? relatedSemester[0] : relatedSemester;
    return [{
      id: subject.id,
      name: subject.name,
      semester: subjectSemester ? { name: subjectSemester.name } : { name: semester.name },
    }];
  }).sort((a, b) => a.name.localeCompare(b.name));

  return { success: true, subjects };
}

export async function createResourceRecords(records: UploadResourceRecord[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const insertData = records.map(r => ({
      title: r.title,
      description: r.description,
      subject_id: r.subject_id,
      category_id: r.category_id,
      uploader_id: user.id,
      status: "pending_review",
      file_path: r.file_path,
      file_type: r.file_type,
      file_size: r.file_size,
    }));

    const { error: insertError } = await supabase
      .from("resources")
      .insert(insertData);

    if (insertError) {
      console.error("DB error:", insertError);
      return { success: false, error: "Failed to create resource entry" };
    }

    // Log to audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "submitted_batch",
      item_type: "note",
      item_id: records[0].subject_id, // Reference first subject
      details: `Batch uploaded ${records.length} resources.`
    });

    return { success: true };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Internal server error" };
  }
}
