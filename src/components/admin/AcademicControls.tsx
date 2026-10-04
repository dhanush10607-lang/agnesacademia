"use client";

import { useState } from "react";
import { 
  createProgrammeAction, archiveProgrammeAction,
  createYearAction, archiveYearAction,
  createAcademicSessionAction, archiveAcademicSessionAction,
  createSemesterAction, archiveSemesterAction,
  createSubjectAction, archiveSubjectAction
} from "@/app/actions/admin-academic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ProgrammeOption = { id: string; name: string };

// Programmes
export function CreateProgrammeForm({ departments }: { departments: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createProgrammeAction(formData);
    if (res.success) (e.target as HTMLFormElement).reset();
    else alert(res.error);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
      <div className="flex-grow space-y-2">
        <Label htmlFor="name">Programme Name</Label>
        <Input id="name" name="name" placeholder="E.g., B.Sc Data Science" required />
      </div>
      <div className="w-32 space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input id="code" name="code" placeholder="BSCDS" required />
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="department_id">Department (Optional)</Label>
        <Select name="department_id">
          <SelectTrigger>
            <SelectValue placeholder="No department">
              {(value) => departments.find(department => department.id === value)?.name || "No department"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : "Add"}</Button>
    </form>
  );
}

export function ArchiveProgrammeButton({ id }: { id: string }) {
  const handleArchive = async () => {
    if (!confirm("Archive this programme?")) return;
    await archiveProgrammeAction(id);
  };
  return <Button variant="destructive" size="sm" onClick={handleArchive}>Archive</Button>;
}

