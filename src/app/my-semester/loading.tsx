import { SubjectListItemSkeleton } from "@/components/ui/Skeletons";

export default function MySemesterLoading() {
  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-4 py-8" role="status">
      <span className="sr-only">Loading your subjects</span>
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="skeleton h-6 w-36 rounded-full" />
          <div className="skeleton h-6 w-28 rounded-full" />
        </div>
        <div className="skeleton h-10 w-64 max-w-full" />
        <div className="skeleton h-6 w-48" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 6 }, (_, index) => (
          <SubjectListItemSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
