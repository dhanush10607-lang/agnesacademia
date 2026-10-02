import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, KeyRound, MonitorSmartphone } from "lucide-react";
import Link from "next/link";
import { updatePasswordAction } from "@/app/actions/security";

export default async function SecurityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Determine if it's a social login (they don't have passwords)
  const isSocialLogin = user.app_metadata?.providers && !user.app_metadata.providers.includes("email");

  return (
    <div className="container px-4 py-8 mx-auto max-w-2xl space-y-6 pb-24 md:pb-8">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Profile
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-extrabold text-foreground flex items-center">
          <Shield className="w-8 h-8 mr-3 text-red-500" /> Security
        </h1>
        <p className="text-muted-foreground mt-2">
          Keep your account secure and manage your sessions.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="flex items-center">
            <KeyRound className="w-5 h-5 mr-2 text-muted-foreground" /> Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account safe.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isSocialLogin ? (
            <div className="p-4 bg-muted text-muted-foreground rounded-lg text-sm text-center">
              You are signed in using a third-party provider (e.g., Google). Password management is handled by your provider.
            </div>
          ) : (
            <form action={async (formData) => {
              "use server";
              await updatePasswordAction(formData);
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input id="current_password" name="current_password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input id="new_password" name="new_password" type="password" required />
                <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input id="confirm_password" name="confirm_password" type="password" required />
              </div>
              <Button type="submit" className="w-full">Update Password</Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="flex items-center">
            <MonitorSmartphone className="w-5 h-5 mr-2 text-muted-foreground" /> Active Sessions
          </CardTitle>
          <CardDescription>Devices where you are currently logged in.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-4 bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg">
            <div>
              <p className="font-semibold text-sm">Current Session</p>
              <p className="text-xs text-muted-foreground mt-0.5">Active now • {user.email}</p>
            </div>
            <div className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 px-2 py-1 rounded text-xs font-bold uppercase">
              Active
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t text-sm text-center">
            <form action={async () => {
              "use server";
              // Implement sign out all sessions if supported by Supabase auth admin
            }}>
              <Button type="button" variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                Sign Out of All Other Devices
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
