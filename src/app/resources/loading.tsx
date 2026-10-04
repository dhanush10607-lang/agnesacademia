import { ResourceCardSkeleton } from "@/components/ui/Skeletons";

export default function ResourcesLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8" role="status">
      <span className="sr-only">Loading resources</span>
      <div className="mb-8 space-y-3">
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-4 w-80 max-w-full" />
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-64 shrink-0 space-y-4 lg:block">
          <div className="skeleton h-6 w-24" />
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-full" />
        </aside>
        <main className="min-w-0 flex-1 space-y-4">
          <div className="skeleton h-11 w-full" />
          {Array.from({ length: 5 }, (_, index) => (
            <ResourceCardSkeleton key={index} />
          ))}
        </main>
      </div>
    </div>
  );
}
