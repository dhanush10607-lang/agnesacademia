import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // @ts-ignore - The types might be slightly outdated, but this is required for passkey support
      experimental: {
        passkey: true
      }
    }
  });
}
