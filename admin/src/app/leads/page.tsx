import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const supabase = await createClient()

  // Fetch leads and join with listings and users
  const { data: leads, error } = await supabase
    .from('real_estate_leads')
    .select(`
      id, created_at, status, 
      listing:real_estate_listings(title, price, property_type),
      lead_user:users!real_estate_leads_lead_user_id_fkey(full_name, phone_number)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching leads:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real Estate CRM</h1>
          <p className="text-gray-500 mt-1">Manage incoming application leads for local properties securely.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Contact</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads && leads.length > 0 ? leads.map((lead: any) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{lead.listing?.title}</div>
                  <div className="text-sm text-gray-500">{lead.listing?.property_type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {lead.lead_user?.full_name || 'Anonymous User'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.lead_user?.phone_number ? (
                    <a href={`tel:${lead.lead_user.phone_number}`} className="text-primary hover:underline font-medium">
                      {lead.lead_user.phone_number}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    lead.status === 'pending' ? 'bg-orange-100 text-orange-800' : 
                    lead.status === 'closed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No real estate leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
