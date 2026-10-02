import Link from "next/link";
import { BookOpen, Download, Bookmark, Upload, Flag, Brain, Sparkles, ChevronRight, HelpCircle, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Guide — AGNES ACADEMIA",
  description: "Learn how to find notes, download resources, submit content, take quizzes, and use Ask AGNES AI.",
};

const topics = [
  {
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    title: "How to find notes",
    steps: [
      "Go to Search and type what you need — for example: DBMS notes.",
      "Or go to My Dashboard → My Subjects → pick your subject.",
      "Choose the Notes tab on the subject page.",
      "Tap View to read or Download to save the file.",
    ],
  },
  {
    icon: Download,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    title: "How to download resources",
    steps: [
      "Open any resource card — notes, question papers, or syllabus.",
      "Tap the Download button.",
      "The file will be saved to your device's Downloads folder.",
      "PDF files can be opened with any PDF reader.",
    ],
  },
  {
    icon: Bookmark,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    title: "How to bookmark resources",
    steps: [
      "Find any resource you want to save.",
      "Tap the Bookmark icon on the resource card.",
      "Go to Bookmarks from the navigation to view all saved items.",
      "Tap the bookmark again to remove it.",
    ],
  },
  {
    icon: Upload,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    title: "How to submit resources",
    steps: [
      "Go to Upload from the navigation menu.",
      "Select the correct Department, Programme, Semester, and Subject.",
      "Choose the resource type (Notes, Question Paper, etc.).",
      "Upload your PDF, DOCX, or PPTX file.",
      "Your submission will be reviewed and approved by a moderator.",
    ],
  },
  {
    icon: Flag,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    title: "How to report incorrect content",
    steps: [
      "Open the resource that has an error.",
      "Tap the Report button (flag icon).",
      "Describe the problem briefly — for example: Wrong subject or Outdated notes.",
      "Our moderation team will review and take action.",
    ],
  },
  {
    icon: Brain,
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    title: "How quizzes work",
    steps: [
      "Go to a subject page and tap Quizzes.",
      "Select a quiz and tap Start Quiz.",
      "Answer each question by tapping your chosen option.",
      "Use Next and Previous to navigate between questions.",
      "Tap Submit to finish and see your score.",
    ],
  },
  {
    icon: Sparkles,
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    title: "How to use Ask AGNES AI",
    steps: [
      "Tap Ask AGNES from the navigation.",
      "Type any academic question in plain English.",
      "Examples: Explain 3NF or What is a deadlock?.",
      "AGNES searches the platform's resources to give you accurate answers.",
      "You can ask follow-up questions in the same conversation.",
    ],
  },
];

export default function HelpPage() {
  return (
    <main className="container px-4 md:px-8 mx-auto py-8 max-w-4xl">
      <Breadcrumbs items={[{ label: "Help", href: "/help" }]} />

      <div className="mt-4 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Help & Guide</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Everything you need to know about using AGNES ACADEMIA. Written in plain English — no technical knowledge required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic, i) => {
          const Icon = topic.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${topic.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-foreground">{topic.title}</h2>
              </div>
              <ol className="space-y-2">
                {topic.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-muted text-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{j + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>

      {/* Contact Section */}
      <div className="mt-10 p-6 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <MessageCircle className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-foreground">Still need help?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            If you couldn't find what you were looking for, try the AI assistant or contact your department administrator.
          </p>
        </div>
        <Link
          href="/ai"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Ask AGNES
        </Link>
      </div>
    </main>
  );
}
