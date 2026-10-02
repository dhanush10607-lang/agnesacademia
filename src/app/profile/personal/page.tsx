import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { updatePersonalProfileAction } from "@/app/actions/profile";

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
  const isEmailManaged = true; // Email is tied to auth, shouldn't be changed here easily without Auth flow
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
          <form action={async (formData) => {
            "use server";
            await updatePersonalProfileAction(formData);
          }} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="full_name">Full Name</Label>
                {isNameManaged && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center bg-secondary/50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Managed by College
                  </span>
                )}
              </div>
              <Input 
                id="full_name" 
                name="full_name" 
                defaultValue={profile.full_name || ""} 
                readOnly={isNameManaged}
                className={isNameManaged ? "bg-muted cursor-not-allowed" : ""}
                required 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="email">Email Address</Label>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center bg-secondary/50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Authentication Email
                </span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  name="email" 
                  defaultValue={profile.email || ""} 
                  readOnly
                  className="pl-9 bg-muted cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number <span className="text-muted-foreground font-normal">(Optional)</span></Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  defaultValue={profile.phone || ""} 
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">Used for urgent academic alerts only.</p>
            </div>

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
