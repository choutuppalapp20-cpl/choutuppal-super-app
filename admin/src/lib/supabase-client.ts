import { createBrowserClient } from '@supabase/ssr'

export function createClientBrowser() {
  return createBrowserClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
  )
}
