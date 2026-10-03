import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SubjectTypesPage() {
  const supabase = await createClient();

  const { data: subjectTypes } = await supabase
    .from("subject_types")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-primary" /> Subject Types
          </h1>
          <p className="text-muted-foreground mt-1">Manage the categories of subjects (e.g., Core, Elective, Language).</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Types</CardTitle>
          <CardDescription>These classifications are used to build curriculum rules.</CardDescription>
        </CardHeader>
        <CardContent>
          {subjectTypes && subjectTypes.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-sm border-b bg-muted/50 text-muted-foreground">
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Code</div>
                <div className="col-span-4">Description</div>
                <div className="col-span-2 text-right">Order</div>
              </div>
              <div className="divide-y">
                {subjectTypes.map((type) => (
                  <div key={type.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm hover:bg-muted/30 transition-colors">
                    <div className="col-span-3 font-medium flex items-center gap-2">
                      {type.name}
                      {!type.is_active && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                    </div>
                    <div className="col-span-3 font-mono text-xs">
                      <Badge variant="outline">{type.code}</Badge>
                    </div>
                    <div className="col-span-4 text-muted-foreground">
                      {type.description || <span className="italic opacity-50">No description</span>}
                    </div>
                    <div className="col-span-2 text-right font-mono">
                      {type.display_order}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center border-2 border-dashed rounded-xl">
              <Search className="w-8 h-8 mx-auto text-muted-foreground opacity-40 mb-3" />
              <p className="text-muted-foreground">No subject types found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
