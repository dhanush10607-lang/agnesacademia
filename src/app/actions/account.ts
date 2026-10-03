"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type DeleteAccountState = {
  error?: string;
};

const contributionAuthors = [
  { table: "admin_settings", column: "updated_by" },
  { table: "announcements", column: "created_by" },
  { table: "app_settings", column: "updated_by" },
  { table: "assignments", column: "created_by" },
  { table: "audit_logs", column: "user_id" },
  { table: "calendar_events", column: "created_by" },
  { table: "notices", column: "created_by" },
  { table: "question_banks", column: "created_by" },
  { table: "question_papers", column: "uploader_id" },
  { table: "quizzes", column: "created_by" },
  { table: "resources", column: "uploader_id" },
  { table: "syllabi", column: "created_by" },
] as const;

export async function deleteAccountAction(
  _previousState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  if (formData.get("confirmation") !== "DELETE") {
    return { error: "Type DELETE exactly to confirm account deletion." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Your session has expired. Sign in again before deleting your account." };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Account deletion is unavailable because Supabase admin credentials are missing.");
    return { error: "Account deletion is currently unavailable. Please try again later." };
  }

  const admin = createAdminClient();

  for (const { table, column } of contributionAuthors) {
    const { error } = await admin
      .from(table)
      .update({ [column]: null })
      .eq(column, user.id);

    if (error) {
      console.error(`Could not anonymize ${table} before account deletion:`, error);
      return {
        error: "Your contributions could not be anonymized, so your account was not deleted. Please try again later.",
      };
    }
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error("Could not delete account:", deleteError);
    return { error: "Your account could not be deleted. Please try again later." };
  }

  const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
  if (signOutError) {
    console.error("Account was deleted, but the local session could not be cleared:", signOutError);
  }

  revalidatePath("/", "layout");
  redirect("/login?accountDeleted=true");
}
