import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bell, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

export default async function NotificationSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch actual preferences if they exist in DB (using mock logic for UI building phase)
  const notifications = [
    { id: "notices", label: "Important Notices", description: "Receive alerts for critical college announcements.", default: true },
    { id: "exams", label: "Examination Updates", description: "Get notified about time tables and exam changes.", default: true },
    { id: "assignments", label: "Assignment Deadlines", description: "Reminders for upcoming assignments and submissions.", default: true },
    { id: "resources", label: "New Resources", description: "When new study materials are uploaded for your subjects.", default: false },
    { id: "events", label: "Events & Activities", description: "Updates about college events, seminars, and workshops.", default: false },
  ];

  return (
    <div className="container px-4 py-8 mx-auto max-w-2xl space-y-6 pb-24 md:pb-8">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Profile
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-extrabold text-foreground flex items-center">
          <Bell className="w-8 h-8 mr-3 text-yellow-500" /> Notifications
        </h1>
        <p className="text-muted-foreground mt-2">
          Control what updates you receive from the platform.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>In-App Alerts</CardTitle>
          <CardDescription>Choose which notifications appear in your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6">
            <div className="space-y-4">
              {notifications.map((item) => (
                <div key={item.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-card">
                  <Checkbox id={item.id} name={item.id} defaultChecked={item.default} />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor={item.id} className="font-semibold">{item.label}</Label>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button type="button" className="w-full md:w-auto">
              Save Preferences
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
