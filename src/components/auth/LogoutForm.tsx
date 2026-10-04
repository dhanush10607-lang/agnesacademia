"use client";

import { useFormStatus } from "react-dom";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { LogOut, LoaderCircle, ShieldCheck } from "lucide-react";
import { logout } from "@/app/actions/auth";

function LogoutTransition() {
  const { pending } = useFormStatus();

  if (!pending || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-5 backdrop-blur-md animate-in fade-in duration-200">
      <section
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-7 text-center shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-300 sm:p-9"
        role="status"
        aria-live="polite"
        aria-label="Signing out"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <div className="absolute inset-2 rounded-2xl border border-primary/20 animate-pulse motion-reduce:animate-none" />
          <LogOut className="h-8 w-8" />
          <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-card bg-primary text-primary-foreground shadow-sm">
            <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" />
          </span>
        </div>
        <p className="text-xl font-bold tracking-tight text-foreground">Signing you out</p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
          We&apos;re securely closing your session. This should only take a moment.
        </p>
        <div className="mt-7 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Your account is being signed out securely</span>
        </div>
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/5 rounded-full bg-primary animate-[logout-progress_1.4s_ease-in-out_infinite] motion-reduce:animate-none" />
        </div>
      </section>
    </div>,
    document.body
  );
}

export function LogoutForm({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <form action={logout} className={className}>
      {children}
      <LogoutTransition />
    </form>
  );
}
