/**
 * Skeleton loaders for AGNES ACADEMIA.
 * All use the .skeleton CSS class (shimmer animation from globals.css).
 * Shapes match the actual content they represent.
 */

function Sk({ className }: { className?: string }) {
  return <div className={`skeleton ${className ?? ""}`} aria-hidden="true" />;
}

// ─── Resource Card Skeleton ────────────────────────────────────────────
export function ResourceCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Sk className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2 pt-0.5">
          <Sk className="h-4 w-3/4" />
          <Sk className="h-3 w-1/2" />
        </div>
      </div>
      <Sk className="h-3 w-full" />
      <Sk className="h-3 w-5/6" />
      <div className="flex gap-2 pt-1">
        <Sk className="h-8 w-16 rounded-lg" />
        <Sk className="h-8 w-20 rounded-lg" />
        <Sk className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

export function ResourceListItemSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <Sk className="mt-1 h-12 w-12 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Sk className="h-5 w-20 rounded-full" />
            <Sk className="h-5 w-24 rounded-full" />
          </div>
          <Sk className="h-5 w-3/4" />
          <div className="space-y-2">
            <Sk className="h-3 w-full" />
            <Sk className="h-3 w-5/6" />
          </div>
          <Sk className="h-3 w-28" />
        </div>
      </div>
      <div className="flex shrink-0 gap-2 pl-16 sm:pl-0">
        <Sk className="h-10 w-24 rounded-lg" />
        <Sk className="h-10 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row">
      <Sk className="hidden h-12 w-12 shrink-0 rounded-lg sm:block" />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <Sk className="h-5 w-3/4" />
          <Sk className="h-6 w-20 shrink-0 rounded-full" />
        </div>
        <Sk className="h-4 w-40 max-w-full" />
        <div className="space-y-2">
          <Sk className="h-3 w-full" />
          <Sk className="h-3 w-4/5" />
        </div>
        <div className="flex gap-4">
          <Sk className="h-3 w-28" />
          <Sk className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function SubjectListItemSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex min-w-0 items-center gap-4 sm:gap-6">
        <Sk className="hidden h-12 w-12 shrink-0 rounded-full sm:block" />
        <div className="min-w-0 space-y-2">
          <Sk className="h-5 w-56 max-w-full" />
          <Sk className="h-3 w-28" />
        </div>
      </div>
      <Sk className="h-9 w-9 shrink-0 rounded-full" />
    </div>
  );
}

export function DashboardSubjectSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <Sk className="h-5 w-3/4" />
        <Sk className="h-6 w-8 rounded-md" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <Sk className="h-6 w-24 rounded-full" />
        <Sk className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Subject Card Skeleton ─────────────────────────────────────────────
export function SubjectCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
      <Sk className="h-5 w-2/3" />
      <Sk className="h-3 w-1/3" />
      <div className="flex gap-2 pt-1">
        <Sk className="h-6 w-20 rounded-full" />
        <Sk className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

// ─── Notice Card Skeleton ──────────────────────────────────────────────
export function NoticeCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-2">
      <div className="flex justify-between">
        <Sk className="h-4 w-16 rounded-full" />
        <Sk className="h-3 w-12" />
      </div>
      <Sk className="h-4 w-4/5" />
    </div>
  );
}

