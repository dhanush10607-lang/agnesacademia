import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminResourceReportsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2">Resource Reports</h1>
        <p className="text-muted-foreground">Manage user reports for resources.</p>
      </div>
      <Card><CardContent className="p-6">Feature coming soon.</CardContent></Card>
    </div>
  );
}
