"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter } from "lucide-react";
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
  const currentQuery = searchParams.get("q") || "";

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
    <div className="w-full lg:w-64 shrink-0 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-muted-foreground hover:text-primary">
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Type</h4>
          <RadioGroup 
            value={currentCategory} 
            onValueChange={(v) => updateFilters("category", v === "all" ? "" : v)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="cat-all" />
              <Label htmlFor="cat-all" className="cursor-pointer font-normal">All Types</Label>
            </div>
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <RadioGroupItem value={cat.id} id={`cat-${cat.id}`} />
                <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer font-normal">{cat.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider mt-6">Subject</h4>
          <RadioGroup 
            value={currentSubject} 
            onValueChange={(v) => updateFilters("subject", v === "all" ? "" : v)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="sub-all" />
              <Label htmlFor="sub-all" className="cursor-pointer font-normal">All Subjects</Label>
            </div>
            {subjects.map((sub) => (
              <div key={sub.id} className="flex items-center space-x-2">
                <RadioGroupItem value={sub.id} id={`sub-${sub.id}`} />
                <Label htmlFor={`sub-${sub.id}`} className="cursor-pointer font-normal line-clamp-1 flex-1">{sub.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
