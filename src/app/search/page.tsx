import { createClient } from "@/lib/supabase/server";
import { Search, Filter, BookOpen, FileText, Database, Layers, Layout, Video, CheckCircle2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { format } from "@/lib/date-time";
import { GlobalSearchBar } from "@/components/search/GlobalSearchBar";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; sort?: string; department?: string; programme?: string; semester?: string }>;
}) {
  const searchParamsObj = await searchParams;
  const { q = "", type = "all", sort = "relevance" } = searchParamsObj;
  const supabase = await createClient();

  // If no query, we show "Popular Discovery"
  if (!q && type === "all") {
    // Discovery Mode
    const { data: popular } = await supabase
      .from("global_search")
      .select("*")
      .eq("status", "published")
      .order("view_count", { ascending: false })
      .limit(6);

    const { data: recent } = await supabase
      .from("global_search")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(6);

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-extrabold mb-4">Discover Academic Content</h1>
          <GlobalSearchBar className="max-w-2xl" />
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🔥 Trending Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popular?.map(item => <ResultCard key={item.id + item.item_type} item={item} />)}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">📚 Popular Subjects</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/search?q=Data+Structures" className="px-4 py-2 bg-primary/5 text-primary border border-primary/20 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              Data Structures
            </Link>
            <Link href="/search?q=Machine+Learning" className="px-4 py-2 bg-primary/5 text-primary border border-primary/20 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              Machine Learning
            </Link>
            <Link href="/search?q=Operating+Systems" className="px-4 py-2 bg-primary/5 text-primary border border-primary/20 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              Operating Systems
            </Link>
            <Link href="/search?q=Database+Management" className="px-4 py-2 bg-primary/5 text-primary border border-primary/20 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              Database Management
            </Link>
            <Link href="/search?q=Python+Programming" className="px-4 py-2 bg-primary/5 text-primary border border-primary/20 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              Python Programming
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">✨ Recently Added</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent?.map(item => <ResultCard key={item.id + item.item_type} item={item} />)}
          </div>
        </section>
      </div>
    );
  }

  const { data: departments } = await supabase.from("departments").select("id, name").eq("status", "active");
  const { data: programmes } = await supabase.from("programmes").select("id, name").eq("status", "active");
  const { data: semesters } = await supabase.from("semesters").select("id, name").eq("status", "active");

  const deptFilter = searchParamsObj.department || "all";
  const progFilter = searchParamsObj.programme || "all";
  const semFilter = searchParamsObj.semester || "all";

  // Active Search Mode
  let query = supabase
    .from("global_search")
    .select("*")
    .eq("status", "published");

  if (q) {
    const formattedQuery = q.split(' ').filter(Boolean).join(' | ');
    query = query.textSearch("search_vector", formattedQuery);
  }

  if (type !== "all") query = query.eq("item_type", type);
  if (deptFilter !== "all") query = query.eq("department_id", deptFilter);
  if (progFilter !== "all") query = query.eq("programme_id", progFilter);
  if (semFilter !== "all") query = query.eq("semester_id", semFilter);

  if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "most_viewed") {
    query = query.order("view_count", { ascending: false });
  } else if (sort === "most_downloaded") {
    query = query.order("download_count", { ascending: false });
  }
  // For 'relevance', Supabase textSearch automatically sorts by rank by default!

  const { data: results, error } = await query.limit(50);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <details className="group md:hidden mb-4 bg-card border border-border rounded-xl shadow-sm">
          <summary className="flex items-center justify-between p-4 font-bold text-lg cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2"><Filter className="w-5 h-5 text-primary" /> Filter Results</span>
            <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
          </summary>
          <div className="p-4 pt-0 border-t border-border mt-2">
            <FilterForm departments={departments} programmes={programmes} semesters={semesters} q={q} type={type} sort={sort} deptFilter={deptFilter} progFilter={progFilter} semFilter={semFilter} />
          </div>
        </details>

        <div className="hidden md:block sticky top-20 bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
          <FilterForm departments={departments} programmes={programmes} semesters={semesters} q={q} type={type} sort={sort} deptFilter={deptFilter} progFilter={progFilter} semFilter={semFilter} />
        </div>
      </aside>

      {/* Main Results Area */}
      <main className="flex-1">
        <div className="mb-8">
          <GlobalSearchBar initialQuery={q} hiddenInputs={{ type, sort }} />
        </div>

        <div className="mb-6 pb-4 border-b">
          <h2 className="text-xl font-bold">
            {q ? `Search results for "${q}"` : `${type !== 'all' ? type.replace('_', ' ') : 'All Resources'}`}
          </h2>
          <p className="text-muted-foreground text-sm">{results?.length || 0} result(s) found</p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-6">
            Error loading search results. {error.message}
          </div>
        )}

        <div className="space-y-4">
          {results && results.length > 0 ? (
            results.map((item, idx) => (
              <SearchResultRow key={item.id + idx.toString()} item={item} query={q} />
            ))
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p>Try adjusting your search query or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function getIconForType(type: string) {
  switch (type) {
    case 'resource': return <FileText className="w-5 h-5" />;
    case 'question_paper': return <Layers className="w-5 h-5" />;
    case 'question_bank': return <Database className="w-5 h-5" />;
    case 'syllabus': return <BookOpen className="w-5 h-5" />;
    case 'notice': return <Layout className="w-5 h-5" />;
    default: return <FileText className="w-5 h-5" />;
  }
}

function HighlightText({ text, query }: { text: string, query: string }) {
  if (!query || !text) return <>{text}</>;
  
  const terms = query.split(' ').filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (terms.length === 0) return <>{text}</>;

  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i} className="bg-primary/20 text-foreground font-semibold px-0.5 rounded">{part}</mark> : part
      )}
    </>
  );
}

