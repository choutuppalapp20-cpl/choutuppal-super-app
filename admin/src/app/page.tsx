import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { count: usersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: listingsCount } = await supabase
    .from('real_estate_listings')
    .select('*', { count: 'exact', head: true })

  const { count: leadsCount } = await supabase
    .from('real_estate_leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900">{usersCount || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Real Estate Listings</h3>
          <p className="text-3xl font-bold text-gray-900">{listingsCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-orange-500">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Pending Leads</h3>
          <p className="text-3xl font-bold text-orange-600">{leadsCount || 0}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="text-gray-600 space-y-2">
          <p>👉 Use the Sidebar to navigate your portal.</p>
          <p>👉 Review incoming real estate inquiries in <b>Real Estate Leads</b>.</p>
          <p>👉 Toggle features globally in <b>Global Settings</b>.</p>
        </div>
      </div>
    </div>
  )
}
