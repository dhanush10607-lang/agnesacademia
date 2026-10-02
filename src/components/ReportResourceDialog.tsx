"use client";

import { useState } from "react";
import { reportResourceAction } from "@/app/actions/report";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Flag } from "lucide-react";

interface ReportResourceDialogProps {
  itemType: 'note' | 'question_paper' | 'question_bank' | 'question' | 'syllabus' | 'video' | 'other';
  itemId: string;
}

export function ReportResourceDialog({ itemType, itemId }: ReportResourceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await reportResourceAction(itemType, itemId, reason, details);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setDialogOpen(false);
        setSuccess(false);
        setReason("");
        setDetails("");
      }, 2000);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
          <Flag className="w-4 h-4 mr-2" />
          Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-500">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Report Resource
          </DialogTitle>
          <DialogDescription>
            Help us keep the platform high quality. Tell us what's wrong with this resource.
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="py-6 text-center text-green-600 dark:text-green-400 font-medium">
            Report submitted successfully. Thank you!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select value={reason} onValueChange={(val) => setReason(val || "")} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Incorrect information">Incorrect information</SelectItem>
                  <SelectItem value="Wrong subject">Wrong subject</SelectItem>
                  <SelectItem value="Duplicate">Duplicate</SelectItem>
                  <SelectItem value="Broken file">Broken file</SelectItem>
                  <SelectItem value="Inappropriate content">Inappropriate content</SelectItem>
                  <SelectItem value="Copyright concern">Copyright concern</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Additional Details (Optional)</Label>
              <Textarea 
                value={details} 
                onChange={(e: any) => setDetails(e.target.value)}
                placeholder="Provide more specifics so we can investigate..."
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting || !reason}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
