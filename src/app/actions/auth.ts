"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

function friendlyAuthError(msg: string): string {
  if (msg.toLowerCase().includes("invalid login")) return "Incorrect email or password. Please check your details and try again."
  if (msg.toLowerCase().includes("email not confirmed")) return "Please check your email and click the confirmation link before signing in."
  if (msg.toLowerCase().includes("too many requests")) return "Too many attempts. Please wait a few minutes and try again."
  if (msg.toLowerCase().includes("user already registered")) return "An account with this email already exists. Try signing in instead."
  return "Something went wrong. Please try again."
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: friendlyAuthError(error.message) }
  }

  // Check if student needs onboarding
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, onboarding_complete")
      .eq("id", user.id)
      .single()
      
    if (profile?.role === "administrator") {
      revalidatePath("/", "layout")
      redirect("/admin")
    }
    if (profile?.role === "faculty") {
      revalidatePath("/", "layout")
      redirect("/faculty")
    }
    if (profile?.role === "moderator") {
      revalidatePath("/", "layout")
      redirect("/moderation")
    }
      
    if (profile?.role === "student" && !(profile as any)?.onboarding_complete) {
      revalidatePath("/", "layout")
      redirect("/onboarding")
    }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

  if (error) {
    return { error: friendlyAuthError(error.message) }
  }

  // New students go to onboarding
  revalidatePath("/", "layout")
  redirect("/onboarding")
}

export async function logout() {
  const supabase = await createClient()
  try {
    const { unregisterDeviceAction } = await import("./notifications")
    await unregisterDeviceAction()
  } catch (e) {
    console.warn("Could not deactivate push token on logout:", e)
  }
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
