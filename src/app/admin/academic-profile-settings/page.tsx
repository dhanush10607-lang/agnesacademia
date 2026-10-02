import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Users, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function GlobalAcademicSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!adminProfile || adminProfile.role !== 'administrator') {
    redirect("/dashboard");
  }

  // Fetch global setting
  const { data: globalLockSetting } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "global_academic_profile_lock")
    .single();

  const isGloballyLocked = globalLockSetting?.value === "true" || globalLockSetting?.value === true;

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl space-y-6">
      <Link href="/admin/users" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to User Management
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-extrabold flex items-center">
          <ShieldAlert className="w-8 h-8 mr-3 text-red-500" /> Academic Profile Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Control global policies for student academic profiles.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Global Academic Profile Lock</CardTitle>
          <CardDescription>
            When enabled, all student academic profiles (Programme, Year, Semester, Subjects) will be locked platform-wide. Students will not be able to modify their academic information unless an administrator explicitly unlocks their individual profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-lg bg-card">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-semibold text-lg flex items-center justify-center sm:justify-start gap-2">
                Status: {isGloballyLocked ? (
                  <span className="text-amber-600 flex items-center"><Lock className="w-4 h-4 mr-1"/> Locked</span>
                ) : (
                  <span className="text-green-600 flex items-center"><Unlock className="w-4 h-4 mr-1"/> Editable</span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                Current platform policy for all students.
              </p>
            </div>
            
            <form action={async () => {
              "use server";
              const supabase = await createClient();
              const { data: { user } } = await supabase.auth.getUser();
              const newStatus = !isGloballyLocked;
              await supabase.from("app_settings").upsert({
                key: "global_academic_profile_lock",
                value: newStatus ? "true" : "false",
                updated_by: user?.id,
                updated_at: new Date().toISOString()
              });
              
              const { revalidatePath } = require("next/cache");
              revalidatePath("/profile/academic");
              revalidatePath("/profile/academic/edit");
              revalidatePath("/admin/academic-profile-settings");
            }}>
              <Button 
                type="submit" 
                variant={isGloballyLocked ? "outline" : "default"}
                className={isGloballyLocked ? "border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30" : ""}
              >
                {isGloballyLocked ? "Unlock All Profiles" : "Lock All Profiles"}
              </Button>
            </form>
          </div>
          
          <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">How this works:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Locking globally affects all student accounts immediately.</li>
              <li>You can still override the lock for an individual student in the <Link href="/admin/users" className="text-primary hover:underline">User Management</Link> dashboard.</li>
              <li>Students will see a banner on their profile indicating their information is managed by the college.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