// Years
export function CreateYearForm({
  programmes,
  years,
}: {
  programmes: ProgrammeOption[];
  years: { id: string; name: string; programme_id: string }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programmeId, setProgrammeId] = useState("");
  const [yearName, setYearName] = useState("");
  const availableYears = ["I Year", "II Year", "III Year"].filter(
    year => !years.some(existing => existing.programme_id === programmeId && existing.name === year)
  );
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createYearAction(formData);
    if (res.success) {
      (e.target as HTMLFormElement).reset();
      setProgrammeId("");
      setYearName("");
    } else alert(res.error);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
      <div className="flex-grow space-y-2">
        <Label htmlFor="name">Study Year</Label>
        <Select name="name" required value={yearName} onValueChange={value => setYearName(value || "")} disabled={!programmeId || availableYears.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder={!programmeId ? "Select Programme first" : availableYears.length ? "Select Study Year" : "All study years exist"} />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="programme_id">Programme</Label>
        <Select name="programme_id" required value={programmeId} onValueChange={value => {
          setProgrammeId(value || "");
          setYearName("");
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select Programme">
              {(value) => programmes.find(programme => programme.id === value)?.name || "Select Programme"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {programmes.map(programme => <SelectItem key={programme.id} value={programme.id}>{programme.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : "Add"}</Button>
    </form>
  );
}

export function ArchiveYearButton({ id }: { id: string }) {
  const handleArchive = async () => {
    if (!confirm("Archive this year?")) return;
    await archiveYearAction(id);
  };
  return <Button variant="destructive" size="sm" onClick={handleArchive}>Archive</Button>;
}

export function CreateAcademicSessionForm({ programmes }: { programmes: ProgrammeOption[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await createAcademicSessionAction(formData);
    if (result.success) (e.target as HTMLFormElement).reset();
    else alert(result.error);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
      <div className="flex-grow space-y-2">
        <Label htmlFor="session_name">Session Name</Label>
        <Input id="session_name" name="name" placeholder="E.g., 2026-2027" pattern="\d{4}-\d{4}" required />
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="session_programme_id">Programme</Label>
        <Select name="programme_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Select Programme">
              {(value) => programmes.find(programme => programme.id === value)?.name || "Select Programme"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {programmes.map(programme => (
              <SelectItem key={programme.id} value={programme.id}>{programme.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="session_start_date">Start Date</Label>
        <Input id="session_start_date" name="start_date" type="date" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="session_end_date">End Date</Label>
        <Input id="session_end_date" name="end_date" type="date" required />
      </div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : "Add Session"}</Button>
    </form>
  );
}

export function ArchiveAcademicSessionButton({ id }: { id: string }) {
  const handleArchive = async () => {
    if (!confirm("Archive this academic session?")) return;
    const result = await archiveAcademicSessionAction(id);
    if (!result.success) alert(result.error);
  };
  return <Button variant="destructive" size="sm" onClick={handleArchive}>Archive</Button>;
}

// Semesters
export function CreateSemesterForm({
  programmes,
  years,
  sessions,
}: {
  programmes: { id: string; name: string }[];
  years: { id: string; name: string; programme_id: string }[];
  sessions: { id: string; name: string; programme_id: string }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programmeId, setProgrammeId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [academicSessionId, setAcademicSessionId] = useState("");
  const availableYears = years.filter(year => year.programme_id === programmeId);
  const availableSessions = sessions.filter(session => session.programme_id === programmeId);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createSemesterAction(formData);
    if (res.success) {
      (e.target as HTMLFormElement).reset();
      setProgrammeId("");
      setAcademicYearId("");
      setAcademicSessionId("");
    }
    else alert(res.error);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
      <div className="flex-grow space-y-2">
        <Label htmlFor="name">Semester Name</Label>
        <Input id="name" name="name" placeholder="E.g., Semester I" required />
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="programme_id">Programme</Label>
        <Select
          name="programme_id"
          required
          value={programmeId}
          onValueChange={value => {
            setProgrammeId(value || "");
            setAcademicYearId("");
            setAcademicSessionId("");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Programme">
              {(value) => programmes.find(programme => programme.id === value)?.name || "Select Programme"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {programmes.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="academic_year_id">Study Year</Label>
        <Select
          name="academic_year_id"
          required
          value={academicYearId}
          onValueChange={value => setAcademicYearId(value || "")}
          disabled={!programmeId || availableYears.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !programmeId
                ? "Select programme first"
                : availableYears.length === 0
                  ? "No academic years for this programme"
                  : "Select Year"
            }>
              {(value) => availableYears.find(year => year.id === value)?.name || "Select Year"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(year => <SelectItem key={year.id} value={year.id}>{year.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="academic_session_id">Academic Session</Label>
        <Select
          name="academic_session_id"
          required
          value={academicSessionId}
          onValueChange={value => setAcademicSessionId(value || "")}
          disabled={!programmeId || availableSessions.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !programmeId
                ? "Select programme first"
                : availableSessions.length === 0
                  ? "No sessions for this programme"
                  : "Select Session"
            }>
              {(value) => availableSessions.find(session => session.id === value)?.name || "Select Session"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableSessions.map(session => (
              <SelectItem key={session.id} value={session.id}>{session.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : "Add"}</Button>
    </form>
  );
}

export function ArchiveSemesterButton({ id }: { id: string }) {
  const handleArchive = async () => {
    if (!confirm("Archive this semester?")) return;
    await archiveSemesterAction(id);
  };
  return <Button variant="destructive" size="sm" onClick={handleArchive}>Archive</Button>;
}

// Subjects
export function CreateSubjectForm({
  semesters,
  departments,
}: {
  semesters: { id: string; name: string; department_id: string | null }[];
  departments: { id: string; name: string }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const availableSemesters = semesters.filter(
    (semester) => semester.department_id === selectedDepartmentId
  );
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDepartmentId || !selectedSemesterId) {
      alert("Select a department and one of its semesters.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set("semester_id", selectedSemesterId);
    formData.set("department_id", selectedDepartmentId);
    const res = await createSubjectAction(formData);
    if (res.success) {
      (e.target as HTMLFormElement).reset();
      setSelectedDepartmentId("");
      setSelectedSemesterId("");
    }
    else alert(res.error);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
      <div className="flex-grow space-y-2">
        <Label htmlFor="name">Subject Name</Label>
        <Input id="name" name="name" placeholder="E.g., Data Structures" required />
      </div>
      <div className="w-32 space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input id="code" name="code" placeholder="CS201" required />
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="subject_department_id">Department</Label>
        <Select
          name="department_id"
          value={selectedDepartmentId}
          onValueChange={(value) => {
            setSelectedDepartmentId(value || "");
            setSelectedSemesterId("");
          }}
          required
        >
          <SelectTrigger id="subject_department_id">
            <SelectValue placeholder="Select Department">
              {(value) => departments.find((department) => department.id === value)?.name || "Select Department"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {departments.map((department) => (
              <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="semester_id">Semester</Label>
        <Select
          name="semester_id"
          value={selectedSemesterId}
          onValueChange={(value) => setSelectedSemesterId(value || "")}
          disabled={!selectedDepartmentId}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder={selectedDepartmentId ? "Select Semester" : "Select Department First"}>
              {(value) => availableSemesters.find((semester) => semester.id === value)?.name || "Select Semester"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableSemesters.map((semester) => (
              <SelectItem key={semester.id} value={semester.id}>{semester.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : "Add"}</Button>
    </form>
  );
}

export function ArchiveSubjectButton({ id }: { id: string }) {
  const handleArchive = async () => {
    if (!confirm("Archive this subject?")) return;
    await archiveSubjectAction(id);
  };
  return <Button variant="destructive" size="sm" onClick={handleArchive}>Archive</Button>;
}
