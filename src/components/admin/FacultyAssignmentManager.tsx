"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateFacultyAssignments } from "@/app/actions/admin-faculty";
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
  department_id: string | null;
  subject_departments: { department_id: string }[];
  semester: {
    name: string;
    academic_year: {
      name: string;
      programme: { name: string; department_id: string | null };
    };
  };
}

interface Faculty {
  id: string;
  full_name: string;
  department: { name: string } | null;
}

interface Props {
  facultyList: Faculty[];
  subjectsList: Subject[];
  departmentsList: { id: string; name: string }[];
  initialSubjectAssignments: Record<string, string[]>;
  initialDeptAssignments: Record<string, string[]>;
}

export function FacultyAssignmentManager({ facultyList, subjectsList, departmentsList, initialSubjectAssignments, initialDeptAssignments }: Props) {
  const router = useRouter();
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [subjectAssignments, setSubjectAssignments] = useState<Record<string, string[]>>(initialSubjectAssignments);
  const [deptAssignments, setDeptAssignments] = useState<Record<string, string[]>>(initialDeptAssignments);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const [activeStep, setActiveStep] = useState<"departments" | "subjects">("departments");

  const [subjectSearch, setSubjectSearch] = useState("");

  const currentFaculty = facultyList.find(f => f.id === selectedFaculty);
  const currentFacultySubjects = subjectAssignments[selectedFaculty] || [];
  const currentFacultyDepts = deptAssignments[selectedFaculty] || [];
  const subjectsInSelectedDepartments = subjectsList.filter(subject => {
    const departmentIds = subject.subject_departments?.length
      ? subject.subject_departments.map(department => department.department_id)
      : [subject.department_id || subject.semester?.academic_year?.programme?.department_id];
    return departmentIds.some(departmentId => departmentId && currentFacultyDepts.includes(departmentId));
  });

  const handleToggleSubject = (subjectId: string) => {
    if (!selectedFaculty) return;
    setSubjectAssignments(prev => {
      const current = prev[selectedFaculty] || [];
      const updated = current.includes(subjectId) ? current.filter(id => id !== subjectId) : [...current, subjectId];
      return { ...prev, [selectedFaculty]: updated };
    });
    setMessage(null);
  };

  const handleToggleDept = (deptId: string) => {
    if (!selectedFaculty) return;
    const current = deptAssignments[selectedFaculty] || [];
    const updated = current.includes(deptId) ? current.filter(id => id !== deptId) : [...current, deptId];
    setDeptAssignments(prev => {
      return { ...prev, [selectedFaculty]: updated };
    });
    setActiveStep(updated.length > 0 ? "subjects" : "departments");
    setMessage(null);
  };

  const handleSave = async () => {
    if (!selectedFaculty) return;
    
    setIsSaving(true);
    setMessage(null);
    
    const eligibleSubjectIds = new Set(subjectsInSelectedDepartments.map(subject => subject.id));
    const subjectsToSave = currentFacultySubjects.filter(subjectId => eligibleSubjectIds.has(subjectId));
    const { success, error } = await updateFacultyAssignments(selectedFaculty, subjectsToSave, currentFacultyDepts);

    setIsSaving(false);
    if (success) {
      setSubjectAssignments(prev => ({ ...prev, [selectedFaculty]: subjectsToSave }));
      setMessage({ type: "success", text: "Faculty subjects updated successfully!" });
      router.refresh();
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: error || "Failed to update assignments." });
    }
  };

  // Group subjects by Programme -> Semester for better UI organization
  const groupedSubjects = subjectsInSelectedDepartments.reduce((acc, subject) => {
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
            <Select value={selectedFaculty} onValueChange={(val) => { setSelectedFaculty(val || ""); setActiveStep("departments"); setMessage(null); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a faculty member...">
                  {(value) => facultyList.find(faculty => faculty.id === value)?.full_name || "Select a faculty member..."}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {facultyList.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    No faculty members found.<br/>
                    Please change a user&apos;s role to Faculty in the User Management page first.
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
                <h4 className="font-semibold text-sm mb-2">{currentFaculty.full_name}</h4>
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
                  <BookOpen className="w-5 h-5 mr-2 text-primary" /> Faculty Assignments
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Assign departments first, then choose subjects for {currentFaculty?.full_name}.
                </CardDescription>
              </div>
              <Button onClick={handleSave} disabled={isSaving} className="shrink-0 gap-2 shadow-md">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
              
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

              <Card className="overflow-hidden border-border">
                <CardHeader className="flex flex-row items-center justify-between gap-4 py-4">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-primary" /> Assign Departments
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {activeStep === "subjects"
                        ? currentFacultyDepts.map(id => departmentsList.find(dept => dept.id === id)?.name).filter(Boolean).join(", ")
                        : "Select one or more departments to continue."}
                    </CardDescription>
                  </div>
                  {activeStep === "subjects" && (
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveStep("departments")}>
                      Change
                    </Button>
                  )}
                </CardHeader>
                <motion.div
                  initial={false}
                  animate={{ height: activeStep === "departments" ? "auto" : 0, opacity: activeStep === "departments" ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0 pb-5">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {departmentsList.map(dept => {
                        const isAssigned = currentFacultyDepts.includes(dept.id);
                        return (
                          <div
                            key={dept.id}
                            className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                              isAssigned
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border hover:border-primary/40 hover:bg-muted/50"
                            }`}
                          >
                            <Checkbox
                              id={`dept-${dept.id}`}
                              checked={isAssigned}
                              onCheckedChange={() => handleToggleDept(dept.id)}
                              className="mt-0.5"
                            />
                            <Label
                              htmlFor={`dept-${dept.id}`}
                              className="font-semibold cursor-pointer text-sm leading-tight"
                            >
                              {dept.name}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </motion.div>
              </Card>

              <Card className={`overflow-hidden border-border ${currentFacultyDepts.length === 0 ? "opacity-70" : ""}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-4 py-4">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-primary" /> Assign Subjects
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {currentFacultyDepts.length === 0
                        ? "Select a department first."
                        : `${currentFacultySubjects.length} subject(s) selected from the chosen departments.`}
                    </CardDescription>
                  </div>
                  {activeStep === "departments" && currentFacultyDepts.length > 0 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveStep("subjects")}>
                      Choose subjects
                    </Button>
                  )}
                </CardHeader>
                <motion.div
                  initial={false}
                  animate={{ height: activeStep === "subjects" && currentFacultyDepts.length > 0 ? "auto" : 0, opacity: activeStep === "subjects" && currentFacultyDepts.length > 0 ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0 pb-5 max-h-[600px] overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-2">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    Subjects
                  </h3>
                  <div className="mt-2 sm:mt-0 w-full sm:w-64">
                    <input 
                      type="text" 
                      placeholder="Search subjects..." 
                      value={subjectSearch}
                      onChange={e => setSubjectSearch(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>

              {currentFacultyDepts.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">Select a department above to view its subjects.</p>
              ) : Object.keys(groupedSubjects).length === 0 ? (
                <p className="text-muted-foreground text-center py-10">No subjects are assigned to the selected departments.</p>
              ) : (
                Object.entries(groupedSubjects).sort().map(([groupName, subjects]) => {
                  const filteredSubjects = subjects.filter(s => 
                    s.name.toLowerCase().includes(subjectSearch.toLowerCase()) || 
                    s.code.toLowerCase().includes(subjectSearch.toLowerCase())
                  );

                  if (filteredSubjects.length === 0) return null;

                  return (
                  <div key={groupName} className="space-y-4">
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground/70">
                      {groupName}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredSubjects.sort((a,b) => a.name.localeCompare(b.name)).map(subject => {
                        const isAssigned = currentFacultySubjects.includes(subject.id);
                        return (
                          <div
                            key={subject.id}
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
                  );
                })
              )}
                    </div>
                  </CardContent>
                </motion.div>
              </Card>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
