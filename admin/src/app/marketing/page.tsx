import { createClient } from '@/lib/supabase'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { revalidatePath } from 'next/cache'
import { Plus, Trash2, CheckCircle, XCircle, ImageIcon, Zap, Shield, Bell, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function MarketingPage() {
  const supabase = await createClient()

  // Fetch Banners
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .order('position', { ascending: true })

  // Fetch Settings
  const { data: setting } = await supabase
    .from('global_settings')
    .select('value')
    .eq('key', 'free_stories_enabled')
    .single()

  const isStoriesEnabled = setting?.value === 'true'

  async function toggleStories(formData: FormData) {
    'use server'
    const newStatus = formData.get('status') === 'true' ? 'false' : 'true'
    const adminDb = createAdminClient()
    await adminDb
      .from('global_settings')
      .upsert({ key: 'free_stories_enabled', value: newStatus, updated_at: new Date().toISOString() })
    revalidatePath('/marketing')
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight text-primary">Growth Console</h1>
          <p className="text-sm text-gray-400 font-medium tracking-tight">Manage promotional assets and platform-wide growth parameters</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20">
          <Plus size={18} /> Add Banner Asset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Banner Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 px-2">
            <ImageIcon size={18} className="text-gray-400" />
            <h2 className="text-lg font-bold text-gray-800">Promotional Banners</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners?.map((banner) => (
              <div key={banner.id} className="glass rounded-[32px] overflow-hidden border-white group hover:shadow-2xl transition-all duration-500">
                <div className="relative h-48 w-full bg-gray-50">
                  {banner.image_url ? (
                    <Image 
                      src={banner.image_url} 
                      alt={banner.title || 'Banner'} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                     <p className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                      Preview Link <ArrowRight size={14} />
                     </p>
                  </div>
                  <div className="absolute top-4 right-4">
                    {banner.is_active ? (
                      <div className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                        <CheckCircle size={10} /> Live
                      </div>
                    ) : (
                      <div className="bg-gray-900/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-white/20">
                        <XCircle size={10} /> Paused
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-base">{banner.title || 'Marketing Fragment'}</h3>
                  <p className="text-[11px] text-gray-400 font-medium truncate mt-1">{banner.link_url || 'No external redirection'}</p>
                  
                  <div className="mt-6 flex justify-between items-center bg-gray-50 rounded-2xl p-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority Index: {banner.position}</span>
                    <div className="flex gap-2">
                       <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <ArrowRight size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master Settings */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Zap size={18} className="text-gray-400" />
            <h2 className="text-lg font-bold text-gray-800">Operational Switches</h2>
          </div>

          <div className="glass rounded-[32px] p-8 border-white/60 space-y-8">
            {/* Free Stories Toggle */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_4px_12px_rgba(45,212,191,0.1)]">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Ecosystem Stories</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Free Deployment Mode</p>
                  </div>
                </div>
                <form action={toggleStories}>
                  <input type="hidden" name="status" value={isStoriesEnabled ? 'true' : 'false'} />
                  <button 
                    type="submit"
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 ${
                      isStoriesEnabled ? 'bg-primary shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                        isStoriesEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </form>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                When enabled, all base-tier entities can deploy stories without transaction processing. Recommended for territory growth.
              </p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Global Sharing */}
            <div className="space-y-6 opacity-50 cursor-not-allowed">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-500 border border-blue-200">
                    <ArrowRight size={20} className="rotate-[-45deg]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Global Aggregator</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">External Sync</p>
                  </div>
                </div>
                <div className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-100">
                  <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-1" />
                </div>
              </div>
               <p className="text-xs text-gray-400 leading-relaxed font-medium italic">
                Advanced node: Synchronizes local listings with regional partner networks. Requires Active API key.
              </p>
            </div>

             <div className="h-px bg-gray-100" />

            {/* Push Notifications */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 border border-orange-200 shadow-[0_4px_12px_rgba(249,115,22,0.1)]">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Pulse Engine</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Broadcast State</p>
                  </div>
                </div>
                <div className="relative inline-flex h-7 w-12 items-center rounded-full bg-primary shadow-[0_0_15px_rgba(45,212,191,0.4)]">
                  <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-6 shadow-md" />
                </div>
              </div>
               <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Autonomous notification system for ecosystem updates. Currently linked to Firebase Cloud Messaging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