// ─── Dashboard Stats Skeleton ──────────────────────────────────────────
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center ${i === 2 ? "hidden md:flex" : ""}`}>
          <Sk className="h-8 w-14" />
          <Sk className="h-3 w-28 max-w-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Page Hero Skeleton ────────────────────────────────────────────────
export function HeroSkeleton() {
  return (
    <div className="py-20 flex flex-col items-center gap-6">
      <Sk className="h-6 w-40 rounded-full" />
      <Sk className="h-14 w-80 max-w-full" />
      <Sk className="h-5 w-64 max-w-full" />
      <Sk className="h-16 w-full max-w-2xl rounded-full" />
    </div>
  );
}

export function LandingPageSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading AGNES ACADEMIA home page</span>
      <section className="border-b border-border/50 bg-background py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="container mx-auto flex flex-col items-center gap-7 px-4 text-center md:px-8">
          <Sk className="h-7 w-36 rounded-full" />
          <div className="w-full max-w-4xl space-y-4">
            <Sk className="mx-auto h-10 w-full max-w-3xl sm:h-14 lg:h-20" />
            <Sk className="mx-auto h-10 w-4/5 max-w-2xl sm:h-14" />
            <Sk className="mx-auto h-4 w-full max-w-2xl sm:h-5" />
            <Sk className="mx-auto h-4 w-4/5 max-w-xl sm:h-5" />
          </div>
          <Sk className="h-11 w-full max-w-52 rounded-full" />
          <Sk className="h-14 w-full max-w-2xl rounded-full sm:h-16" />
          <div className="w-full max-w-4xl space-y-4 pt-3 sm:pt-6">
            <Sk className="mx-auto h-4 w-28" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 sm:rounded-2xl sm:px-5 sm:py-3">
                  <Sk className="h-8 w-8 shrink-0 rounded-lg" />
                  <Sk className="h-4 w-24 max-w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/50 bg-background py-8 sm:py-12 md:py-20">
        <div className="container mx-auto grid grid-cols-2 gap-3 px-4 sm:gap-6 md:grid-cols-4 md:gap-8 md:px-8">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex flex-col items-center rounded-2xl border border-border/60 bg-card p-4 text-center shadow-sm sm:rounded-3xl sm:p-6">
              <Sk className="mb-3 h-12 w-12 rounded-xl sm:mb-4 sm:h-16 sm:w-16 sm:rounded-2xl" />
              <Sk className="mb-2 h-8 w-20 sm:h-10" />
              <Sk className="h-3 w-24 max-w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-8 space-y-3 text-center sm:mb-12">
            <Sk className="mx-auto h-3 w-32" />
            <Sk className="mx-auto h-8 w-64 max-w-full sm:h-10" />
            <Sk className="mx-auto h-4 w-full max-w-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 sm:p-5">
                <Sk className="h-10 w-10 rounded-xl" />
                <Sk className="h-4 w-3/4" />
                <div className="hidden space-y-2 min-[400px]:block">
                  <Sk className="h-3 w-full" />
                  <Sk className="h-3 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-muted/20 py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-10 space-y-3 text-center sm:mb-14">
            <Sk className="mx-auto h-3 w-28" />
            <Sk className="mx-auto h-8 w-56 max-w-full sm:h-10" />
            <Sk className="mx-auto h-4 w-full max-w-xl" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:gap-8 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex flex-col items-center gap-3 text-center">
                <Sk className="h-14 w-14 rounded-full sm:h-20 sm:w-20" />
                <Sk className="h-4 w-28 max-w-full" />
                <Sk className="h-3 w-full max-w-40" />
                <Sk className="h-3 w-4/5 max-w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-2">
              <Sk className="h-3 w-20" />
              <Sk className="h-8 w-48 max-w-full" />
            </div>
            <Sk className="h-4 w-16" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="space-y-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <Sk className="h-5 w-24 rounded-full" />
                  <Sk className="h-3 w-12" />
                </div>
                <Sk className="h-4 w-full" />
                <Sk className="h-4 w-4/5" />
                <Sk className="h-3 w-28" />
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center md:p-8">
            <Sk className="h-14 w-14 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Sk className="h-5 w-56 max-w-full" />
              <Sk className="h-4 w-full max-w-2xl" />
              <Sk className="h-4 w-4/5 max-w-xl" />
            </div>
            <Sk className="h-11 w-32 shrink-0 rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  );
}

export function DepartmentListingSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12" role="status">
      <span className="sr-only">Loading departments</span>
      <div className="mb-12 space-y-4">
        <Sk className="h-6 w-36 rounded-full" />
        <Sk className="h-10 w-80 max-w-full" />
        <Sk className="h-5 w-full max-w-xl" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <Sk className="h-5 w-3/4" />
              <Sk className="h-5 w-5 shrink-0 rounded-full" />
            </div>
            <div className="space-y-2">
              <Sk className="h-3 w-full" />
              <Sk className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DepartmentDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8" role="status">
      <span className="sr-only">Loading department details</span>
      <div className="mb-8 flex items-center gap-2">
        <Sk className="h-4 w-12" />
        <Sk className="h-4 w-4 rounded-full" />
        <Sk className="h-4 w-24" />
        <Sk className="h-4 w-4 rounded-full" />
        <Sk className="h-4 w-32 max-w-[30%]" />
      </div>
      <div className="mb-12 space-y-4">
        <Sk className="h-4 w-40" />
        <Sk className="h-10 w-80 max-w-full" />
        <Sk className="h-5 w-full max-w-2xl" />
        <Sk className="h-5 w-4/5 max-w-xl" />
      </div>
      <div className="mb-6 border-b border-border pb-2">
        <Sk className="h-8 w-64 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <Sk className="h-5 w-3/4" />
              <Sk className="h-5 w-5 shrink-0 rounded-full" />
            </div>
            <div className="space-y-2">
              <Sk className="h-3 w-full" />
              <Sk className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Table Row Skeleton ────────────────────────────────────────────────
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Sk className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// ─── Text Block Skeleton ───────────────────────────────────────────────
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Sk key={i} className={`h-4 ${i === lines - 1 ? "w-3/5" : "w-full"}`} />
      ))}
    </div>
  );
}

export function ProfileSettingsSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8 pb-24 md:pb-8" role="status">
      <span className="sr-only">Loading profile settings</span>
      <Sk className="h-4 w-32" />
      <div className="space-y-3">
        <Sk className="h-9 w-64 max-w-full" />
        <Sk className="h-4 w-80 max-w-full" />
      </div>
      <div className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="space-y-2 border-b border-border pb-4">
          <Sk className="h-6 w-48" />
          <Sk className="h-4 w-72 max-w-full" />
        </div>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Sk className="h-4 w-36" />
            <Sk className="h-11 w-full rounded-md" />
          </div>
        ))}
        <Sk className="h-10 w-32" />
      </div>
      <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <Sk className="h-6 w-40" />
        <Sk className="h-4 w-64 max-w-full" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Sk className="h-20 w-full rounded-xl" />
          <Sk className="h-20 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function AdminSettingsSkeleton() {
  return (
    <div className="space-y-8" role="status">
      <span className="sr-only">Loading platform settings</span>
      <div className="space-y-3">
        <Sk className="h-9 w-72 max-w-full" />
        <Sk className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="space-y-2 border-b border-border pb-4">
              <Sk className="h-6 w-48" />
              <Sk className="h-4 w-full" />
            </div>
            {Array.from({ length: index === 0 ? 3 : 2 }, (_, fieldIndex) => (
              <div key={fieldIndex} className="space-y-2">
                <Sk className="h-4 w-40" />
                <Sk className="h-10 w-full rounded-md" />
              </div>
            ))}
            <Sk className="h-9 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
