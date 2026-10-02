"use client";

import { useState } from "react";
import { moderateResourceAction } from "@/app/actions/moderation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";

export function ModerationActionArea({ resourceId }: { resourceId: string }) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDetails, setRejectDetails] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    const result = await moderateResourceAction(resourceId, 'approve');
    setIsApproving(false);
    
    if (result.success) {
      alert("Resource approved successfully!");
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRejecting(true);
    
    const fullReason = rejectDetails ? `${rejectReason}: ${rejectDetails}` : rejectReason;
    const result = await moderateResourceAction(resourceId, 'reject', fullReason);
    
    setIsRejecting(false);
    
    if (result.success) {
      setDialogOpen(false);
      alert("Resource rejected successfully!");
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <Button 
        onClick={handleApprove} 
        disabled={isApproving || isRejecting}
        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        {isApproving ? "Approving..." : "Approve"}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger>
          <Button 
            variant="destructive" 
            disabled={isApproving || isRejecting}
            className="w-full sm:w-auto"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Resource</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this submission. The student will be able to see this reason.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReject} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select value={rejectReason} onValueChange={(val) => setRejectReason(val || "")} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Incorrect subject">Incorrect subject</SelectItem>
                  <SelectItem value="Duplicate resource">Duplicate resource</SelectItem>
                  <SelectItem value="Poor quality">Poor quality</SelectItem>
                  <SelectItem value="Invalid file">Invalid file</SelectItem>
                  <SelectItem value="Copyright concern">Copyright concern</SelectItem>
                  <SelectItem value="Wrong academic information">Wrong academic information</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Additional Details (Optional)</Label>
              <Textarea 
                value={rejectDetails} 
                onChange={(e: any) => setRejectDetails(e.target.value)}
                placeholder="Provide any additional feedback..."
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="destructive" disabled={isRejecting || !rejectReason}>
                {isRejecting ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
