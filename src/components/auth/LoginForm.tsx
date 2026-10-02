"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Fingerprint, Mail, Lock, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      router.refresh()
      router.push("/dashboard")
    }
  }

  async function onPasskeyLogin() {
    setIsPasskeyLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.signInWithPasskey()
    
    if (error) {
      setError(error.message)
      setIsPasskeyLoading(false)
    } else {
      router.refresh()
      router.push("/dashboard")
    }
  }

  return (
    <div className="grid gap-6 w-full">
      <form onSubmit={onSubmit}>
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-semibold text-foreground/90">Email Address</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading || isPasskeyLoading}
                required
                className="pl-10 h-12 rounded-xl border-muted-foreground/20 bg-muted/30 focus-visible:bg-background transition-colors text-base"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-semibold text-foreground/90">Password</Label>
              {/* Optional: Add forgot password link here in the future */}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading || isPasskeyLoading}
                required
                className="pl-10 h-12 rounded-xl border-muted-foreground/20 bg-muted/30 focus-visible:bg-background transition-colors text-base font-mono"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading || isPasskeyLoading}
            className="h-12 w-full rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 font-semibold text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        type="button" 
        disabled={isLoading || isPasskeyLoading}
        onClick={onPasskeyLogin}
        className="h-12 w-full rounded-xl font-semibold border-muted-foreground/20 hover:bg-muted/50 transition-all active:scale-[0.98]"
      >
        {isPasskeyLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Fingerprint className="mr-2 h-5 w-5 text-primary" />
        )}
        Sign In with Passkey
      </Button>
    </div>
  )
}
