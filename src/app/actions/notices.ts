"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createNoticeAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== 'faculty' && profile.role !== 'administrator')) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category_id = formData.get("category_id") as string;
    const priority = formData.get("priority") as string;
    
    // Targeting
    const department_id = formData.get("department_id") as string || null;
    const programme_id = formData.get("programme_id") as string || null;
    const semester_id = formData.get("semester_id") as string || null;

    if (!title || !content || !category_id) {
      return { success: false, error: "Title, Content, and Category are required" };
    }

    const { data: insertedNotice, error: insertError } = await supabase
      .from("notices")
      .insert({
        title,
        content,
        category_id,
        priority: priority || 'normal',
        department_id,
        programme_id,
        semester_id,
        status: 'published', // default publish for now
        created_by: user.id
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // Send push notification
    try {
      const { getTargetUserIds } = await import("@/lib/notifications/targeting");
      const { sendNotifications } = await import("@/lib/notifications/delivery");
      
      const targetIds = await getTargetUserIds(department_id, programme_id, semester_id);
      
      if (targetIds.length > 0) {
        // Run asynchronously so it doesn't block the UI response
        sendNotifications({
          userIds: targetIds,
          title: `New Notice: ${title}`,
          message: content,
          category: 'notice',
          actionUrl: `/notices/${insertedNotice.id}`,
          priority: priority === 'high' ? 'high' : 'normal'
        }).catch(console.error);
      }
    } catch (pushErr) {
      console.error("Push notification error in notice:", pushErr);
    }

    revalidatePath("/notices");
    revalidatePath("/dashboard");
    revalidatePath("/faculty");
    
    return { success: true };
  } catch (error) {
    console.error("Notice creation error:", error);
    return { success: false, error: "Internal server error" };
  }
}
