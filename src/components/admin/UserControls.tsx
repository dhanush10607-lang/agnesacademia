"use client";

import { useState } from "react";
import { updateUserRoleAction, updateUserStatusAction, toggleAcademicLockAction } from "@/app/actions/admin-users";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function UserRoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async (newRole: string | null) => {
    if (!newRole) return;
    setIsUpdating(true);
    const res = await updateUserRoleAction(userId, newRole);
    if (!res.success) {
      alert(res.error);
    }
    setIsUpdating(false);
  };

  return (
    <Select defaultValue={currentRole} onValueChange={handleRoleChange} disabled={isUpdating}>
      <SelectTrigger className="w-[140px] h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="student">Student</SelectItem>
        <SelectItem value="faculty">Faculty</SelectItem>
        <SelectItem value="moderator">Moderator</SelectItem>
        <SelectItem value="administrator">Administrator</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function UserStatusToggle({ userId, currentStatus }: { userId: string, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const status = currentStatus || 'active';

  const toggleStatus = async () => {
    setIsUpdating(true);
    const newStatus = status === 'active' ? 'suspended' : 'active';
    const res = await updateUserStatusAction(userId, newStatus);
    if (!res.success) {
      alert(res.error);
    }
    setIsUpdating(false);
  };

  return (
    <button 
      onClick={toggleStatus}
      disabled={isUpdating}
      className={`text-xs font-medium px-2 py-1 rounded-md transition-colors ${status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400'}`}
    >
      {isUpdating ? '...' : status.toUpperCase()}
    </button>
  );
}

export function AcademicLockToggle({ userId, isLocked }: { userId: string, isLocked: boolean }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleLock = async () => {
    setIsUpdating(true);
    const res = await toggleAcademicLockAction(userId, !isLocked);
    if (!res.success) {
      alert(res.error || "Failed to update lock status");
    }
    setIsUpdating(false);
  };

  return (
    <button 
      onClick={toggleLock}
      disabled={isUpdating}
      className={`text-xs font-medium px-2 py-1 rounded-md transition-colors border ${isLocked ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
    >
      {isUpdating ? '...' : (isLocked ? '🔒 Locked' : '🔓 Editable')}
    </button>
  );
}
