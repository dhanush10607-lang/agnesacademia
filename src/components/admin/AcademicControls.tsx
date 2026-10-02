"use client";

import { useState } from "react";
import { 
  createProgrammeAction, archiveProgrammeAction,
  createYearAction, archiveYearAction,
  createSemesterAction, archiveSemesterAction,
  createSubjectAction, archiveSubjectAction
} from "@/app/actions/admin-academic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <Label htmlFor="department_id">Department</Label>
        <Select name="department_id" required>
          <SelectTrigger><SelectValue placeholder="Select Dept" /></SelectTrigger>
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
export function CreateYearForm({ programmes }: { programmes: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createYearAction(formData);
    if (res.success) (e.target as HTMLFormElement).reset();
    else alert(res.error);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
      <div className="flex-grow space-y-2">
        <Label htmlFor="name">Year Name</Label>
        <Input id="name" name="name" placeholder="E.g., 2024-2025" required />
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="programme_id">Programme</Label>
        <Select name="programme_id" required>
          <SelectTrigger><SelectValue placeholder="Select Programme" /></SelectTrigger>
          <SelectContent>
            {programmes.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="start_date">Start Date</Label>
        <Input id="start_date" name="start_date" type="date" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end_date">End Date</Label>
        <Input id="end_date" name="end_date" type="date" required />
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

// Semesters
export function CreateSemesterForm({ programmes, years }: { programmes: any[], years: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createSemesterAction(formData);
    if (res.success) (e.target as HTMLFormElement).reset();
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
        <Select name="programme_id" required>
          <SelectTrigger><SelectValue placeholder="Select Programme" /></SelectTrigger>
          <SelectContent>
            {programmes.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="academic_year_id">Academic Year</Label>
        <Select name="academic_year_id" required>
          <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
          <SelectContent>
            {years.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
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
export function CreateSubjectForm({ semesters, departments }: { semesters: any[], departments: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createSubjectAction(formData);
    if (res.success) (e.target as HTMLFormElement).reset();
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
        <Label htmlFor="semester_id">Semester</Label>
        <Select name="semester_id" required>
          <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
          <SelectContent>
            {semesters.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="department_id">Department (Optional)</Label>
        <Select name="department_id">
          <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
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
