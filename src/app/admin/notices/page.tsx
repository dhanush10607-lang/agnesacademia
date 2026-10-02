import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminNoticesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2">Notices</h1>
        <p className="text-muted-foreground">Manage all platform notices.</p>
      </div>
      <Card><CardContent className="p-6">Feature coming soon.</CardContent></Card>
    </div>
  );
}
