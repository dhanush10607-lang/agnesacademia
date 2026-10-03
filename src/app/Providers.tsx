"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";

export type AppearanceSettings = {
  theme?: string | null;
  text_size?: string | null;
  reduced_motion?: boolean | null;
  high_contrast?: boolean | null;
};

export function Providers({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: AppearanceSettings;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={settings.theme || "system"}
      enableSystem
      disableTransitionOnChange
    >
      <AppearancePreferences settings={settings} />
      {children}
    </ThemeProvider>
  );
}

function AppearancePreferences({ settings }: { settings: AppearanceSettings }) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.textSize = settings.text_size === "large" ? "large" : "standard";
    root.dataset.reducedMotion = settings.reduced_motion ? "true" : "false";
    root.dataset.highContrast = settings.high_contrast ? "true" : "false";
  }, [settings.high_contrast, settings.reduced_motion, settings.text_size]);

  return null;
}
