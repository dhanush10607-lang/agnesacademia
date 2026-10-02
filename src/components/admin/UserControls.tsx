"use client";

import { useState } from "react";
import { updateUserRoleAction, updateUserStatusAction } from "@/app/actions/admin-users";
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
      className={`text-xs font-medium px-2 py-1 rounded-md transition-colors ${status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
    >
      {isUpdating ? '...' : status.toUpperCase()}
    </button>
  );
}
