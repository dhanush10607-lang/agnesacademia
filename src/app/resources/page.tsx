import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Search, Filter, Eye, FolderOpen, BookOpen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";

export default async function ResourcesSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const limit = 20; // Increased limit for combined results

  const supabase = await createClient();
  let results: any[] = [];
  let totalCount = 0;

  if (query) {
    const formattedQuery = query.split(' ').join(' | ');

    // 1. Search Notes (Resources)
    const { data: resData } = await supabase
      .from("resources")
      .select("id, title, description, created_at, category:resource_categories(name), subject:subjects(name)")
      .eq("status", "published")
      .textSearch('search_vector', formattedQuery)
      .limit(limit);

    // 2. Search Question Papers
    const { data: qpData } = await supabase
      .from("question_papers")
      .select("id, title, description, created_at, exam_type, subject:subjects(name)")
      .eq("status", "published")
      .textSearch('search_vector', formattedQuery)
      .limit(limit);

    // 3. Search Question Banks (by title/desc)
    const { data: qbData } = await supabase
      .from("question_banks")
      .select("id, title, description, created_at, subject:subjects(name)")
      .eq("status", "published")
      .ilike('title', `%${query}%`)
      .limit(limit);

    // 4. Search Questions directly (to find which bank they belong to)
    const { data: qData } = await supabase
      .from("questions")
      .select("id, question_text, created_at, unit:question_units(question_bank_id, question_banks(status))")
      .textSearch('search_vector', formattedQuery)
      .limit(limit);

    // 5. Search Syllabi
    const { data: sylData } = await supabase
      .from("syllabi")
      .select("id, course_objectives, created_at, subject:subjects(name)")
      .eq("status", "published")
      .textSearch('search_vector', formattedQuery)
      .limit(limit);

    // Normalize results
    if (resData) {
      results.push(...resData.map(r => ({
        ...r, 
        type: 'Note', 
        icon: FileText, 
        link: `/resources/${r.id}`,
        tags: [(r.category as any)?.name, (r.subject as any)?.name]
      })));
    }

    if (qpData) {
      results.push(...qpData.map(r => ({
        ...r, 
        type: 'Question Paper', 
        icon: FileText, 
        link: `/question-papers/${r.id}`,
        tags: [r.exam_type?.replace('_', ' '), (r.subject as any)?.name]
      })));
    }

    if (qbData) {
      results.push(...qbData.map(r => ({
        ...r, 
        type: 'Question Bank', 
        icon: FolderOpen, 
        link: `/question-banks/${r.id}`,
        tags: [(r.subject as any)?.name]
      })));
    }

    if (qData) {
      // Filter only published ones and map
      const validQs = qData.filter(q => (q.unit as any)?.question_banks?.status === 'published');
      results.push(...validQs.map(r => ({
        id: r.id,
        title: r.question_text.length > 60 ? r.question_text.substring(0, 60) + '...' : r.question_text,
        description: "Found in Question Bank",
        created_at: r.created_at,
        type: 'Question', 
        icon: FolderOpen, 
        link: `/question-banks/${(r.unit as any)?.question_bank_id}`,
        tags: []
      })));
    }

    if (sylData) {
      results.push(...sylData.map(r => ({
        ...r,
        title: `${(r.subject as any)?.name} Syllabus`,
        description: r.course_objectives,
        type: 'Syllabus', 
        icon: BookOpen, 
        link: `/syllabi/${r.id}`,
        tags: [(r.subject as any)?.name]
      })));
    }

    // Sort combined by created_at desc
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    totalCount = results.length;
    // Manual pagination for combined results
    results = results.slice((page - 1) * limit, page * limit);
  } else {
    // Default empty search state (fetch recent notes only)
    const { data, count } = await supabase
      .from("resources")
      .select("id, title, description, created_at, category:resource_categories(name), subject:subjects(name)", { count: 'exact' })
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
      
    if (data) {
      results = data.map(r => ({
        ...r, 
        type: 'Note', 
        icon: FileText, 
        link: `/resources/${r.id}`,
        tags: [(r.category as any)?.name, (r.subject as any)?.name]
      }));
    }
    totalCount = count || 0;
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4">Browse Resources</h1>
        <p className="text-lg text-muted-foreground">Search across Notes, Question Papers, Question Banks, and Syllabi.</p>
      </div>

      <div className="bg-card p-4 rounded-xl border mb-8">
        <form className="flex flex-col sm:flex-row gap-4" action="/resources" method="GET">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              name="q"
              defaultValue={query}
              placeholder="Search across all academic materials..." 
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-8">Search</Button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </h3>
            <p className="text-sm text-muted-foreground italic">Advanced filtering by Subject and Category coming soon.</p>
          </div>
        </div>

        {/* Results */}
        <div className="flex-grow space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-xl">
              {query ? `Search Results for "${query}"` : "Latest Resources"}
            </h2>
            <span className="text-sm text-muted-foreground">{totalCount} items found</span>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((res, idx) => {
                const Icon = res.icon;
                return (
                  <div key={`${res.id}-${idx}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors bg-card">
                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg shrink-0 mt-1">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                            {res.type}
                          </Badge>
                          {res.tags.filter(Boolean).map((tag: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs capitalize">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h4 className="font-semibold text-lg line-clamp-1">{res.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{res.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>{format(new Date(res.created_at), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                    <Link 
                      href={res.link} 
                      className={buttonVariants({ variant: "secondary" })}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                <Search className="h-16 w-16 text-muted-foreground mb-6 opacity-40" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground max-w-md">We couldn't find any content matching your search. Try adjusting your keywords.</p>
                {query && (
                  <Link href="/resources" className={buttonVariants({ variant: "outline", className: "mt-6" })}>
                    Clear Search
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {page > 1 && (
                <Link href={`/resources?q=${query}&page=${page - 1}`} className={buttonVariants({ variant: "outline" })}>
                  Previous
                </Link>
              )}
              <span className="flex items-center px-4 text-sm font-medium border rounded-md bg-muted/50">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`/resources?q=${query}&page=${page + 1}`} className={buttonVariants({ variant: "outline" })}>
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
