import { createClient } from '@supabase/supabase-js'

// This client uses the Service Role Key to bypass Row Level Security.
// ONLY import this in secure Backend Server Actions or API Routes!
export function createAdminClient() {
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase URL or Service Role Key is missing')
  }

  return createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
