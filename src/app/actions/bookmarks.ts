"use server";

import { createClient } from "@/lib/supabase/server";

export async function toggleBookmarkAction(
  itemType: string,
  itemId: string,
  title: string,
  url: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Check if it exists
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .maybeSingle();

    if (existing) {
      // Remove it
      await supabase.from('bookmarks').delete().eq('id', existing.id);
      return { success: true, isBookmarked: false };
    } else {
      // Add it
      await supabase.from('bookmarks').insert({
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        title,
        url
      });
      return { success: true, isBookmarked: true };
    }
  } catch (error) {
    console.error("Bookmark toggle error:", error);
    return { success: false, error: "Database error" };
  }
}

export async function checkIsBookmarked(itemType: string, itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .maybeSingle();

  return !!data;
}
