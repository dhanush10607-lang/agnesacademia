import { StatsSkeleton, SubjectCardSkeleton } from "@/components/ui/Skeletons";

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
        <div className="skeleton h-6 w-40" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <SubjectCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
