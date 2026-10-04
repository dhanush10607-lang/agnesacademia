"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Brain, FileCheck2, Home, LayoutDashboard, Library, Search, Shield, Sparkles, Upload } from "lucide-react";

type MobileBottomNavProps = {
  role: "student" | "faculty" | "moderator";
};

const studentItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/my-semester", label: "Subjects", icon: Library },
  { href: "/quizzes", label: "Quizzes", icon: Brain },
  { href: "/search", label: "Search", icon: Search },
  { href: "/ai", label: "Exam Prep", icon: Sparkles },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const facultyItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/faculty", label: "Portal", icon: BookOpen },
  { href: "/faculty/resources", label: "Resources", icon: Upload },
  { href: "/faculty/assignments", label: "Assignments", icon: Library },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const moderatorItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/moderation", label: "Moderation", icon: Shield },
  { href: "/moderation/reports", label: "Reports", icon: FileCheck2 },
  { href: "/search", label: "Search", icon: Search },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname();
  const items = role === "student"
    ? studentItems
    : role === "faculty"
      ? facultyItems
      : moderatorItems;

  return (
    <div className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 pb-safe shadow-[0_-8px_24px_-18px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:hidden">
      <nav
        className="mx-auto flex h-16 max-w-xl items-stretch justify-around px-1"
        aria-label={`${role} mobile navigation`}
      >
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                active ? "bg-primary/10" : ""
              }`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="max-w-full truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
