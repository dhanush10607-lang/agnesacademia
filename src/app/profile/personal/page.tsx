import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PersonalInfoForm } from "./PersonalInfoForm";

export default async function PersonalInfoPage() {
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

  if (!profile) {
    redirect("/onboarding");
  }

  // Determine what is editable. Name and Email are typically managed by the college/auth provider.
  const isNameManaged = profile.role === 'student' && profile.is_academic_locked;

  return (
    <div className="container px-4 py-8 mx-auto max-w-2xl space-y-6 pb-24 md:pb-8">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Profile
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-extrabold text-foreground flex items-center">
          <User className="w-8 h-8 mr-3 text-blue-500" /> Personal Information
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your contact details and public profile information.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>Update your personal information below.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <PersonalInfoForm profile={{...profile, email: profile.email || user.email}} isNameManaged={isNameManaged} />
        </CardContent>
      </Card>
    </div>
  );
}
