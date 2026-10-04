import { SearchResultSkeleton } from "@/components/ui/Skeletons";

export default function SearchLoading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row" role="status">
      <span className="sr-only">Loading search results</span>
      <aside className="w-full shrink-0 md:w-64">
        <div className="mb-4 space-y-4 rounded-xl border border-border bg-card p-4 md:hidden">
          <div className="skeleton h-5 w-36" />
          <div className="skeleton h-4 w-28" />
        </div>
        <div className="hidden space-y-4 rounded-xl border border-border bg-card p-5 md:block">
          <div className="skeleton h-6 w-28" />
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="space-y-2">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-10 w-full rounded-md" />
            </div>
          ))}
          <div className="skeleton h-10 w-full rounded-md" />
        </div>
      </aside>
      <main className="min-w-0 flex-1 space-y-5">
        <div className="skeleton h-12 w-full rounded-full" />
        <div className="space-y-2 border-b pb-4">
          <div className="skeleton h-6 w-64 max-w-full" />
          <div className="skeleton h-4 w-32" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, index) => (
            <SearchResultSkeleton key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
