"use server";

import { createClient } from "@/lib/supabase/server";
import { updateTag } from "next/cache";
import { PUBLIC_CACHE_TAGS } from "@/lib/public-cache-tags";

export async function uploadFacultyResourceAction(formData: FormData) {
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
    const subjectId = formData.get("subject_id") as string;
    const categoryId = formData.get("category_id") as string;
    const file = formData.get("file") as File;

    if (!title || !subjectId || !categoryId || !file) {
      return { success: false, error: "Missing required fields" };
    }

    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB for faculty
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File exceeds 100MB limit" };
    }

    const fileExt = file.name.split('.').pop();
    const safeFilename = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `resources/faculty/${user.id}/${safeFilename}`;

    const { error: uploadError } = await supabase.storage
      .from("resources")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage error:", uploadError);
      return { success: false, error: "Failed to upload file" };
    }

    // Check if faculty bypasses moderation
    const { data: settings } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "faculty_bypass_moderation")
      .single();

    let status = "pending_review";
    // If setting is true or not present (defaulting to true conceptually based on schema), publish it
    if (!settings || settings.value === "true" || settings.value === true) {
      status = "published";
    }

    const { error: insertError } = await supabase
      .from("resources")
      .insert({
        title,
        description,
        subject_id: subjectId,
        category_id: categoryId,
        uploader_id: user.id,
        status,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
      });

    if (insertError) {
      console.error("DB error:", insertError);
      return { success: false, error: "Failed to create resource entry" };
    }

    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "submitted",
      item_type: "note",
      item_id: subjectId,
      details: `Faculty resource uploaded: ${title}. Status: ${status}`
    });

    if (status === "published") {
      updateTag(PUBLIC_CACHE_TAGS.resources);
    }
    return { success: true, status };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Internal server error" };
  }
}
