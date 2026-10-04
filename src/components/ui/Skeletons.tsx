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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-3xl p-6 flex flex-col items-center gap-3">
          <Sk className="w-14 h-14 rounded-2xl" />
          <Sk className="h-7 w-16" />
          <Sk className="h-3 w-20" />
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
