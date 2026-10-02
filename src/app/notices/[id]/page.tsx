import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Bell, Calendar, ChevronLeft, Paperclip, User, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch notice details
  const { data: notice, error } = await supabase
    .from("notices")
    .select(`
      *,
      category:notice_categories(name),
      department:departments(name),
      programme:programmes(name),
      semester:semesters(name),
      subject:subjects(name),
      author:profiles(full_name, role)
    `)
    .eq("id", id)
    .single();

  if (error || !notice) {
    notFound();
  }

  // We should ideally check if the user is authorized to view this specific targeted notice here.
  // For MVP, if they have the link and it's published, they can view it.

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        
        <Link href="/notices" className={buttonVariants({ variant: "ghost", className: "mb-6 -ml-4" })}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Notice Board
        </Link>
        
        <Card className={`border-border shadow-md overflow-hidden ${notice.priority === 'urgent' ? 'border-t-4 border-t-red-500' : notice.priority === 'important' ? 'border-t-4 border-t-yellow-500' : 'border-t-4 border-t-primary'}`}>
          <div className="p-6 md:p-8 border-b bg-muted/10">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {(notice.category as any)?.name}
              </Badge>
              {notice.priority === 'urgent' && <Badge className="bg-red-500">Urgent</Badge>}
              {notice.priority === 'important' && <Badge className="bg-yellow-500 text-yellow-950">Important</Badge>}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-6 leading-tight">
              {notice.title}
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Published: {format(new Date(notice.created_at), "MMMM d, yyyy")}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                By {(notice.author as any)?.full_name || 'Admin'}
              </div>
            </div>
          </div>

          {/* Targeting Info Bar */}
          {(notice.department_id || notice.programme_id || notice.semester_id) && (
            <div className="bg-muted/30 px-6 md:px-8 py-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground border-b">
              <span className="uppercase tracking-wider mr-2">Targets:</span>
              {notice.department_id && <span>{(notice.department as any)?.name}</span>}
              {notice.programme_id && <span>{(notice.programme as any)?.name}</span>}
              {notice.semester_id && <span>{(notice.semester as any)?.name}</span>}
              {notice.subject_id && <span>{(notice.subject as any)?.name}</span>}
            </div>
          )}

          <CardContent className="p-6 md:p-8">
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-8 whitespace-pre-wrap">
              {notice.content}
            </div>

            {notice.attachment_path && (
              <div className="mt-8 border-t pt-8">
                <h3 className="font-bold flex items-center mb-4">
                  <Paperclip className="w-5 h-5 mr-2" /> Attachments
                </h3>
                <a 
                  href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resources/${notice.attachment_path}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors max-w-md"
                >
                  <div className="p-2 bg-primary/10 text-primary rounded mr-4">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">Download Attachment</p>
                    <p className="text-xs text-muted-foreground">Click to view/download file</p>
                  </div>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
