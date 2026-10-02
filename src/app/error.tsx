"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log securely — never expose raw error to DOM
    console.error("Page error:", error.message);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>
      <h1 className="text-2xl md:text-3xl font-heading font-extrabold mb-3">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md mb-2 leading-relaxed">
        We couldn't load this page. This is usually a temporary issue.
      </p>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        Try refreshing the page. If the problem continues, please contact your administrator.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
          <Home className="w-4 h-4" /> Go Home
        </Link>
        <Link href="/search" className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
          <Search className="w-4 h-4" /> Search Resources
        </Link>
      </div>
    </div>
  );
}
