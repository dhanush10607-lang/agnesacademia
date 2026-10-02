"use client";

import { useEffect } from "react";
import { logViewAction } from "@/app/actions/history";

interface TrackViewProps {
  itemType: 'note' | 'question_paper' | 'question_bank' | 'question' | 'syllabus' | 'video' | 'other';
  itemId: string;
  title: string;
  url: string;
  subjectId?: string;
}

export function TrackView({ itemType, itemId, title, url, subjectId }: TrackViewProps) {
  useEffect(() => {
    // Fire and forget
    logViewAction(itemType, itemId, title, url, subjectId);
  }, [itemType, itemId, title, url, subjectId]);

  return null;
}
