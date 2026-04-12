import { createBrowserClient } from '@supabase/ssr'

export function createClientBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing in browser.')
    // Return a mock object to prevent immediate 500/crash
    return {
      auth: {
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: { message: 'Config missing' } }),
      }
    } as any
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
