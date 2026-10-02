"use server";

import { createClient } from "@/lib/supabase/server";

export async function createResourceRecords(records: any[]) {
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
