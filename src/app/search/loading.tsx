import { ResourceCardSkeleton } from "@/components/ui/Skeletons";

export default function SearchLoading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row" role="status">
      <span className="sr-only">Loading search results</span>
      <aside className="hidden w-64 shrink-0 space-y-4 md:block">
        <div className="skeleton h-6 w-28" />
        <div className="skeleton h-10 w-full" />
        <div className="skeleton h-10 w-full" />
        <div className="skeleton h-10 w-full" />
      </aside>
      <main className="min-w-0 flex-1 space-y-5">
        <div className="skeleton h-12 w-full rounded-full" />
        <div className="space-y-2 border-b pb-4">
          <div className="skeleton h-6 w-64 max-w-full" />
          <div className="skeleton h-4 w-32" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, index) => (
            <ResourceCardSkeleton key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
