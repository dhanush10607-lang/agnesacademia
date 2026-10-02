"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, ShieldCheck, User, Image as ImageIcon } from "lucide-react";
import { updatePersonalProfileAction } from "@/app/actions/profile";

export function PersonalInfoForm({ 
  profile, 
  isNameManaged 
}: { 
  profile: any;
  isNameManaged: boolean;
}) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await updatePersonalProfileAction(formData);
    
    if (res.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setMessage({ type: 'error', text: res.error || 'An error occurred' });
    }
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="full_name">Full Name</Label>
          {isNameManaged && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center bg-secondary/50 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 mr-1" /> Managed by College
            </span>
          )}
        </div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            id="full_name" 
            name="full_name" 
            defaultValue={profile.full_name || ""} 
            readOnly={isNameManaged}
            className={`pl-9 ${isNameManaged ? "bg-muted cursor-not-allowed" : ""}`}
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="email">Email Address</Label>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center bg-secondary/50 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 mr-1" /> Authentication Email
          </span>
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            id="email" 
            name="email" 
            defaultValue={profile.email || ""} 
            readOnly
            className="pl-9 bg-muted cursor-not-allowed" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar_url">Profile Photo URL <span className="text-muted-foreground font-normal">(Optional)</span></Label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            id="avatar_url" 
            name="avatar_url" 
            type="url"
            placeholder="https://example.com/avatar.jpg"
            defaultValue={profile.avatar_url || ""} 
            className="pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground">Provide a link to an image to use as your avatar.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number <span className="text-muted-foreground font-normal">(Optional)</span></Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            id="phone" 
            name="phone" 
            type="tel"
            placeholder="+1 (555) 000-0000"
            defaultValue={profile.phone || ""} 
            className="pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground">Used for urgent academic alerts only.</p>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
