import { ResourceListItemSkeleton } from "@/components/ui/Skeletons";

export default function ResourcesLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8" role="status">
      <span className="sr-only">Loading resources</span>
      <div className="mb-8 space-y-3">
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-4 w-80 max-w-full" />
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="mb-4 space-y-4 rounded-xl border border-border bg-card p-4 lg:hidden">
            <div className="skeleton h-5 w-24" />
            <div className="skeleton h-4 w-32" />
          </div>
          <div className="hidden space-y-4 rounded-xl border border-border bg-card p-5 lg:block">
            <div className="skeleton h-6 w-24" />
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-10 w-full rounded-md" />
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-10 w-full rounded-md" />
          </div>
        </aside>
        <main className="min-w-0 flex-1 space-y-4">
          <div className="flex items-center justify-between py-1">
            <div className="skeleton h-6 w-36" />
            <div className="skeleton h-4 w-20" />
          </div>
          {Array.from({ length: 5 }, (_, index) => (
            <ResourceListItemSkeleton key={index} />
          ))}
        </main>
      </div>
    </div>
  );
}
