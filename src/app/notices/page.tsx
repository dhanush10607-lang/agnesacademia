import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Bell, Calendar as CalendarIcon, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch user profile to get their specific targeting data
  const { data: profile } = await supabase
    .from("profiles")
    .select("department_id, programme_id, semester_id")
    .eq("id", user.id)
    .single();

  // Fetch categories for filter
  const { data: categories } = await supabase.from("notice_categories").select("*").order("name");

  // Fetch notices (Ideally we'd filter strictly via RLS or complex OR queries, 
  // but for MVP we fetch all published and sort/highlight by relevance)
  let query = supabase
    .from("notices")
    .select(`
      *,
      category:notice_categories(name),
      department:departments(name),
      programme:programmes(name),
      semester:semesters(name)
    `)
    .eq("status", 'published')
    .order("created_at", { ascending: false });

  if (category) {
    const catObj = categories?.find(c => c.name === category);
    if (catObj) {
      query = query.eq("category_id", catObj.id);
    }
  }

  const { data: notices } = await query;

  // Simple relevance scoring for UI:
  // 1 if it matches user's specific group, 0 if it's general (null target), -1 if it targets a DIFFERENT group
  const scoreNotice = (n: any) => {
    let score = 0;
    let isTargeted = false;

    if (n.department_id) {
      if (profile?.department_id === n.department_id) score += 1;
      else score -= 1;
      isTargeted = true;
    }
    if (n.programme_id) {
      if (profile?.programme_id === n.programme_id) score += 1;
      else score -= 1;
      isTargeted = true;
    }
    if (n.semester_id) {
      if (profile?.semester_id === n.semester_id) score += 1;
      else score -= 1;
      isTargeted = true;
    }

    if (!isTargeted) return 1; // General notices are highly relevant
    return score;
  };

  // Sort: High score first, then urgent/important, then date
  const sortedNotices = notices?.sort((a, b) => {
    const scoreA = scoreNotice(a);
    const scoreB = scoreNotice(b);
    if (scoreA !== scoreB) return scoreB - scoreA;
    
    const prioWeight = (p: string) => p === 'urgent' ? 2 : p === 'important' ? 1 : 0;
    const prioA = prioWeight(a.priority);
    const prioB = prioWeight(b.priority);
    
    if (prioA !== prioB) return prioB - prioA;
    
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }) || [];

  // Filter out notices that explicitly target entirely different groups to keep the board clean
  const relevantNotices = sortedNotices.filter(n => scoreNotice(n) >= 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-5xl flex-grow">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b pb-6">
          <div>
            <h1 className="text-4xl font-heading font-extrabold flex items-center mb-2">
              <Bell className="w-8 h-8 mr-3 text-primary" /> Notice Board
            </h1>
            <p className="text-lg text-muted-foreground">
              Official announcements, deadlines, and updates relevant to you.
            </p>
          </div>
          
          {/* Simple Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide">
            <Link href="/notices" className={buttonVariants({ variant: category ? "outline" : "default", size: "sm" })}>
              All
            </Link>
            {categories?.filter(c => ['Academic', 'Examination', 'Event', 'General'].includes(c.name)).map(c => (
              <Link 
                key={c.id} 
                href={`/notices?category=${c.name}`} 
                className={buttonVariants({ variant: category === c.name ? "default" : "outline", size: "sm" })}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {relevantNotices.length > 0 ? (
            relevantNotices.map((notice) => (
              <Link key={notice.id} href={`/notices/${notice.id}`} className="block group">
                <Card className={`border-border shadow-sm transition-all hover:shadow-md ${notice.priority === 'urgent' ? 'border-l-4 border-l-red-500' : notice.priority === 'important' ? 'border-l-4 border-l-yellow-500' : ''}`}>
                  <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted">
                          {(notice.category as any)?.name}
                        </Badge>
                        {notice.priority === 'urgent' && <Badge className="bg-red-500 hover:bg-red-600">Urgent</Badge>}
                        {notice.priority === 'important' && <Badge className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950">Important</Badge>}
                        
                        {/* Target Badges */}
                        {notice.department_id && <Badge variant="outline">{(notice.department as any)?.name}</Badge>}
                        {notice.programme_id && <Badge variant="outline">{(notice.programme as any)?.name}</Badge>}
                        {notice.semester_id && <Badge variant="outline">{(notice.semester as any)?.name}</Badge>}
                        {(!notice.department_id && !notice.programme_id && !notice.semester_id && !notice.subject_id) && (
                          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Global Notice</Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {notice.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Published {formatDistanceToNow(new Date(notice.created_at), { addSuffix: true })}
                        {notice.expiry_date && (
                          <>
                            <span className="mx-2">•</span>
                            Valid until {format(new Date(notice.expiry_date), "MMM d, yyyy")}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="shrink-0 hidden sm:flex items-center text-muted-foreground group-hover:text-primary transition-colors">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 border border-dashed rounded-xl bg-muted/10">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No notices found</h3>
              <p className="text-muted-foreground">There are currently no active notices for your academic group.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
