import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function CurriculaAdminPage() {
  const supabase = await createClient();

  const { data: curricula } = await supabase
    .from("curricula")
    .select(`
      *,
      programme:programmes(name)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-primary" /> Curricula / Combinations
          </h1>
          <p className="text-muted-foreground mt-1">Manage degree subject combinations and selection rules.</p>
        </div>
        <Link href="/admin/academic/curricula/new">
          <Button><Plus className="w-4 h-4 mr-2" /> New Curriculum</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {curricula && curricula.length > 0 ? (
          curricula.map((curr) => (
            <Card key={curr.id} className="border-border hover:border-primary/50 transition-all flex flex-col h-full shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <Badge variant={curr.is_active ? 'default' : 'secondary'} className={curr.is_active ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                    {curr.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  {curr.academic_year && <Badge variant="outline">{curr.academic_year}</Badge>}
                </div>
                <CardTitle className="text-xl line-clamp-1" title={curr.name}>{curr.name}</CardTitle>
                <CardDescription className="line-clamp-1">{curr.code || 'No Code'}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3 mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Programme</span>
                    <span className="text-sm font-medium">{(curr.programme as any)?.name}</span>
                  </div>
                  {curr.description && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</span>
                      <span className="text-sm text-muted-foreground line-clamp-2">{curr.description}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-border mt-auto">
                  <Link href={`/admin/academic/curricula/${curr.id}/subjects`} className="flex-1">
                    <Button variant="outline" className="w-full">Manage Subjects</Button>
                  </Link>
                  <Link href={`/admin/academic/curricula/${curr.id}/edit`}>
                    <Button variant="ghost" size="icon"><ArrowRight className="w-4 h-4" /></Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-16 text-center border-2 border-dashed rounded-xl bg-muted/10">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-lg font-bold mb-1">No Curricula Found</h3>
            <p className="text-muted-foreground mb-4">Create your first subject combination to get started.</p>
            <Link href="/admin/academic/curricula/new">
              <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> New Curriculum</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
