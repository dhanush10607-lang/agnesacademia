"use client";

import { Button, buttonVariants } from "@/components/ui/button";
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
    <section className="relative overflow-hidden bg-background pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24 border-b border-border/50">
      {/* Premium Background Effects */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-48 -left-24 w-72 h-72 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="container px-4 md:px-8 mx-auto relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="px-4 py-1.5 text-primary border-primary/30 bg-primary/5 rounded-full text-sm font-medium backdrop-blur-sm">
              AGNES ACADEMIA
            </Badge>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1]">
              One College.<br className="hidden sm:block" /> Every Course. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Every Resource.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The professionally designed digital ecosystem for St. Agnes College. Everything you need to excel, instantly accessible.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-2xl w-full">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
              <div className="relative flex items-center bg-background/80 backdrop-blur-md border border-border rounded-full shadow-lg overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50">
                <div className="pl-6 pr-2">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes, subjects, question papers, syllabus..."
                  aria-label="Universal Search"
                  className="w-full h-16 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground/70 text-lg"
                />
                <div className="pr-3">
                  <Button type="submit" size="lg" className="rounded-full h-11 px-8 font-semibold shadow-md transition-transform active:scale-95">
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-8 w-full">
            <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Quick Actions</p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {quickActions.map((action, idx) => (
                <Link key={idx} href={action.href}>
                  <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-95 cursor-pointer">
                    <div className={`p-1.5 rounded-lg ${action.color}`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">{action.label}</span>
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
