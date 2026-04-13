import { createClient } from '@/lib/supabase'
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function BannersPage() {
  const supabase = await createClient()

  const { data: banners, error } = await supabase
    .from('banners')
    .select('*')
    .order('position', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotional Banners</h1>
          <p className="text-gray-500">Manage home screen banners for the mobile app</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-600 transition-colors">
          <Plus size={20} />
          <span>Add New Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners?.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-40 w-full bg-gray-100">
              {banner.image_url ? (
                <Image 
                  src={banner.image_url} 
                  alt={banner.title || 'Banner'} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                {banner.is_active ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <CheckCircle size={12} /> Active
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <XCircle size={12} /> Inactive
                  </span>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate">{banner.title || 'Untitled Banner'}</h3>
              <p className="text-xs text-gray-500 mt-1 truncate">{banner.link_url || 'No redirect link'}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs font-medium text-gray-400">Position: {banner.position}</span>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                    Edit
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {(!banners || banners.length === 0) && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No banners found. Start by adding your first promotional banner.</p>
          </div>
        )}
      </div>
    </div>
  )
}
