"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveSearchQuery(query: string) {
  if (!query || query.trim() === "") return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return; // Only save for logged-in users

  // Save to search history
  await supabase.from("search_history").insert({
    user_id: user.id,
    query: query.trim()
  });
}

export async function clearSearchHistory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("search_history").delete().eq("user_id", user.id);
}

export async function getRecentSearches() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("search_history")
    .select("query")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return data?.map(d => d.query) || [];
}
