import type { Metadata } from "next";
import { BookOpen, GraduationCap, HeartHandshake, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About — AGNES ACADEMIA",
  description: "Learn about AGNES ACADEMIA, an independent educational platform created to support St. Agnes College students.",
};

const principles = [
  {
    icon: GraduationCap,
    title: "Made to support students",
    description:
      "AGNES ACADEMIA is built to help students find and organize academic resources such as notes, question papers, syllabi, and study tools.",
  },
  {
    icon: HeartHandshake,
    title: "A positive educational purpose",
    description:
      "The platform is intended for learning, collaboration, and constructive academic support. It is not created to harm, mislead, offend, or target any person or organization.",
  },
  {
    icon: ShieldCheck,
    title: "Respectful and responsible use",
    description:
      "We encourage respectful participation and responsible sharing. Submitted materials may be reviewed, and users can report content that appears inaccurate or inappropriate.",
  },
];

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 md:px-8">
      <header className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
          <BookOpen className="h-4 w-4" />
          About AGNES ACADEMIA
        </div>
        <h1 className="mb-4 text-3xl font-heading font-extrabold text-foreground sm:text-4xl">
          An academic resource platform for students
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
          AGNES ACADEMIA is an independent educational website created to help
          students of St. Agnes College (Autonomous), Mangaluru, access and share
          useful learning resources in one place.
        </p>
      </header>

      <section aria-label="Our purpose" className="grid gap-5 sm:grid-cols-2">
        {principles.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mb-2 text-lg font-bold text-foreground">{title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </article>
        ))}
      </section>

      <p className="mt-8 rounded-xl border border-border bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground">
        AGNES ACADEMIA is not an official college communication channel.
        College names are used only to identify the student community this
        educational platform aims to support.
      </p>
    </main>
  );
}
