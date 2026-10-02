import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {/* Animated logo */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/15 rounded-full animate-ping [animation-duration:1.5s]" />
        <div className="relative bg-background rounded-full p-4 border border-border shadow-md">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Skeleton bars */}
      <div className="w-full max-w-sm space-y-2.5 px-4">
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-4/5 rounded-full" />
        <div className="skeleton h-3 w-3/5 rounded-full" />
      </div>

      <p className="text-xs font-medium text-muted-foreground tracking-wide">
        Loading AGNES ACADEMIA…
      </p>
    </div>
  );
}
