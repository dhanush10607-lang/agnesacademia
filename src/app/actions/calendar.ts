"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { format, parseDateTimeLocalInIST } from "@/lib/date-time";

export async function createEventAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== 'faculty' && profile.role !== 'administrator')) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const location = formData.get("location") as string;
    const start_time = formData.get("start_time") as string;
    const end_time = formData.get("end_time") as string;
    
    // Targeting
    const department_id = formData.get("department_id") as string || null;
    const programme_id = formData.get("programme_id") as string || null;
    const curriculum_id = formData.get("curriculum_id") as string || null;
    const semester_id = formData.get("semester_id") as string || null;
    const subject_id = formData.get("subject_id") as string || null;

    if (!title || !category || !start_time || !end_time) {
      return { success: false, error: "Title, Category, and Dates are required" };
    }

    const startDate = parseDateTimeLocalInIST(start_time);
    const endDate = parseDateTimeLocalInIST(end_time);

    const { data: insertedEvent, error: insertError } = await supabase
      .from("calendar_events")
      .insert({
        title,
        description,
        category,
        location,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        department_id,
        programme_id,
        curriculum_id,
        semester_id,
        subject_id,
        status: 'published', // default publish
        created_by: user.id
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // Send push notification
    try {
      const { getTargetUserIds } = await import("@/lib/notifications/targeting");
      const { sendNotifications } = await import("@/lib/notifications/delivery");
      
      const targetIds = await getTargetUserIds(department_id, programme_id, semester_id, subject_id, curriculum_id);
      
      if (targetIds.length > 0) {
        await sendNotifications({
          userIds: targetIds,
          title: `New Event: ${title}`,
          message: description || `Scheduled for ${format(startDate, "PPP")}`,
          category: 'calendar',
          actionUrl: `/calendar`,
          priority: 'normal'
        });
      }
    } catch (pushErr) {
      console.error("Push notification error in calendar:", pushErr);
    }

    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    revalidatePath("/faculty");
    
    return { success: true };
  } catch (error) {
    console.error("Event creation error:", error);
    return { success: false, error: "Internal server error" };
  }
}
