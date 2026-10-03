"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Palette, CheckCircle, Moon, Sun, Monitor } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { updateUserSettingsAction } from "@/app/actions/settings";
import type { AppearanceSettings } from "@/app/Providers";

export default function AppearanceClient({ initialSettings }: { initialSettings: AppearanceSettings }) {
  const { setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "system">(
    initialSettings.theme === "light" || initialSettings.theme === "dark" || initialSettings.theme === "system"
      ? initialSettings.theme
      : "system"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [textSize, setTextSize] = useState(initialSettings.text_size || "standard");
  const [reducedMotion, setReducedMotion] = useState(initialSettings.reduced_motion ? "true" : "false");
  const [highContrast, setHighContrast] = useState(initialSettings.high_contrast ? "true" : "false");

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.textSize = textSize;
    root.dataset.reducedMotion = reducedMotion;
    root.dataset.highContrast = highContrast;
  }, [textSize, reducedMotion, highContrast]);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSaved(false);

    try {
      const result = await updateUserSettingsAction({
        theme: selectedTheme,
        text_size: textSize as "standard" | "large",
        reduced_motion: reducedMotion === "true",
        high_contrast: highContrast === "true",
      });

      if (!result.success) {
        setError(result.error || "Could not save appearance preferences. Please try again.");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      console.error("Appearance preferences save failed:", saveError);
      setError("Could not save appearance preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-2xl space-y-6 pb-24 md:pb-8">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Profile
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-extrabold text-foreground flex items-center">
          <Palette className="w-8 h-8 mr-3 text-orange-500" /> Appearance
        </h1>
        <p className="text-muted-foreground mt-2">
          Customize how AGNES ACADEMIA looks on your device.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Select your preferred color theme.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup 
            value={selectedTheme}
            onValueChange={(val) => {
              if (val === "light" || val === "dark" || val === "system") {
                setSelectedTheme(val);
                setTheme(val);
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Sun className="mb-3 h-6 w-6" />
                Light
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Moon className="mb-3 h-6 w-6" />
                Dark
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="system" className="peer sr-only" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Monitor className="mb-3 h-6 w-6" />
                System
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Accessibility Options</CardTitle>
          <CardDescription>Improve legibility and reduce animations.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium leading-none">Text Size</h4>
            <RadioGroup value={textSize} onValueChange={setTextSize} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="ts-standard" />
                <Label htmlFor="ts-standard" className="text-sm">Standard (Default)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="ts-large" />
                <Label htmlFor="ts-large" className="text-sm">Large</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium leading-none">Reduced Motion</h4>
            <RadioGroup value={reducedMotion} onValueChange={setReducedMotion} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="rm-off" />
                <Label htmlFor="rm-off" className="text-sm">Off (Allow animations)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="rm-on" />
                <Label htmlFor="rm-on" className="text-sm">On (Minimize animations)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium leading-none">High Contrast</h4>
            <RadioGroup value={highContrast} onValueChange={setHighContrast} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="hc-off" />
                <Label htmlFor="hc-off" className="text-sm">Off</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="hc-on" />
                <Label htmlFor="hc-on" className="text-sm">On (Increase contrast ratio)</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">{error}</p>
      )}

      {saved && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-8 bg-green-100 text-green-800 border border-green-300 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium text-sm">Appearance preferences saved!</span>
        </div>
      )}
    </div>
  );
}
