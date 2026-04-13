import { createClient } from '@/lib/supabase'
import { CheckCircle, XCircle, Clock, Edit2, ExternalLink, Search, Filter, ArrowUpDown, MoreVertical, Plus, LayoutGrid } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ListingsManagementPage() {
  const supabase = await createClient()

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

  return (
    <div className="space-y-8">
      {/* Header & Search Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Ecosystem Assets</h1>
          <p className="text-sm text-gray-400 font-medium">Monitoring {allListings.length} total active assets in the Choutuppal pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Query ecosystem..." 
              className="bg-white border border-gray-200/60 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all w-full md:w-64 font-medium shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-gray-200/60 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={18} />
          </button>
          <button className="flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95">
            <Plus size={18} /> New Asset
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All Assets', 'Real Estate', 'Business Services', 'Premium Only', 'Pending Audit'].map((label, i) => (
          <button key={i} className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold border transition-all ${i === 0 ? 'bg-primary text-white border-primary shadow-[0_4px_12px_rgba(45,212,191,0.3)]' : 'bg-white text-gray-500 border-gray-100 hover:border-primary/40 hover:text-primary'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="glass rounded-[32px] overflow-hidden border-white/60 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">
                  <div className="flex items-center gap-2">Asset Identity <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-6 py-5">Classification</th>
                <th className="px-6 py-5">Custodian</th>
                <th className="px-6 py-5">Deployment State Status</th>
                <th className="px-6 py-5">Registered</th>
                <th className="px-8 py-5 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50 bg-white/40">
              {allListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{listing.title}</span>
                      <span className="text-[11px] text-gray-400 font-medium truncate max-w-[240px] mt-0.5">{listing.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 text-[10px] rounded-full font-black uppercase tracking-wider ${
                      listing.type === 'Real Estate' ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'
                    }`}>
                      {listing.type}
                    </span>
                  </td>
                  <td className="px-6 py-6 font-bold text-gray-600 text-[13px]">
                    {listing.owner?.full_name || 'Anonymous Entity'}
                  </td>
                  <td className="px-6 py-6">
                    {listing.status === 'approved' ? (
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live & Active
                      </span>
                    ) : listing.status === 'rejected' ? (
                      <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Decommissioned
                      </span>
                    ) : (
                      <span className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" /> Under Audit
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-xs text-gray-400 font-bold">
                    {new Date(listing.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {allListings.length === 0 && (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <LayoutGrid size={32} className="text-gray-200" />
              </div>
              <p className="text-gray-400 font-bold tracking-tight">Zero asset matches found in current pipeline.</p>
              <button className="text-primary text-sm font-black uppercase mt-4 hover:underline">Clear Ecosystem Search</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
