import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  
  // Fetch settings from our app_settings table (created in Phase 8)
  const { data: settings } = await supabase.from("app_settings").select("*");
  
  const getValue = (key: string) => {
    const setting = settings?.find(s => s.key === key);
    return setting ? JSON.parse(setting.value) : '';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold mb-2 flex items-center">
          <Settings className="w-8 h-8 mr-3 text-primary" /> Platform Settings
        </h1>
        <p className="text-muted-foreground">Configure global application behavior and limits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border shadow-sm">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle>Resource Settings</CardTitle>
            <CardDescription>Rules for uploading and moderating academic content.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label>Maximum Upload Size (MB)</Label>
                <Input defaultValue={getValue('max_upload_size_mb') || 50} type="number" />
                <p className="text-xs text-muted-foreground">The absolute maximum file size allowed for a single upload.</p>
              </div>
              
              <div className="space-y-2">
                <Label>Faculty Bypass Moderation</Label>
                <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" defaultValue={getValue('faculty_bypass_moderation') ? "true" : "false"}>
                  <option value="true">Enabled - Published immediately</option>
                  <option value="false">Disabled - Requires admin review</option>
                </select>
                <p className="text-xs text-muted-foreground">If enabled, faculty uploads bypass the moderation queue.</p>
              </div>

              <div className="space-y-2">
                <Label>Allowed Resource Types</Label>
                <Input defaultValue={getValue('allowed_mime_types') || "application/pdf,image/png,image/jpeg,application/zip"} />
              </div>

              <Button disabled className="w-full"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle>Quiz & Assessment Defaults</CardTitle>
            <CardDescription>Default parameters for new quizzes.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label>Default Passing Score (%)</Label>
                <Input defaultValue={getValue('default_passing_score') || 40} type="number" min="1" max="100" />
              </div>
              
              <div className="space-y-2">
                <Label>Max Quiz Attempts (Default)</Label>
                <Input defaultValue={getValue('default_max_attempts') || 3} type="number" />
              </div>

              <Button disabled className="w-full"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
