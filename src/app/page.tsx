import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { RecentlyAddedSection } from "@/components/home/RecentlyAddedSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGNES ACADEMIA — One College. Every Course. Every Resource.",
  description: "The premium academic platform for St. Agnes College (Autonomous), Mangaluru. Find notes, question papers, syllabus, and more — instantly.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeatureSection />
      <HowItWorksSection />
      <RecentlyAddedSection />
    </div>
  );
}
