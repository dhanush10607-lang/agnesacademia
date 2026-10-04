import Link from "next/link";
import { BookOpen } from "lucide-react";

import { format } from "@/lib/date-time";

export function Footer() {
  const links = ["About", "Departments", "Courses", "Resources", "Notices", "Contact"];

  return (
    <footer className="border-t bg-muted/20 pt-16 pb-8">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-xl">
                AGNES ACADEMIA
              </span>
            </Link>
            <p className="text-muted-foreground font-medium mb-2">
              One College. Every Course. Every Resource.
            </p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Academic platform concept for St. Agnes College (Autonomous), Mangaluru.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {links.slice(0, 3).map((link) => (
                <li key={link}>
                  <Link href={link === "About" ? "/about" : "#"} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {links.slice(3).map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {format(new Date(), "yyyy")} AGNES ACADEMIA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
