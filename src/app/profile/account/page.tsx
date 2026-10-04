import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, AlertTriangle, LogOut } from "lucide-react";
import Link from "next/link";
import { format } from "@/lib/date-time";
import { logout } from "@/app/actions/auth";
import { DeleteAccountForm } from "./DeleteAccountForm";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="container px-4 py-8 mx-auto max-w-2xl space-y-6 pb-24 md:pb-8">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Profile
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-extrabold text-foreground flex items-center">
          <Settings className="w-8 h-8 mr-3 text-slate-500" /> Account Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account status and session.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Overview of your account lifecycle.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b">
              <dt className="text-muted-foreground">Account Status</dt>
              <dd className="font-semibold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">Active</dd>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <dt className="text-muted-foreground">Member Since</dt>
              <dd className="font-medium">{profile?.created_at ? format(new Date(profile.created_at), "MMMM d, yyyy") : 'Unknown'}</dd>
            </div>
            <div className="flex justify-between items-center py-2">
              <dt className="text-muted-foreground">Academic Profile</dt>
              <dd className="font-medium">{profile?.is_academic_locked ? 'Locked by Admin' : 'Editable'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 shadow-sm overflow-hidden">
        <CardHeader className="bg-destructive/10 border-b border-destructive/20">
          <CardTitle className="text-destructive flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" /> Danger Zone
          </CardTitle>
          <CardDescription>Destructive actions for your account.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-medium text-foreground">Sign Out</h4>
              <p className="text-sm text-muted-foreground">End your current session.</p>
            </div>
            <form action={logout}>
              <Button variant="outline" type="submit" className="shrink-0">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </form>
          </div>
          
          <div className="pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-medium text-foreground">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account and data.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Before deletion, your account information is archived for administrators. Shared contributions remain without your author attribution.
              </p>
            </div>
            <DeleteAccountForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
