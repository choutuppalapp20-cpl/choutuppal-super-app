'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Loader2, Tag, Info } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import { saveListingAction } from './actions'

interface AssetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (asset: any) => void
  asset?: any
}

export default function AssetModal({ isOpen, onClose, onSave, asset }: AssetModalProps) {
  const [type, setType] = useState<'Business/Job' | 'Real Estate'>('Business/Job')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'General',
    property_type: 'Plot',
    image_urls: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (asset) {
      setType(asset.type)
      setFormData({
        title: asset.title || '',
        description: asset.description || '',
        price: asset.price?.toString() || '',
        category: asset.category || 'General',
        property_type: asset.property_type || 'Plot',
        image_urls: asset.image_urls || [],
      })
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'General',
        property_type: 'Plot',
        image_urls: [],
      })
    }
  }, [asset, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload: any = {
      title: formData.title,
      description: formData.description,
      image_urls: formData.image_urls,
      status: asset?.status || 'approved',
    }

    if (type === 'Real Estate') {
      payload.price = parseFloat(formData.price) || 0
      payload.property_type = formData.property_type
    } else {
      payload.category = formData.category
    }

    console.log('Deploying asset to server...', { type, assetId: asset?.id, payload })

    try {
      const { data, error } = await saveListingAction(payload, type, asset?.id)

      if (error) {
        console.error('Action failed:', error)
        alert(`Server error: ${error}`)
        return
      }

      console.log('Asset successfully deployed:', data)
      onSave(data)
    } catch (err) {
      console.error('Unexpected UI error during save:', err)
      alert('An unexpected error occurred in the browser console. See details there.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {asset ? 'Optimize Existing Asset' : 'Register New Ecosystem Asset'}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Operational Console</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-100 shadow-sm">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {!asset && (
            <div className="flex p-1.5 bg-gray-100 rounded-2xl w-fit">
              {['Business/Job', 'Real Estate'].map((t: any) => (
                <button 
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${type === t ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 col-span-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Asset Identity (Title)</label>
               <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Premium Plot in Choutuppal Phase 1"
                    className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
               </div>
            </div>

            <div className="space-y-4 col-span-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Detailed Log (Description)</label>
               <div className="relative">
                  <Info className="absolute left-4 top-4 text-gray-300" size={18} />
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Detailed specifications of the asset..."
                    className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                  />
               </div>
            </div>

            {type === 'Real Estate' ? (
              <>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Valuation (Price INR)</label>
                  <input 
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="2500000"
                    className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Classification (Type)</label>
                  <select 
                    value={formData.property_type}
                    onChange={e => setFormData({...formData, property_type: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="Plot">Plot</option>
                    <option value="Residential">Residential House</option>
                    <option value="Commercial">Commercial Space</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="space-y-4 col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Sector (Category)</label>
                <input 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  placeholder="Retail, Service, IT, etc."
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Visual Assets (Images)</label>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.image_urls.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, image_urls: formData.image_urls.filter((_, idx) => idx !== i)})}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-group/hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                <CldUploadWidget 
                  onSuccess={(result: any) => {
                    console.log('Cloudinary success result:', result);
                    const url = result?.info?.secure_url;
                    if (url) {
                      setFormData(prev => ({...prev, image_urls: [...prev.image_urls, url]}))
                    } else {
                      console.warn('No secure_url found in Cloudinary result info. Check response structure.')
                    }
                  }}
                  onError={(error) => {
                    console.error('Cloudinary Widget Error:', error);
                    alert('Image upload failed. Check the console for Cloudinary details.')
                  }}
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                >
                  {({ open }) => (
                    <button 
                      type="button"
                      onClick={() => open()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 hover:border-primary/40 hover:bg-primary/[0.02] transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                      <Upload className="text-gray-300 group-hover:text-primary transition-colors" size={24} />
                      <span className="text-[10px] font-black text-gray-400 group-hover:text-primary">UPLOAD</span>
                    </button>
                  )}
                </CldUploadWidget>
             </div>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-end gap-3 bg-gray-50/30">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl text-xs font-black text-gray-400 hover:text-gray-600 transition-all">
            CANCEL REQUEST
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-brand-dark text-white px-8 py-3 rounded-2xl font-black text-sm hover:shadow-xl active:scale-95 transition-all flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'DEPLOY ASSET'}
          </button>
        </div>
      </div>
    </div>
  )
}
