import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NotificationsList from "./NotificationsList";
import { Bell } from "lucide-react";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="container px-4 py-8 mx-auto max-w-3xl space-y-6 pb-24 md:pb-8">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-foreground flex items-center">
          <Bell className="w-8 h-8 mr-3 text-primary" /> Notifications
        </h1>
        <p className="text-muted-foreground mt-2">
          Your recent updates and alerts.
        </p>
      </div>

      <NotificationsList initialNotifications={notifications || []} />
    </div>
  );
}
