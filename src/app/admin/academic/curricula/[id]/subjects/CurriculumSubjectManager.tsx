"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, CheckCircle, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CurriculumSubjectManager({
  curriculumId,
  subjectTypes,
  assignedSubjects,
  allSubjects
}: {
  curriculumId: string;
  subjectTypes: any[];
  assignedSubjects: any[];
  allSubjects: any[];
}) {
  const [subjects, setSubjects] = useState<any[]>(assignedSubjects);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const handleAddSubject = () => {
    setSubjects([...subjects, {
      id: `temp-${Date.now()}`,
      curriculum_id: curriculumId,
      subject_id: "",
      subject_type_id: subjectTypes[0]?.id || "",
      is_compulsory: true,
      is_selectable: false,
      minimum_selection: 1,
      maximum_selection: 1,
      display_order: subjects.length * 10
    }]);
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleChange = (id: string, field: string, value: any) => {
    setSubjects(subjects.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setSuccess(false);

    // Basic validation
    const validSubjects = subjects.filter(s => s.subject_id !== "");
    
    // We would typically use a transaction or an API route here.
    // Doing client-side delete/insert for MVP demonstration:
    await supabase.from("curriculum_subjects").delete().eq("curriculum_id", curriculumId);
    
    const inserts = validSubjects.map(s => {
      const payload: any = {
        curriculum_id: curriculumId,
        subject_id: s.subject_id,
        subject_type_id: s.subject_type_id,
        is_compulsory: s.is_compulsory,
        is_selectable: !s.is_compulsory, // Simplified logic
        display_order: s.display_order
      };
      
      // Don't insert temporary IDs generated on the client
      if (!s.id.startsWith("temp-")) {
        payload.id = s.id;
      }
      
      return payload;
    });

    if (inserts.length > 0) {
      const { error } = await supabase.from("curriculum_subjects").insert(inserts);
      if (!error) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      } else {
        alert("Failed to save. Check console.");
        console.error(error);
      }
    } else {
      setSuccess(true);
      router.refresh();
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle>Assigned Subjects</CardTitle>
        <CardDescription>Add subjects to this curriculum and configure their selection rules.</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {subjects.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-4">No subjects have been added to this curriculum yet.</p>
            <Button onClick={handleAddSubject} variant="outline"><Plus className="w-4 h-4 mr-2" /> Add First Subject</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {subjects.map((sub, index) => (
              <div key={sub.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-card items-start md:items-center">
                <GripVertical className="w-5 h-5 text-muted-foreground hidden md:block cursor-grab opacity-50" />
                
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Subject Dropdown */}
                  <div className="md:col-span-4 space-y-1">
                    <Label className="text-xs text-muted-foreground">Subject</Label>
                    <SearchableSubjectSelect 
                      subjects={allSubjects}
                      value={sub.subject_id}
                      onChange={(val) => handleChange(sub.id, "subject_id", val)}
                    />
                  </div>
                  
                  {/* Read-only Semester */}
                  <div className="md:col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Semester</Label>
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                      <span className="truncate">
                        {allSubjects.find(s => s.id === sub.subject_id)?.semester?.name || '-'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Subject Type */}
                  <div className="md:col-span-3 space-y-1">
                    <Label className="text-xs text-muted-foreground">Subject Group</Label>
                    <Select 
                      value={sub.subject_type_id} 
                      onValueChange={(val) => handleChange(sub.id, "subject_type_id", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select group...">
                          {(value) => subjectTypes.find(subjectType => subjectType.id === value)?.name || "Select group..."}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {subjectTypes.map(st => (
                          <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Compulsory Toggle */}
                  <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3 mt-4 md:mt-0">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`compulsory-${sub.id}`} 
                        checked={sub.is_compulsory}
                        onCheckedChange={(checked) => handleChange(sub.id, "is_compulsory", checked)}
                      />
                      <label htmlFor={`compulsory-${sub.id}`} className="text-sm font-medium leading-none cursor-pointer">
                        Compulsory
                      </label>
                    </div>
                    
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveSubject(sub.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-2">
              <Button onClick={handleAddSubject} variant="outline" className="w-full border-dashed"><Plus className="w-4 h-4 mr-2" /> Add Subject</Button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-6 border-t">
          <Button onClick={handleSave} disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? "Saving Configuration..." : "Save Configuration"}
          </Button>
          {success && (
            <span className="flex items-center text-sm font-medium text-green-600 animate-in fade-in">
              <CheckCircle className="w-4 h-4 mr-1" /> Saved Successfully
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SearchableSubjectSelect({ 
  subjects, value, onChange 
}: { 
  subjects: any[], value: string, onChange: (val: string) => void 
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = subjects.find(s => s.id === value);
  const filtered = subjects.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) || 
    (s.code && s.code.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="relative">
      <div 
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">{selected ? `${selected.name} (${selected.code})` : "Select a subject..."}</span>
        <span className="opacity-50 text-xs">▼</span>
      </div>
      
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md p-1">
            <input 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary mb-1" 
              placeholder="Search subject..." 
              value={query} 
              onChange={e => setQuery(e.target.value)}
              onClick={e => e.stopPropagation()}
              autoFocus
            />
            <div className="max-h-40 overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <div className="py-2 text-center text-sm text-muted-foreground">No subjects found.</div>
              ) : (
                filtered.map(s => (
                  <div 
                    key={s.id} 
                    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${value === s.id ? "bg-accent text-accent-foreground font-medium" : ""}`}
                    onClick={() => { onChange(s.id); setOpen(false); setQuery(""); }}
                  >
                    <span className="truncate">{s.name} ({s.code}) {s.semester?.name ? `[${s.semester.name}]` : ''}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
