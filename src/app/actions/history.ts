"use server";

import { createClient } from "@/lib/supabase/server";

export async function logViewAction(
  itemType: 'note' | 'question_paper' | 'question_bank' | 'question' | 'syllabus' | 'video' | 'other',
  itemId: string,
  title: string,
  url: string,
  subjectId?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  try {
    // Check if it already exists to use UPSERT logic efficiently
    const { error } = await supabase
      .from('recently_viewed')
      .upsert(
        {
          user_id: user.id,
          item_type: itemType,
          item_id: itemId,
          title,
          url,
          subject_id: subjectId,
          viewed_at: new Date().toISOString()
        },
        { 
          onConflict: 'user_id,item_type,item_id' 
        }
      );

    if (error) {
      console.error("Error logging view:", error);
    }
  } catch (err) {
    console.error("Exception logging view:", err);
  }
}
