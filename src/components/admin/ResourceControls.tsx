"use client";

import { useState } from "react";
import { updateResourceStatusAction } from "@/app/actions/admin-resources";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ResourceStatusSelect({ resourceId, currentStatus }: { resourceId: string, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    setIsUpdating(true);
    const res = await updateResourceStatusAction(resourceId, newStatus);
    if (!res.success) {
      alert(res.error);
    }
    setIsUpdating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'pending_review': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'rejected': return 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'archived': return 'border-slate-500 bg-slate-50 dark:bg-slate-800/20 text-slate-700 dark:text-slate-400';
      default: return 'border-muted bg-background text-foreground';
    }
  };

  return (
    <Select defaultValue={currentStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
      <SelectTrigger className={`w-[140px] h-8 text-xs border ${getStatusColor(currentStatus)}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">Draft</SelectItem>
        <SelectItem value="pending_review">Pending Review</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
      </SelectContent>
    </Select>
  );
}
