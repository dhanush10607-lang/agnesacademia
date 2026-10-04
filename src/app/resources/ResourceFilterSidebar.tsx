"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

export function ResourceFilterSidebar({ 
  categories,
  subjects
}: {
  categories: { id: string; name: string }[];
  subjects: { id: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentSubject = searchParams.get("subject") || "";
  const selectedCategoryName = categories.find(category => category.id === currentCategory)?.name;
  const selectedSubjectName = subjects.find(subject => subject.id === currentSubject)?.name;

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page to 1 when filters change
    params.delete("page");
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("subject");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = currentCategory || currentSubject;

  return (
    <div className="w-full shrink-0 lg:w-64">
      <details className="group rounded-xl border bg-card shadow-sm lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 items-center gap-2">
            <Filter className="h-4 w-4 shrink-0 text-primary" />
            <span className="font-semibold">Filters</span>
            {hasActiveFilters ? (
              <span className="truncate text-sm text-muted-foreground">
                {[selectedCategoryName, selectedSubjectName].filter(Boolean).join(" · ")}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">Type, subject</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">Filter resources</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-muted-foreground hover:text-primary">
                Clear all
              </Button>
            )}
          </div>
          {renderFilterOptions("mobile")}
        </div>
      </details>

      <div className="sticky top-20 hidden space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm lg:block">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Filter className="h-4 w-4" /> Filters
          </h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-muted-foreground hover:text-primary">
              Clear all
            </Button>
          )}
        </div>
        {renderFilterOptions("desktop")}
      </div>
    </div>
  );

  function renderFilterOptions(idPrefix: string) {
    return (
      <div className="space-y-4">
        <div>
          <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">Type</h4>
          <RadioGroup
            value={currentCategory || "all"}
            onValueChange={(value) => updateFilters("category", value === "all" ? "" : value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id={`${idPrefix}-cat-all`} />
              <Label htmlFor={`${idPrefix}-cat-all`} className="cursor-pointer font-normal">All Types</Label>
            </div>
            {categories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.id} id={`${idPrefix}-cat-${category.id}`} />
                <Label htmlFor={`${idPrefix}-cat-${category.id}`} className="cursor-pointer font-normal">{category.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <h4 className="mb-3 mt-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">Subject</h4>
          <RadioGroup
            value={currentSubject || "all"}
            onValueChange={(value) => updateFilters("subject", value === "all" ? "" : value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id={`${idPrefix}-sub-all`} />
              <Label htmlFor={`${idPrefix}-sub-all`} className="cursor-pointer font-normal">All Subjects</Label>
            </div>
            {subjects.map(subject => (
              <div key={subject.id} className="flex items-center space-x-2">
                <RadioGroupItem value={subject.id} id={`${idPrefix}-sub-${subject.id}`} />
                <Label htmlFor={`${idPrefix}-sub-${subject.id}`} className="line-clamp-1 flex-1 cursor-pointer font-normal">{subject.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    );
  }
}
