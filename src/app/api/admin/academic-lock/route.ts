import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if current user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "administrator" && profile.role !== "faculty")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { userId, lockStatus } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ 
        is_academic_locked: lockStatus,
        academic_locked_at: lockStatus ? new Date().toISOString() : null,
        academic_locked_by: lockStatus ? user.id : null
      })
      .eq("id", userId);

    if (error) {
      console.error("Lock toggle error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Optional: Log action
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: lockStatus ? "academic_profile_locked" : "academic_profile_unlocked",
      item_type: "user",
      item_id: userId,
      details: `Academic profile ${lockStatus ? 'locked' : 'unlocked'} for user ${userId}`
    });

    return NextResponse.json({ success: true, is_academic_locked: lockStatus });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
