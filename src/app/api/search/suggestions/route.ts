import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const supabase = await createClient();
  const formattedQuery = q.split(' ').filter(Boolean).join(' | ');

  const { data, error } = await supabase
    .from("global_search")
    .select("id, title, item_type, subject_name")
    .eq("status", "published")
    .textSearch("search_vector", formattedQuery)
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ suggestions: data });
}
