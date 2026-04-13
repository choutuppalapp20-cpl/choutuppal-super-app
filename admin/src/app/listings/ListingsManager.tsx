'use client'

import { useState, useMemo } from 'react'
import { createClientBrowser } from '@/lib/supabase-client'
import { 
  CheckCircle, XCircle, Clock, Edit2, ExternalLink, Search, 
  Filter, ArrowUpDown, MoreVertical, Plus, LayoutGrid, Trash2 
} from 'lucide-react'
import AssetModal from './AssetModal'

export default function ListingsManager({ initialListings }: { initialListings: any[] }) {
  const [listings, setListings] = useState(initialListings)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All Assets')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<any>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const supabase = createClientBrowser()

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchesSearch = 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = 
        filterType === 'All Assets' || 
        (filterType === 'Real Estate' && item.type === 'Real Estate') ||
        (filterType === 'Business Services' && item.type === 'Business/Job') ||
        (filterType === 'Pending Audit' && item.status === 'pending')

      return matchesSearch && matchesFilter
    })
  }, [listings, searchQuery, filterType])

  const handleUpdateStatus = async (id: string, type: string, newStatus: string) => {
    setLoadingId(id)
    const table = type === 'Real Estate' ? 'real_estate_listings' : 'listings'
    
    try {
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setListings(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ))
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update status')
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to decommission this asset?')) return
    
    setLoadingId(id)
    const table = type === 'Real Estate' ? 'real_estate_listings' : 'listings'
    
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error

      setListings(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error('Error deleting asset:', err)
      alert('Failed to delete asset')
    } finally {
      setLoadingId(null)
    }
  }

  const handleSave = (updatedAsset: any) => {
    if (editingAsset) {
      setListings(prev => prev.map(item => 
        item.id === updatedAsset.id ? { ...item, ...updatedAsset } : item
      ))
    } else {
      setListings(prev => [updatedAsset, ...prev])
    }
    setIsModalOpen(false)
    setEditingAsset(null)
  }

  return (
    <div className="space-y-8">
      {/* Header & Search Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Ecosystem Assets</h1>
          <p className="text-sm text-gray-400 font-medium">Monitoring {filteredListings.length} results in the Choutuppal pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Query ecosystem..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-200/60 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all w-full md:w-64 font-medium shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            onClick={() => {
              setEditingAsset(null)
              setIsModalOpen(true)
            }}
          >
            <Plus size={18} /> New Asset
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All Assets', 'Real Estate', 'Business Services', 'Pending Audit'].map((label) => (
          <button 
            key={label} 
            onClick={() => setFilterType(label)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold border transition-all ${filterType === label ? 'bg-primary text-white border-primary shadow-[0_4px_12px_rgba(45,212,191,0.3)]' : 'bg-white text-gray-500 border-gray-100 hover:border-primary/40 hover:text-primary'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="glass rounded-[32px] overflow-hidden border-white/60 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Asset Identity</th>
                <th className="px-6 py-5">Classification</th>
                <th className="px-6 py-5">Custodian</th>
                <th className="px-6 py-5">Deployment State Status</th>
                <th className="px-6 py-5">Registered</th>
                <th className="px-8 py-5 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50 bg-white/40">
              {filteredListings.map((listing) => (
                <tr key={`${listing.id}-${listing.type}`} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       {listing.image_urls?.[0] && (
                        <img src={listing.image_urls[0]} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm border border-gray-100" />
                       )}
                       <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{listing.title}</span>
                        <span className="text-[11px] text-gray-400 font-medium truncate max-w-[200px] mt-0.5">{listing.description}</span>
                      </div>
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
                    <div className="flex items-center gap-2">
                      {listing.status === 'approved' ? (
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider w-fit">
                          Live & Active
                        </span>
                      ) : listing.status === 'rejected' ? (
                        <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider w-fit">
                          Rejected
                        </span>
                      ) : (
                        <span className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider w-fit">
                          Pending Audit
                        </span>
                      )}
                      
                      {/* Quick Status Toggles */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {listing.status !== 'approved' && (
                          <button 
                            onClick={() => handleUpdateStatus(listing.id, listing.type, 'approved')}
                            disabled={loadingId === listing.id}
                            className="p-1 text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Approve"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {listing.status !== 'rejected' && (
                          <button 
                            onClick={() => handleUpdateStatus(listing.id, listing.type, 'rejected')}
                            disabled={loadingId === listing.id}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Reject"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs text-gray-400 font-bold">
                    {new Date(listing.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                         onClick={() => {
                           setEditingAsset(listing)
                           setIsModalOpen(true)
                         }}
                         className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(listing.id, listing.type)}
                        disabled={loadingId === listing.id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredListings.length === 0 && (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <LayoutGrid size={32} className="text-gray-200" />
              </div>
              <p className="text-gray-400 font-bold tracking-tight">Zero asset matches found.</p>
            </div>
          )}
        </div>
      </div>

      <AssetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        asset={editingAsset}
      />
    </div>
  )
}
