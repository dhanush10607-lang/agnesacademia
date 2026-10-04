import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  BookOpen, Search, Bookmark, LayoutDashboard,
  Sparkles, GraduationCap, HelpCircle, Upload, Bell,
  Library, Settings, ClipboardList, FileText, Brain, Megaphone,
  CalendarDays, Shield, FileCheck2
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LogoutForm } from "@/components/auth/LogoutForm";
import { MobileNavMenu } from "./MobileNavMenu";
import { MobileBottomNav } from "./MobileBottomNav";
import { NotificationBadge } from "@/components/notifications/NotificationBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("role, full_name, avatar_url").eq("id", user.id).single()
    : { data: null };

  const role = profile?.role;
  const fullName = profile?.full_name || "User";
  const avatarUrl = profile?.avatar_url || "";
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  // Role-based desktop nav links
  const studentLinks = [
    { href: "/quizzes",          label: "Quizzes",        icon: Brain },
    { href: "/search",          label: "Search",         icon: Search },
    { href: "/my-semester",     label: "My Subjects",    icon: Library },
    { href: "/upload",          label: "Upload",         icon: Upload },
    { href: "/my-submissions",  label: "My Submissions", icon: BookOpen },
    { href: "/profile",         label: "Profile Settings", icon: Settings },
    { href: "/notices",         label: "Notices",        icon: Bell },
    { href: "/ai",              label: "Ask AGNES",      icon: Sparkles, highlight: true },
  ];

  const facultyLinks = [
    { href: "/faculty",         label: "Faculty Portal", icon: GraduationCap },
    { href: "/faculty/resources", label: "My Resources", icon: FileText },
    { href: "/faculty/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/faculty/quizzes", label: "Quizzes", icon: Brain },
    { href: "/faculty/upload",   label: "Upload",         icon: Upload },
    { href: "/notices",         label: "Notices",        icon: Bell },
  ];

  const moderatorLinks = [
    { href: "/moderation",         label: "Moderation", icon: Shield },
    { href: "/moderation/reports", label: "Reports", icon: FileCheck2 },
    { href: "/search",             label: "Search", icon: Search },
    { href: "/dashboard",          label: "Dashboard", icon: LayoutDashboard },
  ];

  const guestLinks = [
    { href: "/search",          label: "Search",         icon: Search },
    { href: "/departments",     label: "Departments",    icon: Library },
    { href: "/ai",              label: "Ask AGNES",      icon: Sparkles, highlight: true },
  ];

  const adminLinks = [
    { href: "/admin",           label: "Admin Console", icon: LayoutDashboard },
    { href: "/admin/users",     label: "Users",         icon: Settings },
    { href: "/admin/notifications", label: "Push Center", icon: Bell },
    { href: "/upload",          label: "Upload",        icon: Upload },
    { href: "/ai",              label: "Ask AGNES",     icon: Sparkles, highlight: true },
  ];

  const desktopLinks = role === "student"
    ? studentLinks
    : role === "faculty"
      ? facultyLinks
      : role === "moderator"
        ? moderatorLinks
        : role === "administrator"
          ? adminLinks
          : guestLinks;

  const portalLinks = role === "faculty"
    ? [
      { href: "/faculty/quizzes", label: "Manage Quizzes", icon: Brain },
      { href: "/faculty/assignments/new", label: "Create Assignment", icon: ClipboardList },
        { href: "/faculty/quizzes/new", label: "Create Quiz", icon: Brain },
        { href: "/faculty/announcements/new", label: "Create Announcement", icon: Megaphone },
        { href: "/faculty/notices/new", label: "Publish Notice", icon: Bell },
        { href: "/faculty/calendar/new", label: "Schedule Event", icon: CalendarDays },
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/profile", label: "Profile & Settings", icon: Settings },
        { href: "/help", label: "Help & Guide", icon: HelpCircle },
      ]
    : role === "moderator"
      ? [
          { href: "/notices", label: "Notices", icon: Bell },
          { href: "/calendar", label: "Academic Calendar", icon: CalendarDays },
          { href: "/departments", label: "Departments", icon: Library },
          { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/profile", label: "Profile & Settings", icon: Settings },
          { href: "/help", label: "Help & Guide", icon: HelpCircle },
        ]
      : [];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-3 sm:px-4 md:px-8 mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0" aria-label="AGNES ACADEMIA Home">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="font-heading text-sm font-bold tracking-tight sm:text-base">AGNES ACADEMIA</span>
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
                    ("highlight" in link && link.highlight)
                      ? "text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-500/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            {portalLinks.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className="h-auto px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground xl:px-3" />
                }>
                  More
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-60">
                  <DropdownMenuLabel>
                    {role === "faculty" ? "Faculty Tools" : "Moderator Links"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {portalLinks.map(({ href, label, icon: Icon }) => (
                    <DropdownMenuItem key={href} render={<Link href={href} />}>
                      <Icon className="mr-2 h-4 w-4" />
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {/* Moderator */}
                {role === "administrator" && (
                  <div className="hidden lg:block">
                    <Link
                      href="/moderation"
                      className={buttonVariants({ variant: "ghost", className: "text-yellow-600 hover:text-yellow-700 dark:text-yellow-500" })}
                    >
                      Moderation
                    </Link>
                  </div>
                )}

                {/* Admin */}
                {role === "administrator" && (
                  <div className="hidden lg:block">
                    <Link
                      href="/admin"
                      className={buttonVariants({ variant: "outline", className: "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30" })}
                    >
                      Admin
                    </Link>
                  </div>
                )}

                {/* Notifications */}
                <div className="hidden lg:block">
                  <NotificationBadge />
                </div>

                {/* Bookmarks */}
                <div className="hidden lg:block">
                  <Link
                    href="/bookmarks"
                    className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-primary" })}
                    aria-label="Bookmarks"
                  >
                    <Bookmark className="h-5 w-5" />
                  </Link>
                </div>

                {/* Help */}
                <div className="hidden lg:block">
                  <Link
                    href="/help"
                    className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-primary" })}
                    aria-label="Help & Guide"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Link>
                </div>

                {/* User Profile Dropdown */}
                <div className="hidden lg:block pl-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border/50 bg-muted/50 hover:bg-muted" />
                    }>
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={avatarUrl} alt={fullName} />
                        <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{fullName}</p>
                          <p className="text-xs leading-none text-muted-foreground capitalize">
                            {role}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem render={<Link href="/dashboard" />}>
                          <div className="cursor-pointer flex w-full items-center">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link href="/profile" />}>
                          <div className="cursor-pointer flex w-full items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Profile & Settings</span>
                          </div>
                        </DropdownMenuItem>
                        {role === "student" && (
                          <DropdownMenuItem render={<Link href="/profile/academic" />}>
                            <div className="cursor-pointer flex w-full items-center">
                              <GraduationCap className="mr-2 h-4 w-4" />
                              <span>Academic Information</span>
                            </div>
                          </DropdownMenuItem>
                        )}
                        {role === "student" && (
                          <DropdownMenuItem render={<Link href="/my-semester" />}>
                            <div className="cursor-pointer flex w-full items-center">
                              <Library className="mr-2 h-4 w-4" />
                              <span>My Subjects</span>
                            </div>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <LogoutForm className="w-full">
                          <button type="submit" className="flex w-full cursor-pointer items-center text-red-600 dark:text-red-400">
                            Sign Out
                          </button>
                        </LogoutForm>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile hamburger */}
                <MobileNavMenu role={role || "student"} />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}>
                  Sign In
                </Link>
                <Link href="/register" className={buttonVariants({ size: "sm", className: "hidden sm:inline-flex" })}>
                  Get Started
                </Link>
                <MobileNavMenu role="guest" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      {user && role === "student" && (
        <MobileBottomNav role="student" />
      )}

      {/* Faculty bottom nav */}
      {user && role === "faculty" && (
        <MobileBottomNav role="faculty" />
      )}
      {user && role === "moderator" && (
        <MobileBottomNav role="moderator" />
      )}
    </>
  );
}
