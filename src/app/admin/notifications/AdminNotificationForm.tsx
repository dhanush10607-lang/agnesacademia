"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Send, AlertTriangle } from "lucide-react";
import { sendAdminNotificationAction } from "@/app/actions/notifications";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminNotificationForm({ departments, programmes, semesters }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("system");
  const [priority, setPriority] = useState("normal");
  const [actionUrl, setActionUrl] = useState("");
  const [sendPush, setSendPush] = useState(true);
  
  // Targeting State
  const [targetDept, setTargetDept] = useState("all");
  const [targetProg, setTargetProg] = useState("all");
  const [targetSem, setTargetSem] = useState("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return toast.error("Title and message are required");
    setShowConfirm(true);
  };

  const handleConfirmSend = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    
    try {
      const res = await sendAdminNotificationAction({
        title,
        message,
        category,
        priority,
        actionUrl,
        sendPush,
        targeting: {
          departmentId: targetDept === "all" ? null : targetDept,
          programmeId: targetProg === "all" ? null : targetProg,
          semesterId: targetSem === "all" ? null : targetSem,
        }
      });
      
      if (res.success) {
        toast.success("Notification broadcasted successfully!");
        setTitle("");
        setMessage("");
        setActionUrl("");
      } else {
        toast.error(res.error || "Failed to send notification");
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title <span className="text-red-500">*</span></Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Urgent System Maintenance" required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System Update</SelectItem>
                  <SelectItem value="academic">Academic Update</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="urgent">Urgent Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message Body <span className="text-red-500">*</span></Label>
            <Textarea 
              id="message" 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              placeholder="Enter the notification content..." 
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="url">Deep Link URL (Optional)</Label>
              <Input id="url" value={actionUrl} onChange={e => setActionUrl(e.target.value)} placeholder="/notices/123" />
            </div>
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical (Emergency)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h3 className="font-semibold text-lg">Target Audience</h3>
          <p className="text-sm text-muted-foreground">Leave as "All" to broadcast to the entire college.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={targetDept} onValueChange={setTargetDept}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Programme</Label>
              <Select value={targetProg} onValueChange={setTargetProg}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programmes</SelectItem>
                  {programmes.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={targetSem} onValueChange={setTargetSem}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>Sem {s.number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch id="push-toggle" checked={sendPush} onCheckedChange={setSendPush} />
            <Label htmlFor="push-toggle" className="flex flex-col">
              <span className="font-medium">Send Push Notification</span>
              <span className="text-xs text-muted-foreground">Deliver to active devices instantly.</span>
            </Label>
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Processing..." : "Review & Send"}
          </Button>
        </div>
      </form>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Confirm Broadcast
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send this notification? It will be permanently recorded and sent to the selected target audience.
              {priority === 'critical' && <span className="block mt-2 font-bold text-red-500">Warning: This is marked as a CRITICAL priority push.</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSend} className={priority === 'critical' ? 'bg-red-600 hover:bg-red-700' : ''}>
              Confirm Send
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
