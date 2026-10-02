"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Palette, CheckCircle, Moon, Sun, Monitor } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    // In a real app, this would also save to user_preferences table via Server Action
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!mounted) return null;

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
            value={theme || "system"} 
            onValueChange={(val) => setTheme(val)}
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
            <RadioGroup defaultValue="standard" className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="ts-standard" />
                <Label htmlFor="ts-standard" className="text-sm">Standard (Default)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="ts-large" />
                <Label htmlFor="ts-large" className="text-base">Large</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="extra" id="ts-extra" />
                <Label htmlFor="ts-extra" className="text-lg">Extra Large</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium leading-none">Motion</h4>
            <RadioGroup defaultValue="full" className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="m-full" />
                <Label htmlFor="m-full">Full Motion (Animations Enabled)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reduced" id="m-reduced" />
                <Label htmlFor="m-reduced">Reduced Motion</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} className="w-full md:w-auto">
          Save Preferences
        </Button>
        {saved && (
          <span className="flex items-center text-sm text-green-600 dark:text-green-400 animate-in fade-in">
            <CheckCircle className="w-4 h-4 mr-1.5" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
