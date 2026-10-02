"use client";

import Link from "next/link";
import { FileText, FileQuestion, BookMarked, BookOpen, FlaskConical, MonitorPlay, ClipboardList, Download, Eye, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Badge } from "@/components/ui/badge";

const categoryIcons: Record<string, React.ElementType> = {
  notes: FileText,
  question_paper: FileQuestion,
  question_bank: BookMarked,
  syllabus: BookOpen,
  lab: FlaskConical,
  video: MonitorPlay,
  assignment: ClipboardList,
  default: FileText,
};

const categoryColors: Record<string, string> = {
  notes:          "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  question_paper: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  question_bank:  "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  syllabus:       "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  lab:            "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  video:          "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  assignment:     "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  default:        "bg-muted text-muted-foreground",
};

interface ResourceCardProps {
  id: string;
  title: string;
  subjectName?: string;
  semesterName?: string;
  categorySlug?: string;
  categoryName?: string;
  fileUrl?: string;
  fileSizeBytes?: number;
  isVerified?: boolean;
  isBookmarked?: boolean;
  userId?: string;
  /** href for the resource detail page */
  href: string;
}

function formatBytes(bytes?: number) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResourceCard({
  id, title, subjectName, semesterName,
  categorySlug = "default", categoryName,
  fileUrl, fileSizeBytes, isVerified, isBookmarked = false,
  userId, href,
}: ResourceCardProps) {
  const Icon = categoryIcons[categorySlug] ?? categoryIcons.default;
  const color = categoryColors[categorySlug] ?? categoryColors.default;
  const size = formatBytes(fileSizeBytes);

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col gap-3"
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={href} className="font-semibold text-sm text-foreground line-clamp-2 leading-snug hover:text-primary transition-colors">
            {title}
          </Link>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
            {subjectName  && <span className="text-xs text-muted-foreground truncate max-w-[180px]">{subjectName}</span>}
            {semesterName && <><span className="text-xs text-muted-foreground/50">·</span><span className="text-xs text-muted-foreground">{semesterName}</span></>}
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center flex-wrap gap-2">
        {categoryName && (
          <Badge variant="secondary" className="text-[10px] h-5 px-2 font-medium capitalize">
            {categoryName}
          </Badge>
        )}
        {isVerified && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified</span>
          </span>
        )}
        {size && <span className="text-[10px] text-muted-foreground ml-auto">{size} · PDF</span>}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 active:scale-95 transition-all"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </Link>
        {fileUrl && (
          <a
            href={fileUrl}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-semibold hover:bg-muted active:scale-95 transition-all"
            aria-label={`Download ${title}`}
          >
            <Download className="w-3.5 h-3.5" /> Download
          </a>
        )}
        {userId && (
          <div className="ml-auto">
            <BookmarkButton
              itemType={(categorySlug as any) || "other"}
              itemId={id}
              title={title}
              url={href}
              initialIsBookmarked={isBookmarked}
              compact
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
