import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { BookOpen, FileText, UploadCloud, FileEdit, Bell, User, Clock, CheckCircle, ClipboardList, BrainCircuit, Megaphone, CalendarDays } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function FacultyDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*, department:departments(name)")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return <div className="p-8 text-red-500">Error loading profile: {profileError.message}. Are you sure your user exists in the profiles table?</div>;
  }

  if (!profile || profile.role !== 'faculty') {
    console.error("Profile role is not faculty:", profile?.role);
    redirect("/dashboard"); // Redirect to student dashboard if not faculty
  }

  // Fetch assigned subjects
  const { data: facultySubjects } = await supabase
    .from("faculty_subjects")
    .select(`
      subject:subjects(
        id, name, code,
        semester:semesters(name),
        programme:programmes(name)
      )
    `)
    .eq("faculty_id", user.id);

  // Fetch recent uploads by this faculty
  const { data: recentUploads } = await supabase
    .from("resources")
    .select(`
      id, title, status, created_at,
      subject:subjects(name)
    `)
    .eq("uploader_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const pendingDrafts = recentUploads?.filter(r => r.status === 'draft') || [];
  
  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground mb-2 flex items-center">
            Faculty Portal
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Welcome back, {profile.full_name}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="bg-background capitalize">
              <User className="w-3 h-3 mr-1" /> Faculty
            </Badge>
            {(profile.department as any)?.name && (
              <Badge variant="secondary">{(profile.department as any).name}</Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/faculty/upload" className={buttonVariants({ variant: "default" })}>
            <UploadCloud className="w-4 h-4 mr-2" /> Upload Resource
          </Link>
          <Link href="/faculty/assignments/new" className={buttonVariants({ variant: "outline" })}>
            <ClipboardList className="w-4 h-4 mr-2" /> Create Assignment
          </Link>
          <Link href="/faculty/quizzes/new" className={buttonVariants({ variant: "outline" })}>
            <BrainCircuit className="w-4 h-4 mr-2" /> Create Quiz
          </Link>
          <Link href="/faculty/notices/new" className={buttonVariants({ variant: "outline" })}>
            <Megaphone className="w-4 h-4 mr-2" /> Publish Notice
          </Link>
          <Link href="/faculty/calendar/new" className={buttonVariants({ variant: "outline" })}>
            <CalendarDays className="w-4 h-4 mr-2" /> Schedule Event
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">My Subjects</p>
              <h3 className="text-2xl font-bold">{facultySubjects?.length || 0}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resources Published</p>
              <h3 className="text-2xl font-bold">{recentUploads?.filter(r => r.status === 'published').length || 0}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-xl">
              <FileEdit className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Drafts</p>
              <h3 className="text-2xl font-bold">{pendingDrafts.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" /> My Subjects
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {facultySubjects && facultySubjects.length > 0 ? (
                facultySubjects.map(({ subject }) => {
                  const s = subject as any;
                  return (
                    <Card key={s.id} className="border-border shadow-sm hover:border-primary/50 transition-colors">
                      <CardContent className="p-5">
                        <h3 className="font-bold text-lg mb-1 truncate" title={s.name}>{s.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{s.code}</p>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <span className="truncate">{s.programme?.name}</span>
                          <span>{s.semester?.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8 border border-dashed rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No subjects assigned yet.</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" /> Recent Uploads
              </h2>
              <Link href="/faculty/resources" className="text-sm font-medium text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentUploads && recentUploads.length > 0 ? (
                recentUploads.map((resource) => (
                  <Card key={resource.id} className="border-border shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded">
                          {resource.status === 'published' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-yellow-500" />}
                        </div>
                        <div>
                          <h4 className="font-bold line-clamp-1">{resource.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="capitalize">{resource.status.replace('_', ' ')}</span>
                            <span>•</span>
                            <span className="truncate">{(resource.subject as any)?.name}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/faculty/resources/${resource.id}/edit`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        Edit
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">You haven't uploaded any resources yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold flex items-center">
                <Bell className="w-5 h-5 mr-2 text-primary" /> Announcements
              </h2>
            </div>
            <Card className="border-border shadow-sm">
              <CardContent className="p-0">
                <div className="p-8 text-center bg-muted/10 border-dashed">
                  <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <h3 className="font-medium mb-1">No active announcements</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create announcements to notify students in your subjects.</p>
                  <Link href="/faculty/announcements/new" className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Create Announcement
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
