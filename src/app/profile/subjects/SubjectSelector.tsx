"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, Lock, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SubjectSelector({
  availableSubjects,
  initialSelectedIds,
  isLocked
}: {
  availableSubjects: any[];
  initialSelectedIds: string[];
  isLocked: boolean;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedIds));
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const toggleSubject = (id: string) => {
    if (isLocked) return;
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (isLocked) return;
    const allIds = availableSubjects.map(s => s.id);
    setSelectedIds(new Set(allIds));
  };

  const clearAll = () => {
    if (isLocked) return;
    setSelectedIds(new Set());
  };

  const handleSave = async () => {
    if (isLocked) return;
    setIsSubmitting(true);
    setSuccess(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Remove old selections
    await supabase.from("student_subjects").delete().eq("student_id", user.id);

    // Insert new selections
    if (selectedIds.size > 0) {
      const inserts = Array.from(selectedIds).map(subId => ({
        student_id: user.id,
        subject_id: subId
      }));

      const { error } = await supabase.from("student_subjects").insert(inserts);
      if (!error) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      } else {
        alert("Failed to save subjects.");
      }
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    }
    
    setIsSubmitting(false);
  };

  const filteredSubjects = availableSubjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.code && s.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Select Subjects</CardTitle>
            <CardDescription>Choose the subjects you are studying this semester.</CardDescription>
          </div>
          {isLocked && (
            <div className="flex items-center text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-md border border-amber-200 dark:border-amber-900/50 text-sm font-medium">
              <Lock className="w-4 h-4 mr-2" /> Locked by Admin
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search subjects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {!isLocked && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={selectAll} className="flex-1 sm:flex-auto">Select All</Button>
              <Button variant="outline" size="sm" onClick={clearAll} className="flex-1 sm:flex-auto">Clear All</Button>
            </div>
          )}
        </div>

        {availableSubjects.length === 0 ? (
          <Alert>
            <AlertTitle>No Subjects Available</AlertTitle>
            <AlertDescription>There are no subjects registered for your current semester.</AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto p-1">
            {filteredSubjects.map(sub => {
              const isSelected = selectedIds.has(sub.id);
              return (
                <div 
                  key={sub.id} 
                  onClick={() => toggleSubject(sub.id)}
                  className={`flex items-start space-x-3 space-y-0 rounded-lg border p-4 transition-all ${isLocked ? 'opacity-80' : 'cursor-pointer hover:border-primary/50'} ${isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card'}`}
                >
                  <Checkbox 
                    checked={isSelected} 
                    onCheckedChange={() => toggleSubject(sub.id)}
                    disabled={isLocked}
                    className="mt-1"
                  />
                  <div className="space-y-1 leading-none flex-1">
                    <Label className={`${isLocked ? '' : 'cursor-pointer'} font-semibold text-base leading-tight`}>{sub.name}</Label>
                    {sub.code && <p className="text-xs text-muted-foreground font-mono">{sub.code}</p>}
                  </div>
                  {isSelected && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
                </div>
              );
            })}
            
            {filteredSubjects.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No subjects match your search.
              </div>
            )}
          </div>
        )}

        {!isLocked && availableSubjects.length > 0 && (
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button onClick={handleSave} disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? "Saving..." : "Save Subjects"}
            </Button>
            {success && (
              <span className="flex items-center text-sm font-medium text-green-600 animate-in fade-in">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved Successfully
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
