"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bell, CheckCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { updateUserSettingsAction } from "@/app/actions/settings";
import { requestForToken } from "@/lib/firebase/client";
import { registerDeviceAction } from "@/app/actions/notifications";

export default function NotificationsClient({
  initialSettings,
  userId,
}: {
  initialSettings: any;
  userId: string;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [permissionState, setPermissionState] = useState<string>("Checking...");

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") setPermissionState("🟢 Enabled");
      else if (Notification.permission === "denied") setPermissionState("🔴 Blocked by Browser");
      else setPermissionState("⚪ Not Enabled");
    } else {
      setPermissionState("🔴 Unsupported by Browser");
    }
  }, []);

  const handleEnablePush = async () => {
    try {
      const token = await requestForToken(userId);
      if (token) {
        const ua = navigator.userAgent;
        let os = "Unknown";
        if (ua.indexOf("Win") !== -1) os = "Windows";
        if (ua.indexOf("Mac") !== -1) os = "MacOS";
        if (ua.indexOf("Linux") !== -1) os = "Linux";
        if (ua.indexOf("Android") !== -1) os = "Android";
        if (ua.indexOf("like Mac") !== -1) os = "iOS";

        let browser = "Unknown";
        if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
        else if (ua.indexOf("Safari") !== -1) browser = "Safari";
        else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
        else if (ua.indexOf("Edge") !== -1) browser = "Edge";

        const deviceType = /Mobile|Android|iP(ad|hone)/.test(ua) ? "mobile" : "desktop";

        const response = await registerDeviceAction(token, browser, os, deviceType);
        if (response?.success) {
          setPermissionState("🟢 Enabled");
          // Assume toast is imported or just rely on state
        } else {
          setPermissionState(`🔴 Error: ${response?.error || "Unknown"}`);
        }
      } else {
        setPermissionState("🔴 Blocked or Token Failed");
      }
    } catch (e: any) {
      console.error(e);
      setPermissionState(`🔴 Error: ${e.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const emailNotifs = formData.get("email_notifications") === "on";
    const pushNotifs = formData.get("push_notifications") === "on";

    await updateUserSettingsAction({
      email_notifications: emailNotifs,
      push_notifications: pushNotifs,
    });

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-2xl space-y-6 pb-24 md:pb-8">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Profile
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-extrabold text-foreground flex items-center">
          <Bell className="w-8 h-8 mr-3 text-yellow-500" /> Notifications
        </h1>
        <p className="text-muted-foreground mt-2">
          Control what updates you receive from the platform.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Device Registration</CardTitle>
          <CardDescription>Current device push notification status.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-4 rounded-md border shadow-sm bg-card">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">Push Notifications</p>
                <p className="text-sm font-medium">{permissionState}</p>
                {permissionState.includes("Blocked") && (
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px] md:max-w-xs">
                    Please allow notifications in your browser settings to receive updates.
                  </p>
                )}
              </div>
            </div>
            {permissionState.includes("Not Enabled") && (
              <Button size="sm" onClick={handleEnablePush}>Enable</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose which types of alerts you want to receive globally.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-card">
                <Checkbox id="email_notifications" name="email_notifications" defaultChecked={initialSettings?.email_notifications !== false} />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="email_notifications" className="font-semibold">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important alerts via email.
                  </p>
                </div>
              </div>

              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-card">
                <Checkbox id="push_notifications" name="push_notifications" defaultChecked={initialSettings?.push_notifications !== false} />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="push_notifications" className="font-semibold">Global Push Preference</Label>
                  <p className="text-sm text-muted-foreground">
                    If disabled, no push notifications will be sent to any of your registered devices.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {saved && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-8 bg-green-100 text-green-800 border border-green-300 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium text-sm">Notification preferences saved!</span>
        </div>
      )}
    </div>
  );
}
