import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, GraduationCap, BookOpen, Palette, 
  Accessibility, Bell, Shield, Settings, ChevronRight 
} from "lucide-react";
import Link from "next/link";
import { format } from "@/lib/date-time";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      department:departments(name),
      programme:programmes(name),
      curriculum:curricula(name),
      semester:semesters(name),
      academic_year:academic_years(name),
      academic_session:academic_sessions(name)
    `)
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  let menuItems = [
    {
      title: "Personal Information",
      description: "Manage your name, email, and contact details",
      icon: User,
      href: "/profile/personal",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/50"
    },
    {
      title: "Academic Information",
      description: "View department, programme, and semester",
      icon: GraduationCap,
      href: "/profile/academic",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/50",
      studentOnly: true
    },
    {
      title: "My Subjects",
      description: "Select and manage your enrolled subjects",
      icon: BookOpen,
      href: "/profile/subjects",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      studentOnly: true
    },
    {
      title: "Appearance",
      description: "Customize theme and display preferences",
      icon: Palette,
      href: "/profile/settings/appearance",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/50"
    },
    {
      title: "Notifications",
      description: "Manage how you receive updates and alerts",
      icon: Bell,
      href: "/profile/settings/notifications",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/50"
    },
    {
      title: "Security",
      description: "Update password and manage active sessions",
      icon: Shield,
      href: "/profile/security",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/50"
    },
    {
      title: "Account",
      description: "Account status and destructive actions",
      icon: Settings,
      href: "/profile/account",
      color: "text-slate-500",
      bgColor: "bg-slate-50 dark:bg-slate-900"
    }
  ];

  if (profile.role !== "student") {
    menuItems = menuItems.filter(item => !item.studentOnly);
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl space-y-8 pb-20 md:pb-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-card p-6 md:p-8 rounded-3xl border shadow-sm text-center md:text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent -z-10" />
        
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center shadow-lg overflow-hidden shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-primary" />
            )}
          </div>
          {profile.role && (
            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-1/4 capitalize px-3 py-1 shadow-sm border-2 border-background">
              {profile.role}
            </Badge>
          )}
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-foreground">{profile.full_name}</h1>
            <p className="text-muted-foreground">{profile.email}</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm font-medium flex-wrap">
            {profile.programme && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-foreground/80 bg-secondary/50 px-3 py-1.5 rounded-full">
                <GraduationCap className="w-4 h-4" />
                {profile.programme.name}
              </div>
            )}
            {profile.curriculum && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-foreground/80 bg-secondary/50 px-3 py-1.5 rounded-full">
                <BookOpen className="w-4 h-4" />
                {profile.curriculum.name}
              </div>
            )}
            {profile.semester && profile.academic_year && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-foreground/80 bg-secondary/50 px-3 py-1.5 rounded-full">
                <BookOpen className="w-4 h-4" />
                {profile.academic_year.name} &bull; {profile.semester.name}
                {profile.academic_session?.name ? ` • ${profile.academic_session.name}` : ""}
              </div>
            )}
          </div>
          
          <div className="pt-2">
            <Link 
              href="/profile/personal" 
              className="inline-flex items-center justify-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Edit Profile <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4 px-2">Settings & Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.href}>
              <Card className="group hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full border-border/60">
                <CardContent className="p-4 md:p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${item.bgColor} group-hover:scale-105 transition-transform`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
