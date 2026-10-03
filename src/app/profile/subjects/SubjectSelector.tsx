"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  // Enforce compulsory subjects implicitly initially if not present
  const compulsoryIds = availableSubjects.filter(s => s.is_compulsory).map(s => s.id);
  const initialSet = new Set([...initialSelectedIds, ...compulsoryIds]);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(initialSet);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const toggleSubject = (id: string, isCompulsory: boolean) => {
    if (isLocked || isCompulsory) return; // Cannot toggle compulsory subjects
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSave = async () => {
    if (isLocked) return;
    setIsSubmitting(true);
    setSuccess(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // In a real app we might update the source row instead of delete/insert
    // Or just set ENROLLED / DROPPED based on selection.
    // For now we simulate the old logic but respecting new data model slightly
    
    // Deactivate old enrollments
    await supabase.from("student_subjects").update({ enrollment_status: 'DROPPED' }).eq("student_id", user.id);

    // Insert new selections
    if (selectedIds.size > 0) {
      const inserts = Array.from(selectedIds).map(subId => ({
        student_id: user.id,
        subject_id: subId,
        enrollment_status: 'ENROLLED'
      }));

      // We do an upsert or ignore constraint errors depending on schema
      // A proper API route with a transaction is better, but this handles the client side portion.
      const { error } = await supabase.from("student_subjects").upsert(inserts, { onConflict: "student_id, subject_id, academic_year, semester" });
      if (!error) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      } else {
        alert("Failed to save subjects.");
        console.error(error);
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

  // Group by subject type
  const groupedSubjects = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredSubjects.forEach(s => {
      const type = s.subject_type || 'Other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(s);
    });
    
    // Sort groups by type_order (inferred from first item)
    return Object.entries(groups).sort((a, b) => {
      const aOrder = a[1][0]?.type_order || 99;
      const bOrder = b[1][0]?.type_order || 99;
      return aOrder - bOrder;
    });
  }, [filteredSubjects]);

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Select Subjects</CardTitle>
            <CardDescription>Review and select your enrolled subjects.</CardDescription>
          </div>
          {isLocked && (
            <div className="flex items-center text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-md border border-amber-200 dark:border-amber-900/50 text-sm font-medium">
              <Lock className="w-4 h-4 mr-2" /> Locked by Admin
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-8">
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
        </div>

        {availableSubjects.length === 0 ? (
          <Alert>
            <AlertTitle>No Subjects Available</AlertTitle>
            <AlertDescription>Your curriculum has no subjects assigned for this semester yet.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-8">
            {groupedSubjects.map(([type, subjects]) => (
              <div key={type} className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2 uppercase tracking-wide text-muted-foreground">{type}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjects.map(sub => {
                    const isSelected = selectedIds.has(sub.id);
                    const isCompulsory = sub.is_compulsory;
                    
                    return (
                      <div 
                        key={sub.id} 
                        onClick={() => toggleSubject(sub.id, isCompulsory)}
                        className={`flex items-start space-x-3 space-y-0 rounded-lg border p-4 transition-all ${(isLocked || isCompulsory) ? 'opacity-90' : 'cursor-pointer hover:border-primary/50'} ${isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card'}`}
                      >
                        <Checkbox 
                          checked={isSelected} 
                          onCheckedChange={() => toggleSubject(sub.id, isCompulsory)}
                          disabled={isLocked || isCompulsory}
                          className="mt-1"
                        />
                        <div className="space-y-1 leading-none flex-1">
                          <Label className={`${(isLocked || isCompulsory) ? '' : 'cursor-pointer'} font-semibold text-base leading-tight`}>
                            {sub.name}
                            {isCompulsory && <span className="ml-2 text-xs text-amber-600 font-normal px-2 py-0.5 bg-amber-100 dark:bg-amber-900 rounded-full">Compulsory</span>}
                          </Label>
                          {sub.code && <p className="text-xs text-muted-foreground font-mono">{sub.code}</p>}
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLocked && availableSubjects.length > 0 && (
          <div className="flex items-center gap-4 pt-4 border-t mt-8">
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
