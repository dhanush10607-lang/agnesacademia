"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import Link from "next/link";

type Programme = { id: string; name: string };
type AcademicSession = { id: string; name: string; programme_id: string };

type Props = {
  programmes: Programme[];
  sessions: AcademicSession[];
  curriculum: {
    name: string;
    code: string | null;
    description: string | null;
    programme_id: string;
    academic_year: string | null;
  };
  action: (formData: FormData) => Promise<void>;
};

export function EditCurriculumForm({ programmes, sessions, curriculum, action }: Props) {
  const [programmeId, setProgrammeId] = useState(curriculum.programme_id);
  const [sessionId, setSessionId] = useState(
    sessions.find(session =>
      session.programme_id === curriculum.programme_id &&
      session.name === curriculum.academic_year
    )?.id || ""
  );
  const availableSessions = sessions.filter(session => session.programme_id === programmeId);

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
            setSessionId("");
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
        <Input id="name" name="name" defaultValue={curriculum.name} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input id="code" name="code" defaultValue={curriculum.code || ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="academic_session_id">Academic Session</Label>
          <select
            id="academic_session_id"
            name="academic_session_id"
            value={sessionId}
            onChange={event => setSessionId(event.target.value)}
            disabled={!programmeId || availableSessions.length === 0}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {!programmeId
                ? "Select a programme first"
                : availableSessions.length === 0
                  ? "No active sessions for this programme"
                  : "All sessions"}
            </option>
            {availableSessions.map(session => (
              <option key={session.id} value={session.id}>{session.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={curriculum.description || ""} />
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Link href="/admin/academic/curricula">
          <Button variant="outline" type="button">Cancel</Button>
        </Link>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>
    </form>
  );
}
