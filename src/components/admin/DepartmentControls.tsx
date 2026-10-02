"use client";

import { useState } from "react";
import { createDepartmentAction, archiveDepartmentAction } from "@/app/actions/admin-academic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateDepartmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createDepartmentAction(formData);
    if (res.success) {
      (e.target as HTMLFormElement).reset();
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end">
      <div className="flex-grow space-y-2">
        <Label htmlFor="name">Department Name</Label>
        <Input id="name" name="name" placeholder="E.g., Computer Science" required />
      </div>
      <div className="flex-grow space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input id="description" name="description" placeholder="Brief description..." />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Department"}
      </Button>
    </form>
  );
}

export function ArchiveDepartmentButton({ id }: { id: string }) {
  const [isArchiving, setIsArchiving] = useState(false);

  const handleArchive = async () => {
    if (!confirm("Are you sure you want to archive this department? This will hide it from new registrations but keep historical data intact.")) return;
    
    setIsArchiving(true);
    const res = await archiveDepartmentAction(id);
    if (!res.success) alert(res.error);
    setIsArchiving(false);
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleArchive} disabled={isArchiving}>
      {isArchiving ? "..." : "Archive"}
    </Button>
  );
}
