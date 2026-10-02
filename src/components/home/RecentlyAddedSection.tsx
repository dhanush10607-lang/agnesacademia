import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ScrollReveal, AnimateList, AnimateItem } from "@/lib/motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export async function RecentlyAddedSection() {
  const supabase = await createClient();

  const { data: resources } = await supabase
    .from("academic_resources")
    .select(`
      id, title, created_at,
      subject:subjects(name),
      category:resource_categories(name, slug)
    `)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(6);

  if (!resources || resources.length === 0) return null;

  const categoryColors: Record<string, string> = {
    notes:          "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    question_paper: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    question_bank:  "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    syllabus:       "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    default:        "bg-muted text-muted-foreground",
  };

  return (
    <section className="py-16 md:py-20 bg-background border-t border-border/50">
      <div className="container px-4 md:px-8 mx-auto">
        <ScrollReveal className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Just Added</p>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Recently Added</h2>
          </div>
          <Link href="/resources" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>

        <AnimateList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(r => {
            const slug = (r.category as any)?.slug ?? "default";
            const color = categoryColors[slug] ?? categoryColors.default;
            return (
              <AnimateItem key={r.id}>
                <Link href={`/resources/${r.id}`} className="group block bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:border-primary/30 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`text-[10px] px-2 py-0.5 h-5 font-semibold border-0 ${color}`}>
                      {(r.category as any)?.name ?? "Resource"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{format(new Date(r.created_at), "MMM d")}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {r.title}
                  </h3>
                  {(r.subject as any)?.name && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">{(r.subject as any).name}</p>
                  )}
                </Link>
              </AnimateItem>
            );
          })}
        </AnimateList>

        {/* AI CTA */}
        <ScrollReveal delay={0.2} className="mt-12">
          <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 shrink-0">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-lg text-foreground">Can't find what you need?</h3>
              <p className="text-muted-foreground text-sm mt-1">Ask AGNES — our AI academic assistant can answer questions, explain concepts, and find resources for you.</p>
            </div>
            <Link
              href="/ai"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shrink-0 inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Ask AGNES
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
