"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
    const semester_id = formData.get("semester_id") as string || null;

    if (!title || !category || !start_time || !end_time) {
      return { success: false, error: "Title, Category, and Dates are required" };
    }

    const { error: insertError } = await supabase
      .from("calendar_events")
      .insert({
        title,
        description,
        category,
        location,
        start_time: new Date(start_time).toISOString(),
        end_time: new Date(end_time).toISOString(),
        department_id,
        programme_id,
        semester_id,
        status: 'published', // default publish
        created_by: user.id
      });

    if (insertError) throw insertError;

    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    revalidatePath("/faculty");
    
    return { success: true };
  } catch (error) {
    console.error("Event creation error:", error);
    return { success: false, error: "Internal server error" };
  }
}
