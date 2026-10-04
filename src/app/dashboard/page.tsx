import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, GraduationCap, Clock, Bookmark, Search, FileText, ChevronRight, CheckCircle, Calendar, Bell, Library, CalendarDays, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { PasskeySettings } from "@/components/auth/PasskeySettings";
import Link from "next/link";
import { format } from "@/lib/date-time";
import { getCurriculumSemesterSubjects, uniqueSubjects } from "@/lib/curriculumSubjects";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      programme:programmes(*),
      academic_year:academic_years(*),
      semester:semesters(*)
    `)
    .eq("id", user.id)
    .single();

  const role = profile?.role || "student";
  const fullName = profile?.full_name || user.email?.split('@')[0] || "User";

  // Fetch student subjects
  let subjects: any[] = [];
  
  // Try to fetch enrolled subjects first (New Multi-Major Model)
  const { data: enrolledData, error: enrolledError } = await supabase
    .from("student_subjects")
    .select("subject:subjects(id, name, code, description)")
    .eq("student_id", user.id)
    .eq("enrollment_status", "ENROLLED");
    
  if (enrolledData && enrolledData.length > 0) {
    const subjData = uniqueSubjects(
      enrolledData
        .map(e => e.subject)
    );
    for (const subj of subjData as any[]) {
      const { count } = await supabase
        .from("resources")
        .select("*", { count: 'exact', head: true })
        .eq("subject_id", subj.id)
        .eq("status", "published");
        
      subjects.push({ ...subj, resourceCount: count || 0 });
    }
  } else if (profile?.curriculum_id) {
    // Fetch from curriculum if no explicit enrollments exist
    const currData = await getCurriculumSemesterSubjects(
      supabase,
      profile.curriculum_id,
      profile.semester_id,
      profile.semester?.name
    );
    
    if (currData) {
      const currSubjects = uniqueSubjects(
        currData.map((cs: any) => cs.subject)
      );
      for (const subj of currSubjects) {

        const { count } = await supabase
          .from("resources")
          .select("*", { count: 'exact', head: true })
          .eq("subject_id", subj.id)
          .eq("status", "published");
          
        subjects.push({ ...subj, resourceCount: count || 0 });
      }
    }
  }

  // Fetch recently viewed
  const { data: recentlyViewed } = await supabase
    .from("recently_viewed")
    .select("*")
    .eq("user_id", user.id)
    .order("viewed_at", { ascending: false })
    .limit(5);

  // Fetch bookmark count
  const { count: bookmarkCount } = await supabase
    .from("bookmarks")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id);

  // Phase 10: Fetch Latest Notices (Relevance filtered)
  const { data: rawNotices } = await supabase
    .from("notices")
    .select("id, title, priority, created_at, department_id, programme_id, semester_id, category:notice_categories(name)")
    .eq("status", 'published')
    .order("created_at", { ascending: false })
    .limit(10);
    
  const notices = rawNotices?.filter(n => {
    if (n.department_id && profile?.department_id !== n.department_id) return false;
    if (n.programme_id && profile?.programme_id !== n.programme_id) return false;
    if (n.semester_id && profile?.semester_id !== n.semester_id) return false;
    return true;
  }).slice(0, 3) || [];

  // Phase 10: Fetch Upcoming Events
  const now = new Date().toISOString();
  const { data: rawEvents } = await supabase
    .from("calendar_events")
    .select("id, title, start_time, category, department_id, programme_id, semester_id")
    .in("status", ['published'])
    .gte("end_time", now)
    .order("start_time", { ascending: true })
    .limit(10);

  const events = rawEvents?.filter(e => {
    if (e.department_id && profile?.department_id !== e.department_id) return false;
    if (e.programme_id && profile?.programme_id !== e.programme_id) return false;
    if (e.semester_id && profile?.semester_id !== e.semester_id) return false;
    return true;
  }).slice(0, 3) || [];

  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Good morning, {fullName} 👋</h1>
          {role === 'student' && profile?.programme && profile?.semester ? (
            <p className="text-muted-foreground mt-2 font-medium">
              {subjects.length > 0 ? `Your ${profile.semester.name} • ${subjects.length} Subjects` : `${profile.programme.name} • ${profile.academic_year?.name} • ${profile.semester.name}`}
            </p>
          ) : (
            <p className="text-muted-foreground mt-1">Here is your academic overview.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {role === 'student' && (
            <>
              <Link href="/upload" className={buttonVariants({ variant: "default" })}>
                <FileText className="w-4 h-4 mr-2" /> Upload Note
              </Link>
              <Link href="/my-submissions" className={buttonVariants({ variant: "outline" })}>
                <BookOpen className="w-4 h-4 mr-2" /> My Submissions
              </Link>
              {profile?.semester_id && (
                <Link href="/my-semester" className={buttonVariants({ variant: "outline" })}>
                  <Library className="w-4 h-4 mr-2" /> My Semester
                </Link>
              )}
            </>
          )}
          <Badge variant="outline" className="text-sm px-3 py-1 capitalize border-primary text-primary bg-primary/5 h-10 flex items-center">
            {role}
          </Badge>
        </div>
      </div>

      {/* Global Quick Search */}
      <div className="bg-card p-4 rounded-xl border mb-8 shadow-sm">
        <form className="flex flex-col sm:flex-row gap-4" action="/resources" method="GET">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              name="q"
              placeholder="Search your subjects, notes, papers and resources..." 
              className="pl-10 h-12 text-base border-muted-foreground/20"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-8">Search</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {role === "student" && (
            <>
              {/* FTUE Banner: show when student skipped personalization */}
              {!profile?.programme_id && (
                <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
                  <div className="p-3 rounded-2xl bg-primary/10 shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-foreground">Personalize your academic space</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Tell us your programme and semester so we can show you relevant subjects, notes, and resources automatically.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                    <Link href="/onboarding" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                      <CheckCircle className="w-4 h-4" /> Choose My Programme
                    </Link>
                    <Link href="/departments" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border border-border bg-background rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                      Explore All Subjects
                    </Link>
                  </div>
                </div>
              )}

              {/* Progress Summary */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-primary mb-1">{recentlyViewed?.length || 0}</span>
                    <span className="text-sm font-medium text-muted-foreground">Resources Viewed</span>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-primary mb-1">{bookmarkCount || 0}</span>
                    <span className="text-sm font-medium text-muted-foreground">Bookmarks</span>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20 hidden md:flex">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-primary mb-1">0</span>
                    <span className="text-sm font-medium text-muted-foreground">Quiz Attempts</span>
                  </CardContent>
                </Card>
              </div>

              {/* My Subjects */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-heading font-bold flex items-center">
                    <Library className="h-5 w-5 mr-2" /> My Subjects
                  </h2>
                  <Link href="/my-semester" className="text-sm text-primary hover:underline font-medium">
                    View all
                  </Link>
                </div>
                {subjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map((subj, idx) => (
                      <Card key={subj.id} className="border-border hover:border-primary/50 transition-colors shadow-sm">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-lg line-clamp-1 flex items-start justify-between">
                            <span className="mr-2">{subj.name}</span>
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">0{idx + 1}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="secondary" className="text-xs font-normal">
                              {subj.resourceCount} Resources
                            </Badge>
                            <Link
                              href={`/subjects/${subj.id}`}
                              className={buttonVariants({ variant: "ghost", size: "sm", className: "h-8 px-2 text-primary" })}
                            >
                              Open <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : profile?.semester_id ? (
                  <Card className="border-dashed bg-muted/20">
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center gap-3">
                      <BookOpen className="h-8 w-8 text-muted-foreground opacity-40" />
                      <div>
                        <p className="font-semibold text-foreground">No subjects found for your semester</p>
                        <p className="text-sm text-muted-foreground mt-1">Subjects haven't been added yet. Check back soon or contact your administrator.</p>
                      </div>
                      <Link href="/search" className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                        <Search className="w-4 h-4" /> Search Resources Instead
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-dashed bg-muted/20">
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center gap-3">
                      <GraduationCap className="h-8 w-8 text-muted-foreground opacity-40" />
                      <div>
                        <p className="font-semibold text-foreground">Your academic profile isn't set up yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Complete your profile to see your subjects here automatically.</p>
                      </div>
                      <Link href="/onboarding" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                        Set Up My Profile
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}


          {/* Upcoming Academic Content (Phase 10) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold flex items-center">
                  <Megaphone className="h-5 w-5 mr-2" /> Latest Notices
                </h2>
                <Link href="/notices" className="text-sm text-primary hover:underline font-medium">View all</Link>
              </div>
              <div className="space-y-3">
                {notices.length > 0 ? (
                  notices.map(notice => (
                    <Link key={notice.id} href={`/notices/${notice.id}`} className="block group">
                      <Card className={`border-border transition-colors hover:border-primary/50 ${notice.priority === 'urgent' ? 'border-l-4 border-l-red-500' : notice.priority === 'important' ? 'border-l-4 border-l-yellow-500' : ''}`}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-1">
                            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-muted">{(notice.category as any)?.name}</Badge>
                            <span className="text-[10px] text-muted-foreground">{format(new Date(notice.created_at), "MMM d")}</span>
                          </div>
                          <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{notice.title}</h4>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card className="border-dashed bg-muted/20">
                    <CardContent className="flex flex-col items-center justify-center py-6 text-center h-full">
                      <Bell className="h-6 w-6 text-muted-foreground mb-2 opacity-40" />
                      <p className="text-xs font-medium text-muted-foreground">No recent notices</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2" /> Upcoming Events
                </h2>
                <Link href="/calendar" className="text-sm text-primary hover:underline font-medium">Full calendar</Link>
              </div>
              <div className="space-y-3">
                {events.length > 0 ? (
                  events.map(event => (
                    <Link key={event.id} href={`/calendar`} className="block group">
                      <Card className="border-border transition-colors hover:border-primary/50">
                        <CardContent className="p-0 flex h-[68px]">
                          <div className="w-12 bg-muted/30 flex flex-col items-center justify-center shrink-0 border-r text-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{format(new Date(event.start_time), "MMM")}</span>
                            <span className="text-lg font-black leading-none">{format(new Date(event.start_time), "dd")}</span>
                          </div>
                          <div className="p-3 flex flex-col justify-center overflow-hidden">
                            <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h4>
                            <span className="text-[10px] text-muted-foreground mt-0.5">{event.category}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card className="border-dashed bg-muted/20">
                    <CardContent className="flex flex-col items-center justify-center py-6 text-center h-full">
                      <CalendarDays className="h-6 w-6 text-muted-foreground mb-2 opacity-40" />
                      <p className="text-xs font-medium text-muted-foreground">Your schedule is clear</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
          
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          {/* Recently Viewed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold flex items-center">
                <Clock className="h-5 w-5 mr-2" /> Recently Viewed
              </h2>
            </div>
            
            {recentlyViewed && recentlyViewed.length > 0 ? (
              <div className="space-y-3">
                {recentlyViewed.map(item => (
                  <Link key={item.id} href={item.url} className="block group">
                    <Card className="border-border group-hover:border-primary/40 transition-colors shadow-sm">
                      <CardContent className="p-3 flex items-start gap-3">
                        <div className="p-2 bg-muted rounded-md shrink-0">
                          <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="capitalize">{item.item_type.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{format(new Date(item.viewed_at), "MMM d")}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="border-dashed bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-10 w-10 text-muted-foreground mb-4 opacity-40" />
                  <p className="text-muted-foreground text-sm">No recent activity found.</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold mb-4">Security Settings</h2>
            <PasskeySettings />
          </div>
        </div>
      </div>
    </div>
  );
}
