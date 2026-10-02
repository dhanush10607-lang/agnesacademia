"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function editResourceAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const resourceId = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;

  if (!resourceId || !title || !status) {
    return { success: false, error: "Missing required fields" };
  }

  // Ensure user owns resource or is admin/mod (simplified check for just ownership here based on RLS)
  // RLS will block update if not allowed, but we can safely try.
  try {
    const { error } = await supabase
      .from("resources")
      .update({
        title,
        description,
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", resourceId)
      .eq("uploader_id", user.id); // Extra safety check

    if (error) {
      console.error("Resource update error:", error);
      return { success: false, error: "Failed to update resource. You might not have permission." };
    }

    revalidatePath(`/resources/${resourceId}`);
    revalidatePath("/faculty/resources");
    revalidatePath("/faculty");

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Internal server error" };
  }
}
