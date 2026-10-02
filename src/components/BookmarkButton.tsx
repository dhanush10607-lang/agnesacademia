"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toggleBookmarkAction } from "@/app/actions/bookmarks";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  itemType: 'note' | 'question_paper' | 'question_bank' | 'question' | 'syllabus' | 'video' | 'other';
  itemId: string;
  title: string;
  url: string;
  initialIsBookmarked?: boolean;
  /** compact = icon-only small button for use in cards */
  compact?: boolean;
}

export function BookmarkButton({
  itemType, itemId, title, url, initialIsBookmarked = false, compact = false
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    if (isLoading) return;
    // Optimistic update
    const next = !isBookmarked;
    setIsBookmarked(next);
    setIsLoading(true);
    if (next) {
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1200);
    }
    try {
      const result = await toggleBookmarkAction(itemType, itemId, title, url);
      if (!result.success) {
        setIsBookmarked(!next); // rollback
      }
    } catch {
      setIsBookmarked(!next); // rollback
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={handleToggle}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this resource"}
          aria-pressed={isBookmarked}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isBookmarked
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <motion.div
            animate={isBookmarked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
          </motion.div>
        </button>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.8 }}
              animate={{ opacity: 1, y: -28, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
            >
              <span className="text-[10px] font-bold text-primary bg-card border border-border rounded-full px-2 py-0.5 shadow-sm whitespace-nowrap">
                Saved!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <Button
        variant={isBookmarked ? "default" : "outline"}
        className="w-full sm:w-auto gap-2"
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this resource"}
        aria-pressed={isBookmarked}
      >
        <motion.div animate={isBookmarked ? { scale: [1, 1.4, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
        </motion.div>
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </Button>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: -32 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <span className="text-xs font-bold text-primary bg-card border border-border rounded-full px-3 py-1 shadow whitespace-nowrap">
              ✓ Saved to Bookmarks
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
