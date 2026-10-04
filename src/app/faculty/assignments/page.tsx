import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { FileEdit, Calendar, CheckCircle, ChevronLeft, Edit, Clock, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatDistanceToNow, format } from "@/lib/date-time";

export default async function FacultyAssignmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== 'faculty') redirect("/dashboard");

  const { data: assignments } = await supabase
    .from("assignments")
    .select(`
      *,
      subject:subjects(name)
    `)
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <Link href="/faculty" className={buttonVariants({ variant: "ghost", className: "mb-6" })}>
        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4 flex items-center">
            <ClipboardList className="w-8 h-8 mr-3 text-primary" /> Manage Assignments
          </h1>
          <p className="text-lg text-muted-foreground">
            View and manage assignments distributed to your students.
          </p>
        </div>
        <Link href="/faculty/assignments/new" className={buttonVariants()}>
          <FileEdit className="w-4 h-4 mr-2" /> Create New
        </Link>
      </div>

      <div className="grid gap-4 mt-8">
        {assignments && assignments.length > 0 ? (
          assignments.map((assignment) => (
            <Card key={assignment.id} className="border-border shadow-sm">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold truncate">
                        {assignment.title}
                      </h3>
                      <Badge variant={assignment.status === 'published' ? 'default' : 'outline'} className="capitalize">
                        {assignment.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-medium">{(assignment.subject as any)?.name}</span>
                      {assignment.due_date && (
                        <span className="flex items-center text-orange-600 dark:text-orange-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          Due: {format(new Date(assignment.due_date), "MMM d, yyyy h:mm a 'IST'")}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Posted {formatDistanceToNow(new Date(assignment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  {/* Implementation of edit later */}
                  <Button variant="outline" size="sm" disabled>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <ClipboardList className="h-16 w-16 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-xl font-semibold mb-2">No assignments found</h3>
              <p className="text-muted-foreground max-w-md">
                You haven't created any assignments yet.
              </p>
              <Link href="/faculty/assignments/new" className={buttonVariants({ className: "mt-6" })}>
                Create an Assignment
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
