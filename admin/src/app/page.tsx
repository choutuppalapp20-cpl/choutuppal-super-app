import { createClient } from '@/lib/supabase'
import { TrendingUp, Activity, Target, ShieldCheck, ArrowUpRight, ArrowDownRight, Users, LayoutGrid, Clock, DollarSign } from 'lucide-react'

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

  const kpis = [
    { label: 'Total Users', value: usersCount || 0, icon: Users, trend: '+12.5%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Listings', value: listingsCount || 0, icon: LayoutGrid, trend: '+4.2%', color: 'text-primary-dark', bg: 'bg-primary/10' },
    { label: 'Pending Approvals', value: leadsCount || 0, icon: Clock, trend: '-2.1%', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Market Revenue', value: '₹12.4L', icon: DollarSign, trend: '+18.7%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="space-y-10">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="glass p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 group border-white/40">
            <div className="flex justify-between items-start mb-4">
              <div className={`${kpi.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                <kpi.icon size={24} className={kpi.color} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${kpi.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {kpi.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.trend}
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">{kpi.label}</h3>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end px-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Activity</h2>
              <p className="text-xs text-gray-400 font-medium">Real-time system events</p>
            </div>
            <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">View Archives</button>
          </div>
          
          <div className="glass rounded-[32px] overflow-hidden border-white/60">
            <div className="p-2">
              <table className="w-full text-left">
                <thead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Event Source</th>
                    <th className="px-6 py-4">Action Type</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" />
                          <div>
                            <p className="font-bold text-gray-800">User ID #492{i}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase">Mobile Client</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-semibold text-gray-700">{i % 2 === 0 ? 'New Listing Created' : 'Inquiry Submitted'}</span>
                      </td>
                      <td className="px-6 py-5 text-gray-400 font-medium">
                        {2 + i}m ago
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Verified</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Weekly Insights */}
        <div className="space-y-6">
           <div className="px-4">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Growth Insights</h2>
            <p className="text-xs text-gray-400 font-medium">Current week vs Last week</p>
          </div>

          <div className="glass rounded-[32px] p-8 border-white/60 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Organic Search</p>
                <p className="text-sm font-black text-gray-900">62%</p>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[62%] rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
              </div>
            </div>

             <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Direct Traffic</p>
                <p className="text-sm font-black text-gray-900">28%</p>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[28%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
              </div>
            </div>

             <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Referral Systems</p>
                <p className="text-sm font-black text-gray-900">10%</p>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[10%] rounded-full" />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-8">
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <h4 className="flex items-center gap-2 text-sm font-bold text-primary mb-2">
                  <TrendingUp size={16} /> Precision Optimized
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Visibility index is up by 14.5% this week. We recommend updating the front-page banners to leverage high traffic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
