"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Fingerprint, Loader2, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function PasskeySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  async function onRegisterPasskey() {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      const authObj = supabase.auth as any;
      
      // The experimental Passkeys API uses registerPasskey() or enroll() depending on version
      let res;
      if (typeof authObj.registerPasskey === 'function') {
        res = await authObj.registerPasskey();
      } else {
        throw new Error("Passkeys are not properly supported in this version of the Supabase SDK. Please ensure experimental passkeys are enabled in your client.");
      }
      
      if (res?.error) throw res.error;
      
      setSuccess(true)
    } catch (e: any) {
      setError(e.message || "Failed to register passkey. Ensure Passkeys are enabled in your Supabase Dashboard.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4 p-4 border rounded-xl bg-card">
      <h3 className="text-lg font-semibold flex items-center mb-2">
        <Fingerprint className="h-5 w-5 mr-2" />
        Passkey Authentication
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Set up a passkey to sign in securely with your device's biometrics or security key, without needing a password.
      </p>
      
      {error && <div className="text-sm text-destructive mb-3">{error}</div>}
      
      {success ? (
        <div className="flex items-center text-sm text-green-600 font-medium">
          <CheckCircle2 className="h-4 w-4 mr-2" /> Passkey registered successfully!
        </div>
      ) : (
        <Button variant="outline" onClick={onRegisterPasskey} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register New Passkey
        </Button>
      )}
    </div>
  )
}
