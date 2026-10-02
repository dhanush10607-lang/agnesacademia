"use client";

import { useState } from "react";
import { updateFacultySubjects } from "@/app/actions/admin-faculty";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Save, GraduationCap, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: { name: string; academic_year: { name: string; programme: { name: string } } };
}

interface Faculty {
  id: string;
  full_name: string;
  email: string;
  department: { name: string } | null;
}

interface Props {
  facultyList: Faculty[];
  subjectsList: Subject[];
  initialAssignments: Record<string, string[]>; // Map of faculty_id -> [subject_ids]
}

export function FacultyAssignmentManager({ facultyList, subjectsList, initialAssignments }: Props) {
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [assignments, setAssignments] = useState<Record<string, string[]>>(initialAssignments);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const currentFaculty = facultyList.find(f => f.id === selectedFaculty);
  const currentFacultySubjects = assignments[selectedFaculty] || [];

  const handleToggleSubject = (subjectId: string) => {
    if (!selectedFaculty) return;
    
    setAssignments(prev => {
      const current = prev[selectedFaculty] || [];
      const updated = current.includes(subjectId)
        ? current.filter(id => id !== subjectId)
        : [...current, subjectId];
        
      return { ...prev, [selectedFaculty]: updated };
    });
    setMessage(null);
  };

  const handleSave = async () => {
    if (!selectedFaculty) return;
    
    setIsSaving(true);
    setMessage(null);
    
    const { success, error } = await updateFacultySubjects(selectedFaculty, currentFacultySubjects);
    
    setIsSaving(false);
    if (success) {
      setMessage({ type: "success", text: "Faculty subjects updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: error || "Failed to update assignments." });
    }
  };

  // Group subjects by Programme -> Semester for better UI organization
  const groupedSubjects = subjectsList.reduce((acc, subject) => {
    const progName = subject.semester?.academic_year?.programme?.name || "Unassigned Programme";
    const semName = subject.semester?.name || "Unassigned Semester";
    const groupName = `${progName} - ${semName}`;
    
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(subject);
    return acc;
  }, {} as Record<string, Subject[]>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar: Faculty Selection */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-primary" /> Select Faculty
            </CardTitle>
            <CardDescription>Choose a faculty member to manage their teaching assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedFaculty} onValueChange={(val) => { setSelectedFaculty(val || ""); setMessage(null); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a faculty member..." />
              </SelectTrigger>
              <SelectContent>
                {facultyList.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    No faculty members found.<br/>
                    Please change a user's role to Faculty in the User Management page first.
                  </div>
                ) : (
                  facultyList.map(faculty => (
                    <SelectItem key={faculty.id} value={faculty.id}>
                      {faculty.full_name || "Unnamed Faculty"} 
                      <span className="text-muted-foreground ml-2 text-xs">({faculty.department?.name || "No Dept"})</span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {currentFaculty && (
              <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border">
                <h4 className="font-semibold text-sm mb-1">{currentFaculty.full_name}</h4>
                <p className="text-xs text-muted-foreground mb-3">{currentFaculty.email}</p>
                <div className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {currentFacultySubjects.length} Subject(s) Assigned
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Subject Selection */}
      <div className="lg:col-span-2">
        {!selectedFaculty ? (
          <Card className="border-dashed shadow-sm flex flex-col items-center justify-center h-[400px] bg-muted/10">
            <GraduationCap className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Select a faculty member first</p>
            <p className="text-sm text-muted-foreground/70">To start assigning subjects</p>
          </Card>
        ) : (
          <Card className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-start justify-between border-b pb-4 mb-4">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" /> Assign Subjects
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Select the subjects that {currentFaculty?.full_name} will be teaching.
                </CardDescription>
              </div>
              <Button onClick={handleSave} disabled={isSaving} className="shrink-0 gap-2 shadow-md">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </CardHeader>
            <CardContent className="space-y-8 h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl flex items-start gap-3 mb-6 ${message.type === 'success' ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'}`}
                >
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <p className="text-sm font-medium">{message.text}</p>
                </motion.div>
              )}

              {Object.keys(groupedSubjects).length === 0 ? (
                <p className="text-muted-foreground text-center py-10">No subjects found in the database.</p>
              ) : (
                Object.entries(groupedSubjects).sort().map(([groupName, subjects]) => (
                  <div key={groupName} className="space-y-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground border-b pb-2">
                      {groupName}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {subjects.sort((a,b) => a.name.localeCompare(b.name)).map(subject => {
                        const isAssigned = currentFacultySubjects.includes(subject.id);
                        return (
                          <div 
                            key={subject.id}
                            onClick={() => handleToggleSubject(subject.id)}
                            className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                              isAssigned 
                                ? 'border-primary bg-primary/5 shadow-sm' 
                                : 'border-border hover:border-primary/40 hover:bg-muted/50'
                            }`}
                          >
                            <Checkbox 
                              id={`subject-${subject.id}`} 
                              checked={isAssigned}
                              onCheckedChange={() => handleToggleSubject(subject.id)}
                              className="mt-0.5"
                            />
                            <div className="flex flex-col gap-0.5 leading-none cursor-pointer">
                              <Label 
                                htmlFor={`subject-${subject.id}`} 
                                className="font-semibold cursor-pointer text-sm"
                              >
                                {subject.name}
                              </Label>
                              <span className="text-xs text-muted-foreground">{subject.code}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
