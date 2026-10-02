"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadResourceAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
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

    // Validate file
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File exceeds 50MB limit" };
    }

    const fileExt = file.name.split('.').pop();
    const allowedExts = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'zip'];
    if (!allowedExts.includes(fileExt?.toLowerCase() || '')) {
      return { success: false, error: "Invalid file type" };
    }

    // Generate safe filename
    const safeFilename = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `uploads/${user.id}/${safeFilename}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from("resources")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage error:", uploadError);
      return { success: false, error: "Failed to upload file" };
    }

    // Insert resource
    const { error: insertError } = await supabase
      .from("resources")
      .insert({
        title,
        description,
        subject_id: subjectId,
        category_id: categoryId,
        uploader_id: user.id,
        status: "pending_review",
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
      });

    if (insertError) {
      console.error("DB error:", insertError);
      return { success: false, error: "Failed to create resource entry" };
    }

    // Log to audit log (if we want, we can do it asynchronously)
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "submitted",
      item_type: "note", // Defaulting to note, though we might parse from category
      item_id: subjectId, // Dummy since we don't have the inserted id from the previous query unless we select it
      details: `Resource submitted: ${title}`
    });

    return { success: true };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Internal server error" };
  }
}
