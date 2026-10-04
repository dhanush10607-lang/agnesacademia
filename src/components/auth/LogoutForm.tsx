"use client";

import { useFormStatus } from "react-dom";
import type { FormEventHandler, ReactNode } from "react";
import { LogOut, LoaderCircle } from "lucide-react";
import { logout } from "@/app/actions/auth";

function LogoutTransition() {
  const { pending } = useFormStatus();

  if (!pending) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm animate-in fade-in duration-200"
      role="status"
      aria-live="polite"
      aria-label="Signing out"
    >
      <div className="flex w-full max-w-xs flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LogOut className="h-7 w-7 animate-pulse motion-reduce:animate-none" />
          <LoaderCircle className="absolute -right-1 -top-1 h-6 w-6 animate-spin motion-reduce:animate-none" />
        </div>
        <p className="text-lg font-semibold">Signing you out</p>
        <p className="mt-1 text-sm text-muted-foreground">Please wait a moment…</p>
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}

export function LogoutForm({
  children,
  className,
  onSubmit,
}: {
  children: ReactNode;
  className?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <form action={logout} className={className} onSubmit={onSubmit}>
      {children}
      <LogoutTransition />
    </form>
  );
}
