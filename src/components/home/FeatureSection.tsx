"use client";

import Link from "next/link";
import { FileText, FileQuestion, BookMarked, BookOpen, FlaskConical, MonitorPlay, Target, Bell } from "lucide-react";
import { ScrollReveal, AnimateList, AnimateItem } from "@/lib/motion";

const features = [
  { title: "Notes",           icon: FileText,    desc: "Comprehensive notes for all subjects and semesters.", href: "/resources?type=notes",          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { title: "Question Papers", icon: FileQuestion, desc: "Past year papers and official exam questions.",       href: "/resources?type=question_paper", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { title: "Question Banks",  icon: BookMarked,  desc: "Important questions and structured practice sets.",   href: "/resources?type=question_bank",  color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  { title: "Syllabus",        icon: BookOpen,    desc: "Latest academic curriculum for every programme.",     href: "/resources?type=syllabus",       color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { title: "Lab Resources",   icon: FlaskConical, desc: "Manuals, diagrams, and experiment write-ups.",      href: "/resources?type=lab",            color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  { title: "Video Lectures",  icon: MonitorPlay, desc: "Curated academic videos and recorded lectures.",     href: "/resources?type=video",          color: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
  { title: "Exam Preparation",icon: Target,      desc: "Study guides, tips, and AI-powered assistance.",    href: "/ai",                            color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  { title: "Notices",         icon: Bell,        desc: "Important college announcements and updates.",       href: "/notices",                       color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
];

export function FeatureSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-8 mx-auto">
        <ScrollReveal className="text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">What's Available</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Everything You Need</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Every type of academic resource — organized by department, programme, and semester — available in one place.
          </p>
        </ScrollReveal>

        <AnimateList className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <AnimateItem key={feature.title}>
                <Link href={feature.href} className="group block h-full">
                  <div className="h-full bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 flex flex-col gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${feature.color} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed hidden sm:block">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </AnimateItem>
            );
          })}
        </AnimateList>
      </div>
    </section>
  );
}
