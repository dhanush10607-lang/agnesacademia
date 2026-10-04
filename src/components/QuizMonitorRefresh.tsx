"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function QuizMonitorRefresh() {
  const router = useRouter();

  useEffect(() => {
    const interval = window.setInterval(() => router.refresh(), 15000);
    return () => window.clearInterval(interval);
  }, [router]);

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => router.refresh()}>
      <RefreshCw className="mr-2 h-4 w-4" /> Refresh
    </Button>
  );
}
