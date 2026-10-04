"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getMessagingForUser, requestForToken } from "@/lib/firebase/client";
import { registerDeviceAction } from "@/app/actions/notifications";
import { recordCurrentSessionAction } from "@/app/actions/sessions";
import { createClient } from "@/lib/supabase/client";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { onMessage, isSupported } from "firebase/messaging";
import { toast } from "sonner";

// localStorage keys
const PROMPTED_KEY = "agnes_push_prompted";
const REG_KEY = "agnes_push_registration"; // { userId, token, at }
const RE_REGISTER_MS = 24 * 60 * 60 * 1000; // refresh last_seen once a day

function getDeviceInfo() {
  const ua = navigator.userAgent;
  let os = "Unknown";
  // Order matters: Android UA contains "Linux", iOS UA contains "Mac"
  if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Win/i.test(ua)) os = "Windows";
  else if (/Mac/i.test(ua)) os = "MacOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Unknown";
  // Order matters: Edge UA contains "Chrome", Chrome UA contains "Safari"
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\//.test(ua)) browser = "Opera";
  else if (/Firefox/.test(ua)) browser = "Firefox";
  else if (/Chrome/.test(ua)) browser = "Chrome";
  else if (/Safari/.test(ua)) browser = "Safari";

  const deviceType = /Mobile|Android|iP(ad|hone|od)/.test(ua) ? "mobile" : "desktop";
  return { os, browser, deviceType };
}

function readReg(): { userId: string; token: string; at: number } | null {
  try { return JSON.parse(localStorage.getItem(REG_KEY) || "null"); } catch { return null; }
}

// Set by registerDeviceAction, deleted by logout. If it's missing/different,
// the server has (or may have) deactivated this device -> register again.
function deviceCookieMatches(token: string) {
  return document.cookie.split("; ").some((c) => c === `agnes_fcm_token=${encodeURIComponent(token)}` || c === `agnes_fcm_token=${token}`);
}

async function registerToken(userId: string, token: string) {
  const { os, browser, deviceType } = getDeviceInfo();
  const res = await registerDeviceAction(token, browser, os, deviceType);
  if (res?.success) {
    localStorage.setItem(REG_KEY, JSON.stringify({ userId, token, at: Date.now() }));
  }
  return res;
}

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();

  // Track the logged-in user (handles login, logout and switching accounts
  // without a full page reload, since the root layout never remounts).
  // Login/logout happen in server actions, so also re-check on navigation.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    void isSupported()
      .then((supported) => {
        if (!supported || cancelled) return;
        unsubscribe = onMessage(getMessagingForUser(userId), (payload) => {
          toast.message(payload.notification?.title || "New Notification", {
            description: payload.notification?.body,
            icon: <Bell className="w-4 h-4" />,
          });
        });
      })
      .catch((error) => console.warn("Foreground listener setup failed:", error));

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const { os, browser, deviceType } = getDeviceInfo();
    let recording = false;

    const recordSession = async () => {
      if (recording || document.visibilityState !== "visible") return;
      recording = true;
      try {
        const result = await recordCurrentSessionAction(browser, os, deviceType);
        if (!result.success) {
          console.error("Could not record the current session:", result.error);
        }
      } catch (error) {
        console.error("Could not record the current session:", error);
      } finally {
        recording = false;
      }
    };

    void recordSession();
    const heartbeat = window.setInterval(recordSession, 60_000);
    document.addEventListener("visibilitychange", recordSession);

    return () => {
      window.clearInterval(heartbeat);
      document.removeEventListener("visibilitychange", recordSession);
    };
  }, [userId]);

  // Whenever the user changes, make sure THIS device's token is bound to THEM.
  useEffect(() => {
    if (!userId) {
      setShowPrompt(false);
      return;
    }
    if (!("Notification" in window)) return;

    const permission = Notification.permission;

    if (permission === "default") {
      if (!localStorage.getItem(PROMPTED_KEY)) {
        const timer = setTimeout(() => setShowPrompt(true), 5000);
        return () => clearTimeout(timer);
      }
      return;
    }

    if (permission !== "granted") return;

    let cancelled = false;
    (async () => {
      if (!(await isSupported())) return;

      const previousRegistration = readReg();
      const switchedAccounts =
        previousRegistration !== null && previousRegistration.userId !== userId;
      const token = await requestForToken(userId);
      if (cancelled || !token) return;

      if (switchedAccounts && token === previousRegistration.token) {
        console.warn("Could not generate a new push token for the signed-in user.");
        return;
      }

      const prev = previousRegistration;
      const needsRegister =
        !prev ||
        prev.token !== token ||            // FCM rotated the token
        !deviceCookieMatches(token) ||     // logged out since (device was deactivated)
        Date.now() - prev.at > RE_REGISTER_MS;

      if (needsRegister) {
        const res = await registerToken(userId, token);
        if (!res?.success) console.warn("Push registration failed:", res?.error);
      }
    })().catch(console.warn);

    return () => { cancelled = true; };
  }, [userId, pathname]);

  const handleEnable = async () => {
    if (!userId) return;
    setIsRegistering(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        toast.error("Notifications are blocked. Allow them in your browser's site settings.");
        localStorage.setItem(PROMPTED_KEY, "true");
        setShowPrompt(false);
        return;
      }
      const token = await requestForToken(userId);
      if (!token) {
        toast.error("Could not generate push token. Please check browser permissions.");
        return;
      }
      const response = await registerToken(userId, token);
      if (response?.success) {
        localStorage.setItem(PROMPTED_KEY, "true");
        setShowPrompt(false);
        toast.success("Push notifications enabled!");
      } else {
        toast.error("Failed to register device: " + (response?.error || "Unknown error"));
      }
    } catch (e: any) {
      console.error(e);
      toast.error("An error occurred: " + (e.message || "Unknown error"));
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(PROMPTED_KEY, "true");
    setShowPrompt(false);
  };

  if (!showPrompt || !userId) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 left-4 md:left-auto z-50 md:w-full md:max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="border-border shadow-lg bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <CardHeader className="pb-3 pt-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Stay Updated</CardTitle>
            </div>
            <button id="push-prompt-close" onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <CardDescription className="pt-2">
            Receive important college notices, exam updates, assignment deadlines and events directly on your device.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end gap-2 pb-4">
          <Button id="push-prompt-dismiss" variant="ghost" size="sm" onClick={handleDismiss}>
            Not Now
          </Button>
          <Button id="push-prompt-enable" size="sm" onClick={handleEnable} disabled={isRegistering}>
            {isRegistering ? "Enabling..." : "Enable Notifications"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
