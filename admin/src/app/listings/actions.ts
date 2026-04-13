'use server'

import { createAdminClient } from '@/lib/supabaseAdmin'
import { revalidatePath } from 'next/cache'

/**
 * Ensures an "Admin System" dummy user exists in the database.
 * Returns the UUID of this user.
 */
async function getOrCreateAdminUser() {
  const supabase = createAdminClient()
  
  // 1. Try to find existing Admin System user
  const { data: existingUser, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('full_name', 'Admin System')
    .maybeSingle()

  if (existingUser) return existingUser.id

  // 2. Not found, create a new Admin System user
  // First, create in auth.users (dummy email)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'admin-system@choutuppal.local',
    password: Math.random().toString(36).slice(-12), // Random password
    email_confirm: true,
    user_metadata: { full_name: 'Admin System' }
  })

  if (authError) {
    // If user already exists in auth but not in public.users, handle that
    if (authError.message.includes('already registered')) {
      // We might need to fetch the existing auth user's ID
      // But for simplicity, we'll try to insert into public.users if we have the ID
      // However, we don't have the ID here. Let's try to list users.
      const { data: users } = await supabase.auth.admin.listUsers()
      const adminAuth = users.users.find(u => u.email === 'admin-system@choutuppal.local')
      if (adminAuth) {
        await supabase.from('users').upsert({ id: adminAuth.id, full_name: 'Admin System' })
        return adminAuth.id
      }
    }
    throw new Error(`Failed to create Admin System auth user: ${authError.message}`)
  }

  const adminId = authData.user.id

  // 3. Insert into public.users
  const { error: publicError } = await supabase
    .from('users')
    .upsert({ id: adminId, full_name: 'Admin System' })

  if (publicError) throw new Error(`Failed to create Admin System profile: ${publicError.message}`)

  return adminId
}

export async function saveListingAction(payload: any, type: 'Business/Job' | 'Real Estate', assetId?: string) {
  const supabase = createAdminClient()
  const table = type === 'Real Estate' ? 'real_estate_listings' : 'listings'

  try {
    // Ensure we have an owner_id
    if (!assetId) {
      payload.owner_id = await getOrCreateAdminUser()
    }

    let result
    if (assetId) {
      result = await supabase
        .from(table)
        .update(payload)
        .eq('id', assetId)
        .select('*, owner:users(full_name)')
        .single()
    } else {
      result = await supabase
        .from(table)
        .insert(payload)
        .select('*, owner:users(full_name)')
        .single()
    }

    if (result.error) throw result.error
    
    revalidatePath('/listings')
    return { data: result.data, error: null }
  } catch (error: any) {
    console.error(`Action error [saveListing]:`, error)
    return { data: null, error: error.message || 'Unknown error occurred' }
  }
}

export async function updateStatusAction(id: string, type: string, status: string) {
  const supabase = createAdminClient()
  const table = type === 'Real Estate' ? 'real_estate_listings' : 'listings'

  try {
    const { data, error } = await supabase
      .from(table)
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    revalidatePath('/listings')
    return { data, error: null }
  } catch (error: any) {
    console.error(`Action error [updateStatus]:`, error)
    return { data: null, error: error.message || 'Failed to update status' }
  }
}

export async function deleteAssetAction(id: string, type: string) {
  const supabase = createAdminClient()
  const table = type === 'Real Estate' ? 'real_estate_listings' : 'listings'

  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error
    revalidatePath('/listings')
    return { success: true, error: null }
  } catch (error: any) {
    console.error(`Action error [deleteAsset]:`, error)
    return { success: false, error: error.message || 'Failed to delete asset' }
  }
}
