"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAnnouncementAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'faculty') {
    return { success: false, error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const subjectId = formData.get("subject_id") as string;

  if (!title || !content || !subjectId) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const { error } = await supabase.from("announcements").insert({
      title,
      content,
      subject_id: subjectId,
      created_by: user.id,
      status: 'published'
    });

    if (error) {
      console.error("Announcement error:", error);
      return { success: false, error: "Failed to create announcement" };
    }

    revalidatePath("/faculty");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Internal server error" };
  }
}
