"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, KeyRound, MonitorSmartphone, Shield } from "lucide-react";
import Link from "next/link";
import { updatePasswordAction, signOutOtherSessionsAction } from "@/app/actions/security";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";

type ActiveSession = {
  session_id: string;
  browser: string;
  operating_system: string;
  device_type: string;
  last_seen_at: string;
};

export function SecurityClient({
  email,
  supportsPassword,
  activeSessions: initialActiveSessions,
  activeSessionsError,
}: {
  email: string | null;
  supportsPassword: boolean;
  activeSessions: ActiveSession[];
  activeSessionsError: boolean;
}) {
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSigningOutOtherSessions, setIsSigningOutOtherSessions] = useState(false);
  const [sessionMessage, setSessionMessage] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [activeSessions, setActiveSessions] = useState(initialActiveSessions);

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordError("");
    setPasswordMessage("");

    try {
      const form = event.currentTarget;
      const result = await updatePasswordAction(new FormData(form));
      if (!result.success) {
        setPasswordError(result.error || "Could not update your password. Please try again.");
        return;
      }

      form.reset();
      setPasswordMessage("Your password was updated successfully.");
    } catch (error) {
      console.error("Password update request failed:", error);
      setPasswordError("Could not update your password. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  async function handleSignOutOtherSessions() {
    if (!window.confirm("Sign out of all other devices? This device will stay signed in.")) return;

    setIsSigningOutOtherSessions(true);
    setSessionError("");
    setSessionMessage("");

    try {
      const result = await signOutOtherSessionsAction();
      if (!result.success) {
        setSessionError(result.error || "Could not sign out other devices. Please try again.");
        return;
      }
      setActiveSessions([]);
      setSessionMessage("Other sessions have been signed out. This device remains signed in.");
    } catch (error) {
      console.error("Other session sign-out request failed:", error);
      setSessionError("Could not sign out other devices. Please try again.");
    } finally {
      setIsSigningOutOtherSessions(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 px-4 py-8 pb-24 md:pb-8">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Profile
      </Link>

      <div>
        <h1 className="flex items-center text-3xl font-heading font-extrabold text-foreground">
          <Shield className="mr-3 h-8 w-8 text-red-500" /> Security
        </h1>
        <p className="mt-2 text-muted-foreground">Keep your account secure and manage your sessions.</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center">
            <KeyRound className="mr-2 h-5 w-5 text-muted-foreground" /> Change Password
          </CardTitle>
          <CardDescription>Verify your current password before choosing a new one.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {supportsPassword ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input id="current_password" name="current_password" type="password" autoComplete="current-password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input id="new_password" name="new_password" type="password" autoComplete="new-password" minLength={8} required />
                <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input id="confirm_password" name="confirm_password" type="password" autoComplete="new-password" minLength={8} required />
              </div>
              {passwordError && <p role="alert" className="text-sm text-destructive">{passwordError}</p>}
              {passwordMessage && <p role="status" className="text-sm text-green-700 dark:text-green-400">{passwordMessage}</p>}
              <Button type="submit" disabled={isUpdatingPassword} className="w-full">
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          ) : (
            <div className="rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
              This account uses a sign-in provider{email ? ` (${email})` : ""}. Manage its password through that provider.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center">
            <MonitorSmartphone className="mr-2 h-5 w-5 text-muted-foreground" /> Active Sessions
          </CardTitle>
          <CardDescription>
            {activeSessionsError
              ? "The session list could not be loaded."
              : `${activeSessions.length + 1} active ${activeSessions.length + 1 === 1 ? "session" : "sessions"} detected.`}
            {" "}Sign out sessions on other devices without ending this session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
            <div className="min-w-0">
              <p className="text-sm font-semibold">Current Session</p>
              <p className="mt-0.5 break-all text-xs text-muted-foreground">Active now{email ? ` · ${email}` : ""}</p>
            </div>
            <span className="shrink-0 rounded bg-green-100 px-2 py-1 text-xs font-bold uppercase text-green-700 dark:bg-green-900/50 dark:text-green-400">
              Active
            </span>
          </div>
          {activeSessions.map((session) => (
            <div
              key={session.session_id}
              className="flex items-center justify-between gap-4 rounded-lg border p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {session.browser} on {session.operating_system}
                  <span className="ml-2 font-normal capitalize text-muted-foreground">
                    ({session.device_type})
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Last active {formatDistanceToNow(new Date(session.last_seen_at), { addSuffix: true })}
                </p>
              </div>
              <span className="shrink-0 rounded bg-green-100 px-2 py-1 text-xs font-bold uppercase text-green-700 dark:bg-green-900/50 dark:text-green-400">
                Active
              </span>
            </div>
          ))}
          {activeSessionsError && (
            <p role="alert" className="text-sm text-destructive">
              We couldn&apos;t retrieve other active sessions. Please refresh and try again.
            </p>
          )}
          {!activeSessionsError && activeSessions.length === 0 && (
            <p className="text-sm text-muted-foreground">No other active devices were detected.</p>
          )}
          {!activeSessionsError && (
            <p className="text-xs text-muted-foreground">
              Sessions are considered active if they have checked in within the last 3 minutes.
            </p>
          )}
          {sessionError && <p role="alert" className="text-sm text-destructive">{sessionError}</p>}
          {sessionMessage && (
            <p role="status" className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
              <CheckCircle className="h-4 w-4" /> {sessionMessage}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={isSigningOutOtherSessions}
            onClick={handleSignOutOtherSessions}
            className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
          >
            {isSigningOutOtherSessions ? "Signing out other devices..." : "Sign Out of All Other Devices"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
