"use client";

import { ScrollReveal, AnimateList, AnimateItem } from "@/lib/motion";

const steps = [
  { num: "01", title: "Search or Browse",   desc: "Type what you need or explore by department and programme." },
  { num: "02", title: "Select Your Subject", desc: "Find your subject — DBMS, Python, Chemistry, anything." },
  { num: "03", title: "Pick a Resource",    desc: "Choose from notes, question papers, syllabus, and more." },
  { num: "04", title: "Learn & Succeed",    desc: "Read online, download, or use Ask AGNES for AI help." },
];

export function HowItWorksSection() {
  return (
    <section className="border-t border-border/50 bg-muted/20 py-12 sm:py-16 md:py-24">
      <div className="container px-4 md:px-8 mx-auto">
        <ScrollReveal className="mb-10 text-center sm:mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Getting Started</p>
          <h2 className="text-2xl font-heading font-bold text-foreground sm:text-3xl md:text-4xl">How It Works</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Finding your study materials takes less than 30 seconds.
          </p>
        </ScrollReveal>

        <AnimateList className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:gap-8 lg:grid-cols-4">
          {/* Connector line — desktop */}
          <div className="hidden lg:block absolute top-11 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

          {steps.map((step, i) => (
            <AnimateItem key={i}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-sm transition-all duration-300 hover:scale-105 hover:border-primary sm:mb-5 sm:h-20 sm:w-20">
                  <span className="font-heading text-xl font-extrabold text-primary/40 sm:text-2xl">{step.num}</span>
                </div>
                <h3 className="mb-1.5 text-xs font-heading font-bold text-foreground sm:text-sm md:text-base">{step.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{step.desc}</p>
              </div>
            </AnimateItem>
          ))}
        </AnimateList>
      </div>
    </section>
  );
}
