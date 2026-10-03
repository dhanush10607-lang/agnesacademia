"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Book, FileText, Library, ClipboardList, GraduationCap } from "lucide-react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickActions = [
    { icon: Book, label: "Notes", href: "/resources?type=notes", color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" },
    { icon: FileText, label: "Question Papers", href: "/resources?type=question_paper", color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400" },
    { icon: Library, label: "Question Bank", href: "/resources?type=question_bank", color: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400" },
    { icon: ClipboardList, label: "Syllabus", href: "/resources?type=syllabus", color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" },
    { icon: GraduationCap, label: "Exam Prep", href: "/ai", color: "bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400" }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-background pb-12 pt-10 sm:pb-16 sm:pt-16 md:pb-24 md:pt-24 lg:pt-32">
      {/* Premium Background Effects */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-48 -left-24 w-72 h-72 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="container px-4 md:px-8 mx-auto relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-4xl flex-col items-center space-y-6 text-center sm:space-y-8"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm sm:text-sm">
              AGNES ACADEMIA
            </Badge>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl font-heading font-extrabold leading-[1.08] tracking-tight text-foreground min-[400px]:text-4xl md:text-5xl lg:text-7xl">
              One College.<br className="hidden sm:block" /> Every Course. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Every Resource.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              The professionally designed digital ecosystem for St. Agnes College. Everything you need to excel, instantly accessible.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-2xl">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
              <div className="relative flex items-center bg-background/80 backdrop-blur-md border border-border rounded-full shadow-lg overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50">
                <div className="pl-4 pr-1 sm:pl-6 sm:pr-2">
                  <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes, subjects, question papers, syllabus..."
                  aria-label="Universal Search"
                  className="h-14 min-w-0 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:h-16 sm:text-base"
                />
                <div className="pr-2 sm:pr-3">
                  <Button type="submit" size="lg" className="h-10 rounded-full px-4 text-sm font-semibold shadow-md transition-transform active:scale-95 sm:h-11 sm:px-8">
                    <span className="sm:hidden">Go</span>
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full pt-4 sm:pt-8">
            <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Quick Actions</p>
            <div className="grid grid-cols-2 justify-center gap-2 sm:flex sm:flex-wrap sm:gap-3 md:gap-4">
              {quickActions.map((action, idx) => (
                <Link key={idx} href={action.href}>
                  <div className="flex h-full min-h-12 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-left shadow-sm transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.98] sm:gap-2.5 sm:rounded-2xl sm:px-5 sm:py-3">
                    <div className={`shrink-0 rounded-lg p-1.5 ${action.color}`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold leading-tight sm:text-sm">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
