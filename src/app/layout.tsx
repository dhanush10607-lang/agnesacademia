import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NotificationPrompt } from "@/components/notifications/NotificationPrompt";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./Providers";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGNES ACADEMIA | St. Agnes College",
  description: "One College. Every Course. Every Resource. The central academic ecosystem for St. Agnes College (Autonomous), Mangaluru.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let appearanceSettings = {};

  if (user) {
    const { data: settings, error } = await supabase
      .from("user_settings")
      .select("theme, text_size, reduced_motion, high_contrast")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading appearance settings:", error);
    } else if (settings) {
      appearanceSettings = settings;
    }
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Providers settings={appearanceSettings}>
          <Navbar />
          <main className="flex-1 min-w-0 w-full">{children}</main>
          <Footer />
          <NotificationPrompt />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
