import { SubjectCardSkeleton } from "@/components/ui/Skeletons";

export default function MySemesterLoading() {
  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-4 py-8" role="status">
      <span className="sr-only">Loading your subjects</span>
      <div className="space-y-3">
        <div className="skeleton h-5 w-36 rounded-full" />
        <div className="skeleton h-10 w-64 max-w-full" />
        <div className="skeleton h-6 w-48" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 6 }, (_, index) => (
          <SubjectCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
