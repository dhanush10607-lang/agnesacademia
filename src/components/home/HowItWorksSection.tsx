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
    <section className="py-16 md:py-24 bg-muted/20 border-t border-border/50">
      <div className="container px-4 md:px-8 mx-auto">
        <ScrollReveal className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Getting Started</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">How It Works</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Finding your study materials takes less than 30 seconds.
          </p>
        </ScrollReveal>

        <AnimateList className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
          {/* Connector line — desktop */}
          <div className="hidden lg:block absolute top-11 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

          {steps.map((step, i) => (
            <AnimateItem key={i}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center mb-5 shadow-sm hover:border-primary hover:scale-105 transition-all duration-300">
                  <span className="text-2xl font-heading font-extrabold text-primary/40">{step.num}</span>
                </div>
                <h3 className="font-heading font-bold text-sm md:text-base text-foreground mb-1.5">{step.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </AnimateItem>
          ))}
        </AnimateList>
      </div>
    </section>
  );
}
