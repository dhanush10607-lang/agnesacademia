"use client";

import { useState, useEffect } from "react";
import { app, requestForToken } from "@/lib/firebase/client";
import { registerDeviceAction } from "@/app/actions/notifications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { getMessaging, onMessage } from "firebase/messaging";
import { toast } from "sonner"; // Assuming sonner is used for toasts, if not I'll just use a generic approach

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    // Check if we already asked
    const hasAsked = localStorage.getItem("agnes_push_prompted");
    const permission = "Notification" in window ? Notification.permission : "denied";
    
    if (!hasAsked && permission === "default") {
      // Small delay so it doesn't pop up instantly on first load
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }

    // Set up foreground listener if permission is granted
    // If permission was denied, show prompt to allow retry
    if (permission === "denied") {
      setShowPrompt(true);
    }
    if (permission === "granted" && "serviceWorker" in navigator) {
      try {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
          toast.message(payload.notification?.title || "New Notification", {
            description: payload.notification?.body,
            icon: <Bell className="w-4 h-4" />
          });
        });
      } catch (e) {
        console.warn("Foreground listener setup failed:", e);
      }
    }
  }, []);

  const handleEnable = async () => {
    setIsRegistering(true);
    try {
      const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      // Permission not granted – keep prompt visible for retry
      setShowPrompt(true);
      setIsRegistering(false);
      return;
    }
    const token = await requestForToken();
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

        await registerDeviceAction(token, browser, os, deviceType);
        localStorage.setItem("agnes_push_prompted", "true");
        setShowPrompt(false);
      } else {
        // Permission was denied – keep the prompt visible so the user can retry after changing browser settings
        // Do NOT store "denied" in localStorage; allow future attempts
        setShowPrompt(true);
      }
    } catch (e) {
      console.error(e);
    }
    setIsRegistering(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("agnes_push_prompted", "true"); // Don't ask again for a while
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="border-border shadow-lg bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <CardHeader className="pb-3 pt-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Stay Updated</CardTitle>
            </div>
            <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <CardDescription className="pt-2">
            Receive important college notices, exam updates, assignment deadlines and events directly on your device.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end gap-2 pb-4">
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            Not Now
          </Button>
          <Button size="sm" onClick={handleEnable} disabled={isRegistering}>
            {isRegistering ? "Enabling..." : "Enable Notifications"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
