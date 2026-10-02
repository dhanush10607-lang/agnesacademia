import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  BookOpen, Search, Bookmark, LayoutDashboard, Home,
  Sparkles, GraduationCap, HelpCircle, Upload, Bell,
  Calendar, Library
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { MobileNavMenu } from "./MobileNavMenu";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("role, full_name").eq("id", user.id).single()
    : { data: null };

  const role = profile?.role;

  // Role-based desktop nav links
  const studentLinks = [
    { href: "/search",          label: "Search",         icon: Search },
    { href: "/my-semester",     label: "My Subjects",    icon: Library },
    { href: "/notices",         label: "Notices",        icon: Bell },
    { href: "/calendar",        label: "Calendar",       icon: Calendar },
    { href: "/ai",              label: "Ask AGNES",      icon: Sparkles, highlight: true },
  ];

  const facultyLinks = [
    { href: "/faculty",         label: "Faculty Portal", icon: GraduationCap },
    { href: "/upload",          label: "Upload",         icon: Upload },
    { href: "/notices",         label: "Notices",        icon: Bell },
    { href: "/ai",              label: "Ask AGNES",      icon: Sparkles, highlight: true },
  ];

  const guestLinks = [
    { href: "/search",          label: "Search",         icon: Search },
    { href: "/departments",     label: "Departments",    icon: Library },
    { href: "/ai",              label: "Ask AGNES",      icon: Sparkles, highlight: true },
  ];

  const desktopLinks = role === "student"
    ? studentLinks
    : (role === "faculty" ? facultyLinks : guestLinks);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-3 sm:px-4 md:px-8 mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0" aria-label="AGNES ACADEMIA Home">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="font-heading font-bold hidden sm:inline-block">AGNES ACADEMIA</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium" aria-label="Main navigation">
            {desktopLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-lg whitespace-nowrap transition-colors hover:bg-muted/70 ${
                    (link as any).highlight
                      ? "text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-500/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {/* Moderator */}
                {(role === "moderator" || role === "administrator") && (
                  <Link
                    href="/moderation"
                    className={buttonVariants({ variant: "ghost", className: "hidden lg:inline-flex text-yellow-600 hover:text-yellow-700 dark:text-yellow-500" })}
                  >
                    Moderation
                  </Link>
                )}

                {/* Admin */}
                {role === "administrator" && (
                  <Link
                    href="/admin"
                    className={buttonVariants({ variant: "outline", className: "hidden lg:inline-flex border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30" })}
                  >
                    Admin
                  </Link>
                )}

                {/* Bookmarks */}
                <Link
                  href="/bookmarks"
                  className={buttonVariants({ variant: "ghost", size: "icon", className: "hidden lg:inline-flex text-muted-foreground hover:text-primary" })}
                  aria-label="Bookmarks"
                >
                  <Bookmark className="h-5 w-5" />
                </Link>

                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  className={buttonVariants({ variant: "ghost", className: "hidden lg:inline-flex" })}
                >
                  Dashboard
                </Link>

                {/* Help */}
                <Link
                  href="/help"
                  className={buttonVariants({ variant: "ghost", size: "icon", className: "hidden lg:inline-flex text-muted-foreground hover:text-primary" })}
                  aria-label="Help & Guide"
                >
                  <HelpCircle className="h-5 w-5" />
                </Link>

                {/* Sign Out */}
                <form action={logout}>
                  <Button type="submit" variant="outline" size="sm" className="hidden lg:inline-flex">
                    Sign Out
                  </Button>
                </form>

                {/* Mobile hamburger */}
                <MobileNavMenu role={role || "student"} />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}>
                  Sign In
                </Link>
                <Link href="/register" className={buttonVariants({ size: "sm" })}>
                  Get Started
                </Link>
                <MobileNavMenu role="guest" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation — Students only */}
      {user && role === "student" && (
        <div className="mobile-bottom-nav lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border pb-safe">
          <nav className="flex items-center justify-around h-16" aria-label="Mobile navigation">
            <Link href="/" className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
              <Home className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-semibold">Home</span>
            </Link>
            <Link href="/my-semester" className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
              <Library className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-semibold">Subjects</span>
            </Link>
            <Link href="/search" className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
              <Search className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-semibold">Search</span>
            </Link>
            <Link href="/ai" className="flex flex-col items-center justify-center flex-1 h-full text-blue-600 dark:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
              <Sparkles className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-semibold">Exam Prep</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
              <LayoutDashboard className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-semibold">Dashboard</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Faculty bottom nav */}
      {user && role === "faculty" && (
        <div className="mobile-bottom-nav lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border pb-safe">
          <nav className="flex items-center justify-around h-16" aria-label="Faculty mobile navigation">
            <Link href="/" className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-primary transition-colors">
              <Home className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-semibold">Home</span>
            </Link>
            <Link href="/faculty" className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-primary transition-colors">
              <GraduationCap className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-semibold">Portal</span>
            </Link>
            <Link href="/upload" className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-primary transition-colors">
              <Upload className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-semibold">Upload</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-primary transition-colors">
              <LayoutDashboard className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-semibold">Dashboard</span>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
