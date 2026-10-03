import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ResourceReportsContent, loadResourceReports } from "@/components/reports/ResourceReportsContent";

export default async function ModerationReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["moderator", "administrator"].includes(profile.role)) {
    redirect("/");
  }

  const { status: requestedStatus } = await searchParams;
  const status = ["pending", "resolved", "dismissed", "all"].includes(requestedStatus ?? "")
    ? requestedStatus!
    : "pending";
  const { reports, items, error } = await loadResourceReports(supabase, status);

  return (
    <div className="container mx-auto max-w-6xl space-y-4 px-4 py-8">
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          Reports could not be loaded. Please refresh the page and try again.
        </p>
      ) : (
        <ResourceReportsContent reports={reports ?? []} items={items} status={status} />
      )}
    </div>
  );
}
