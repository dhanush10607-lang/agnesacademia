import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, FileText, ChevronRight, FolderOpen, PlaySquare } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { format } from "@/lib/date-time";

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const filter = typeof resolvedParams.filter === 'string' ? resolvedParams.filter : 'all';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let query = supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (filter !== 'all') {
    query = query.eq("item_type", filter);
  }

  const { data: bookmarks } = await query;

  const categories = [
    { id: 'all', label: 'All Bookmarks' },
    { id: 'note', label: 'Notes' },
    { id: 'question_paper', label: 'Question Papers' },
    { id: 'question_bank', label: 'Question Banks' },
    { id: 'question', label: 'Questions' },
    { id: 'video', label: 'Videos' },
    { id: 'other', label: 'Other' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'note':
      case 'question_paper':
      case 'syllabus':
        return <FileText className="w-5 h-5" />;
      case 'question_bank':
      case 'question':
        return <FolderOpen className="w-5 h-5" />;
      case 'video':
        return <PlaySquare className="w-5 h-5" />;
      default:
        return <Bookmark className="w-5 h-5" />;
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4 flex items-center">
          <Bookmark className="w-8 h-8 mr-3 text-primary" /> My Bookmarks
        </h1>
        <p className="text-lg text-muted-foreground">Save and organize your favorite study materials.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            href={cat.id === 'all' ? '/bookmarks' : `/bookmarks?filter=${cat.id}`}
            className={buttonVariants({ 
              variant: filter === cat.id ? "default" : "outline",
              size: "sm",
              className: "rounded-full"
            })}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {bookmarks && bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <Link key={bookmark.id} href={bookmark.url} className="group block">
              <Card className="border-border hover:border-primary/50 transition-colors shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="p-3 bg-muted rounded-xl text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                      {getIcon(bookmark.item_type)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                        {bookmark.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] uppercase font-normal bg-background">
                          {bookmark.item_type.replace('_', ' ')}
                        </Badge>
                        <span>•</span>
                        <span>Saved {format(new Date(bookmark.created_at), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 shrink-0">
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <Bookmark className="h-16 w-16 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-xl font-semibold mb-2">No bookmarks found</h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? "You haven't bookmarked anything yet. Explore resources and save them here!"
                  : `You don't have any bookmarked ${filter.replace('_', ' ')}s.`}
              </p>
              <Link href="/resources" className={buttonVariants({ variant: "outline", className: "mt-6" })}>
                Browse Resources
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
