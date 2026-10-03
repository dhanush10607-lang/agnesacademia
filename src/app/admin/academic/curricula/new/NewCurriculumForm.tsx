"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import Link from "next/link";

type Programme = { id: string; name: string };
type AcademicYear = { id: string; name: string; programme_id: string };

type Props = {
  programmes: Programme[];
  academicYears: AcademicYear[];
  action: (formData: FormData) => Promise<void>;
};

export function NewCurriculumForm({ programmes, academicYears, action }: Props) {
  const [programmeId, setProgrammeId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const availableYears = academicYears.filter(year => year.programme_id === programmeId);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="programme_id">Programme <span className="text-red-500">*</span></Label>
        <select
          id="programme_id"
          name="programme_id"
          required
          value={programmeId}
          onChange={event => {
            setProgrammeId(event.target.value);
            setAcademicYearId("");
          }}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a Programme</option>
          {programmes.map(programme => (
            <option key={programme.id} value={programme.id}>{programme.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Curriculum Name <span className="text-red-500">*</span></Label>
        <Input id="name" name="name" placeholder="e.g. B.Sc MPC (2024)" required />
        <p className="text-xs text-muted-foreground">A descriptive name for this combination.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input id="code" name="code" placeholder="e.g. BSC-MPC" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="academic_year_id">Academic Year</Label>
          <select
            id="academic_year_id"
            name="academic_year_id"
            value={academicYearId}
            onChange={event => setAcademicYearId(event.target.value)}
            disabled={!programmeId || availableYears.length === 0}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {!programmeId
                ? "Select a programme first"
                : availableYears.length === 0
                  ? "No active years for this programme"
                  : "All academic years"}
            </option>
            {availableYears.map(year => (
              <option key={year.id} value={year.id}>{year.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Optional details..." />
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Link href="/admin/academic/curricula">
          <Button variant="outline" type="button">Cancel</Button>
        </Link>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" /> Create Curriculum
        </Button>
      </div>
    </form>
  );
}
