"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAssignmentAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  
  if (!profile || profile.role !== 'faculty') {
    return { success: false, error: "Unauthorized. Faculty only." };
  }

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const instructions = formData.get("instructions") as string;
    const subjectId = formData.get("subject_id") as string;
    const dueDate = formData.get("due_date") as string;
    const file = formData.get("file") as File;
    const status = formData.get("status") as string || "published";

    if (!title || !subjectId) {
      return { success: false, error: "Title and Subject are required" };
    }

    let filePath = null;

    if (file && file.size > 0) {
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      if (file.size > MAX_FILE_SIZE) {
        return { success: false, error: "File exceeds 50MB limit" };
      }

      const fileExt = file.name.split('.').pop();
      const safeFilename = `${crypto.randomUUID()}.${fileExt}`;
      filePath = `assignments/${user.id}/${safeFilename}`;

      const { error: uploadError } = await supabase.storage
        .from("resources") // using resources bucket for simplicity or create an assignments bucket
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage error:", uploadError);
        return { success: false, error: "Failed to upload file" };
      }
    }

    const { error: insertError } = await supabase
      .from("assignments")
      .insert({
        title,
        description,
        instructions,
        subject_id: subjectId,
        created_by: user.id,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        file_path: filePath,
        status,
      });

    if (insertError) {
      console.error("DB error:", insertError);
      return { success: false, error: "Failed to create assignment entry" };
    }

    revalidatePath("/faculty");
    revalidatePath("/faculty/assignments");

    return { success: true, status };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Internal server error" };
  }
}
