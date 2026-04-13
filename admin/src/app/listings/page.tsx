import { createAdminClient } from '@/lib/supabaseAdmin'
import { LayoutGrid } from 'lucide-react'
import ListingsManager from './ListingsManager'

export const dynamic = 'force-dynamic'

export default async function ListingsManagementPage() {
  const supabase = createAdminClient()

  // Fetch both regular listings and real estate listings
  const { data: businessListings } = await supabase
    .from('listings')
    .select('*, owner:users(full_name)')
    .order('created_at', { ascending: false })

  const { data: realEstateListings } = await supabase
    .from('real_estate_listings')
    .select('*, owner:users(full_name)')
    .order('created_at', { ascending: false })

  const allListings = [
    ...(businessListings || []).map(l => ({ ...l, type: 'Business/Job' })),
    ...(realEstateListings || []).map(l => ({ ...l, type: 'Real Estate' }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return <ListingsManager initialListings={allListings} />
}
