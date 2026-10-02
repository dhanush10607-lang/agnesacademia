"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Search, Library, BookOpen, FileText, Brain, Bell, HelpCircle, LayoutDashboard, Upload, GraduationCap, CalendarDays, Shield, Settings, Users, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

interface Props {
  role: string;
}

export function MobileNavMenu({ role }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const studentLinks = [
    { href: "/search",      label: "Search Resources",   icon: Search },
    { href: "/my-semester", label: "My Subjects",        icon: Library },
    { href: "/resources?type=notes", label: "Notes",     icon: BookOpen },
    { href: "/resources?type=question_paper", label: "Question Papers", icon: FileText },
    { href: "/ai",          label: "Exam Prep / Ask AGNES", icon: Brain },
    { href: "/notices",     label: "Notices",            icon: Bell },
    { href: "/calendar",    label: "Academic Calendar",  icon: CalendarDays },
    { href: "/bookmarks",   label: "Bookmarks",          icon: BookOpen },
    { href: "/dashboard",   label: "Dashboard",          icon: LayoutDashboard },
    { href: "/profile",     label: "Profile & Settings", icon: Settings },
    { href: "/help",        label: "Help & Guide",       icon: HelpCircle },
  ];

  const facultyLinks = [
    { href: "/faculty",  label: "Faculty Portal", icon: GraduationCap },
    { href: "/upload",   label: "Upload Resource", icon: Upload },
    { href: "/notices",  label: "Notices",         icon: Bell },
    { href: "/calendar", label: "Academic Calendar", icon: CalendarDays },
    { href: "/dashboard",label: "Dashboard",       icon: LayoutDashboard },
    { href: "/profile",  label: "Profile & Settings", icon: Settings },
    { href: "/help",     label: "Help & Guide",    icon: HelpCircle },
  ];

  const staffLinks = [
    { href: "/search",      label: "Search Resources", icon: Search },
    { href: "/departments", label: "Departments",      icon: Library },
    { href: "/notices",     label: "Notices",           icon: Bell },
    { href: "/calendar",    label: "Academic Calendar", icon: CalendarDays },
    { href: "/dashboard",   label: "Dashboard",         icon: LayoutDashboard },
    { href: "/profile",     label: "Profile & Settings", icon: Settings },
    { href: "/moderation",  label: "Moderation",        icon: Shield },
    { href: "/admin",       label: "Admin Console",     icon: Settings },
    { href: "/help",        label: "Help & Guide",      icon: HelpCircle },
  ];

  const adminSections = [
    {
      title: "Overview",
      links: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard", label: "Back to App", icon: Home },
      ],
    },
    {
      title: "Academic Structure",
      links: [
        { href: "/admin/academic/departments", label: "Departments", icon: Library },
        { href: "/admin/academic/programmes", label: "Programmes", icon: GraduationCap },
        { href: "/admin/academic/years", label: "Academic Years", icon: CalendarDays },
        { href: "/admin/academic/semesters", label: "Semesters", icon: CalendarDays },
        { href: "/admin/academic/subjects", label: "Subjects", icon: BookOpen },
      ],
    },
    {
      title: "Users & Security",
      links: [
        { href: "/admin/users?role=student", label: "Students", icon: Users },
        { href: "/admin/users?role=faculty", label: "Faculty", icon: Users },
        { href: "/admin/users?role=moderator", label: "Moderators", icon: Shield },
        { href: "/admin/users?role=administrator", label: "Administrators", icon: Settings },
        { href: "/admin/academic-profile-settings", label: "Profile Settings", icon: Settings },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "/admin/resources", label: "All Resources", icon: FileText },
        { href: "/admin/resources?status=pending_review", label: "Pending Resources", icon: Upload },
        { href: "/admin/resources/reports", label: "Reports", icon: Bell },
        { href: "/admin/resources/categories", label: "Categories", icon: Library },
      ],
    },
    {
      title: "Academic",
      links: [
        { href: "/admin/resources?type=question_paper", label: "Question Papers", icon: FileText },
        { href: "/admin/resources?type=question_bank", label: "Question Banks", icon: BookOpen },
        { href: "/admin/resources?type=syllabus", label: "Syllabus", icon: BookOpen },
        { href: "/admin/resources?type=assignment", label: "Assignments", icon: FileText },
        { href: "/admin/quizzes", label: "Quizzes", icon: Brain },
      ],
    },
    {
      title: "Communication",
      links: [
        { href: "/admin/notices", label: "Notices", icon: Bell },
        { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
      ],
    },
    {
      title: "System",
      links: [
        { href: "/admin/analytics", label: "Analytics", icon: LayoutDashboard },
        { href: "/admin/audit-logs", label: "Audit Logs", icon: FileText },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  const guestLinks = [
    { href: "/search",      label: "Search",       icon: Search },
    { href: "/departments", label: "Departments",  icon: Library },
    { href: "/help",        label: "Help",         icon: HelpCircle },
  ];

  const links = role === "student"
    ? studentLinks
    : role === "faculty"
      ? facultyLinks
      : role === "administrator" || role === "moderator"
        ? staffLinks.filter(link => role === "administrator" || link.href !== "/admin")
        : guestLinks;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-navigation-drawer"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Drawer */}
          <div id="mobile-navigation-drawer" className="relative ml-auto w-72 max-w-[85vw] h-full bg-background shadow-2xl flex flex-col pt-safe">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-heading font-bold text-foreground">Menu</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4" aria-label="Drawer navigation">
              {role === "administrator" ? (
                <div className="space-y-5">
                  {adminSections.map(section => (
                    <section key={section.title} aria-label={section.title}>
                      <h2 className="px-3 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {section.title}
                      </h2>
                      <div className="space-y-0.5">
                        {section.links.map(link => {
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                            >
                              <Icon className="w-5 h-5 shrink-0 text-primary/70" />
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {links.map(link => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                      >
                        <Icon className="w-5 h-5 shrink-0 text-primary/70" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </nav>

            {role !== "guest" && (
              <div className="p-4 border-t space-y-2">
                <Link href="/profile" className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border rounded-xl text-sm font-semibold hover:bg-muted transition-colors" onClick={() => setOpen(false)}>
                  <Settings className="w-4 h-4" /> Profile & Settings
                </Link>
                <form action={logout} onSubmit={() => setOpen(false)}>
                  <Button type="submit" variant="destructive" className="w-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50">
                    Sign Out
                  </Button>
                </form>
              </div>
            )}

            {role === "guest" && (
              <div className="p-4 border-t space-y-2">
                <Link href="/login" className="block w-full text-center px-4 py-2.5 border rounded-xl text-sm font-semibold hover:bg-muted transition-colors" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" className="block w-full text-center px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
