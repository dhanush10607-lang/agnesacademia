import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminQuizzesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2">Quizzes</h1>
        <p className="text-muted-foreground">Manage all platform quizzes.</p>
      </div>
      <Card><CardContent className="p-6">Feature coming soon.</CardContent></Card>
    </div>
  );
}