function ResultCard({ item }: { item: any }) {
  const Icon = getIconForType(item.item_type);
  
  return (
    <Link href={`/resources/${item.id}`} className="block group">
      <div className="bg-card border border-border rounded-xl p-5 h-full transition-all hover:shadow-md hover:border-primary/50 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">{Icon}</div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.category_name}</span>
        </div>
        <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          {item.subject_name && <span className="text-sm font-medium text-primary/80">{item.subject_name}</span>}
          {item.author_role === 'faculty' && <span title="Verified Faculty"><CheckCircle2 className="w-4 h-4 text-blue-500" /></span>}
        </div>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
          {item.description || "No description provided."}
        </p>
        <div className="pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>{format(new Date(item.created_at), 'MMM d, yyyy')}</span>
          <span>{item.view_count || 0} views</span>
        </div>
      </div>
    </Link>
  );
}

function SearchResultRow({ item, query = "" }: { item: any, query?: string }) {
  const Icon = getIconForType(item.item_type);

  // Link resolution depending on item_type
  let href = `/resources/${item.id}`;
  if (item.item_type === 'notice') href = `/notices/${item.id}`;
  else if (item.item_type === 'question_paper') href = `/resources/question-papers/${item.id}`;
  else if (item.item_type === 'syllabus') href = `/resources/syllabi/${item.id}`;
  else if (item.item_type === 'question_bank') href = `/resources/question-banks/${item.id}`;

  return (
    <div className="group bg-card border border-border rounded-xl p-4 transition-all hover:shadow-sm hover:border-primary/50 flex flex-col sm:flex-row gap-4">
      <div className="hidden sm:flex h-12 w-12 flex-shrink-0 bg-primary/10 text-primary rounded-lg items-center justify-center">
        {Icon}
      </div>
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
          <Link href={href}>
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
              <HighlightText text={item.title} query={query} />
            </h3>
          </Link>
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground whitespace-nowrap self-start sm:self-auto">
            {item.category_name}
          </span>
        </div>
        {item.subject_name && <p className="text-sm font-medium text-primary/80 mb-2"><HighlightText text={item.subject_name} query={query} /></p>}
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3"><HighlightText text={item.description || ''} query={query} /></p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {item.author_name && (
            <span className="flex items-center gap-1">
              By: <span className="font-medium text-foreground">{item.author_name}</span>
              {item.author_role === 'faculty' && <span title="Verified Faculty"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /></span>}
            </span>
          )}
          <span>Posted: {format(new Date(item.created_at), 'MMM d, yyyy')}</span>
          <span className="flex items-center gap-1"><EyeIcon className="w-3 h-3" /> {item.view_count || 0}</span>
        </div>
      </div>
    </div>
  );
}

function EyeIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function FilterForm({ departments, programmes, semesters, q, type, sort, deptFilter, progFilter, semFilter }: any) {
  return (
    <form action="/search" method="GET" className="space-y-6">
      <input type="hidden" name="q" value={q} />
      
      <div className="space-y-3">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
            <input type="radio" name="type" value="all" defaultChecked={type === "all"} className="text-primary focus:ring-primary" /> 
            All
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
            <input type="radio" name="type" value="resource" defaultChecked={type === "resource"} className="text-primary focus:ring-primary" /> 
            Notes & Materials
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
            <input type="radio" name="type" value="question_paper" defaultChecked={type === "question_paper"} className="text-primary focus:ring-primary" /> 
            Question Papers
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
            <input type="radio" name="type" value="question_bank" defaultChecked={type === "question_bank"} className="text-primary focus:ring-primary" /> 
            Question Banks
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
            <input type="radio" name="type" value="syllabus" defaultChecked={type === "syllabus"} className="text-primary focus:ring-primary" /> 
            Syllabus
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
            <input type="radio" name="type" value="notice" defaultChecked={type === "notice"} className="text-primary focus:ring-primary" /> 
            Notices
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Department</h4>
        <select name="department" defaultValue={deptFilter} className="w-full p-2 rounded-md border bg-background text-sm">
          <option value="all">All Departments</option>
          {departments?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Programme</h4>
        <select name="programme" defaultValue={progFilter} className="w-full p-2 rounded-md border bg-background text-sm">
          <option value="all">All Programmes</option>
          {programmes?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Semester</h4>
        <select name="semester" defaultValue={semFilter} className="w-full p-2 rounded-md border bg-background text-sm">
          <option value="all">All Semesters</option>
          {semesters?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Sort By</h4>
        <select name="sort" defaultValue={sort} className="w-full p-2 rounded-md border bg-background text-sm">
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
          <option value="most_viewed">Most Viewed</option>
          <option value="most_downloaded">Most Downloaded</option>
        </select>
      </div>
      
      <button type="submit" className="w-full py-2 bg-primary/10 text-primary rounded-md font-medium hover:bg-primary/20 transition-colors">
        Apply Filters
      </button>
    </form>
  );
}
