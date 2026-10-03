import { createClient } from "@/lib/supabase/server";
import { Building2, GraduationCap, BookOpen, Layers } from "lucide-react";

export async function StatsSection() {
  const supabase = await createClient();

  // Fetch exact counts with minimal payload
  const [
    { count: deptCount },
    { count: progCount },
    { count: subjCount },
    { count: resCount }
  ] = await Promise.all([
    supabase.from('departments').select('*', { count: 'exact', head: true }),
    supabase.from('programmes').select('*', { count: 'exact', head: true }),
    supabase.from('subjects').select('*', { count: 'exact', head: true }),
    supabase.from('academic_resources').select('*', { count: 'exact', head: true }).eq('status', 'approved')
  ]);

  const stats = [
    { label: "Departments", value: deptCount || 0, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Programmes", value: progCount || 0, icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Subjects", value: subjCount || 0, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Resources", value: resCount || 0, icon: Layers, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <section className="relative border-b border-border/50 bg-background py-8 sm:py-12 md:py-20">
      <div className="absolute inset-0 bg-muted/20 pointer-events-none" />
      <div className="container px-4 md:px-8 mx-auto relative z-10">
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center rounded-2xl border border-border/60 bg-card p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-3xl sm:p-6"
            >
              <div className={`mb-3 rounded-xl p-3 sm:mb-4 sm:rounded-2xl sm:p-4 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
              </div>
              <span className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-1 tracking-tight">
                {stat.value}
                <span className="text-primary/70 ml-1">+</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs md:text-sm md:tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
