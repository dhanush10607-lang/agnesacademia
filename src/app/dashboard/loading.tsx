import { DashboardSubjectSkeleton, StatsSkeleton } from "@/components/ui/Skeletons";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8" role="status">
      <span className="sr-only">Loading your dashboard</span>
      <div className="space-y-3">
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-4 w-72 max-w-full" />
      </div>
      <StatsSkeleton />
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-40" />
          <div className="skeleton h-4 w-16" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <DashboardSubjectSkeleton key={index} />
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <div className="skeleton h-6 w-44" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="skeleton h-5 w-40" />
                <div className="skeleton h-4 w-16" />
              </div>
              <div className="skeleton h-16 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
