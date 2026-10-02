"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Check } from "lucide-react";

export function ProcessAIButton({ resourceId, fileType }: { resourceId: string, fileType: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleProcess = async () => {
    if (fileType !== 'application/pdf') {
      alert("Currently, only PDFs can be processed for AI Vector Search.");
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/admin/process-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource_id: resourceId })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      alert("Failed to process resource: " + err.message);
      setStatus('error');
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleProcess} 
      disabled={status === 'loading' || status === 'success' || fileType !== 'application/pdf'}
      className="text-xs flex items-center gap-1 w-full justify-start mt-2"
      title={fileType !== 'application/pdf' ? 'Only PDFs are supported' : 'Process document for AI Assistant Retrieval'}
    >
      {status === 'idle' && <><Sparkles className="w-3 h-3 text-primary" /> Process for AI</>}
      {status === 'loading' && <><Loader2 className="w-3 h-3 animate-spin" /> Processing...</>}
      {status === 'success' && <><Check className="w-3 h-3 text-green-500" /> Indexed!</>}
      {status === 'error' && <><Sparkles className="w-3 h-3 text-destructive" /> Failed</>}
    </Button>
  );
}
