import { createClient } from '@/lib/supabase'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AffiliatesPage() {
  const supabase = await createClient()

  const { data: keywords, error } = await supabase
    .from('affiliate_keywords')
    .select('*')
    .order('created_at', { ascending: false })

  async function addKeyword(formData: FormData) {
    'use server'
    const keyword = formData.get('keyword') as string
    const url = formData.get('url') as string
    
    if (!keyword || !url || keyword.trim() === '') return

    const adminDb = createAdminClient()
    await adminDb.from('affiliate_keywords').insert({
      keyword: keyword.trim(),
      affiliate_url: url.trim()
    })

    revalidatePath('/affiliates')
  }

  async function deleteKeyword(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    
    if (!id) return

    const adminDb = createAdminClient()
    await adminDb.from('affiliate_keywords').delete().eq('id', id)

    revalidatePath('/affiliates')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Keyword Affiliate Auto-Linking</h1>
        <p className="text-gray-500 mb-8">
          Define keywords here. The mobile app will automatically parse news/blog content and inject these affiliate links wherever the keywords appear.
        </p>

        {/* Add Form */}
        <form action={addKeyword} className="flex gap-4 items-end mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex-1">
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">Target Keyword phrase</label>
            <input 
              type="text" 
              name="keyword" 
              id="keyword" 
              placeholder="e.g. mobile phone" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">Affiliate URL</label>
            <input 
              type="url" 
              name="url" 
              id="url" 
              placeholder="https://amazon.in/..." 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors h-[42px]"
          >
            Add Link
          </button>
        </form>

        {/* List */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target URL</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {keywords && keywords.length > 0 ? keywords.map((k: any) => (
                <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-100">
                    {k.keyword}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                    <a href={k.affiliate_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      {k.affiliate_url}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteKeyword}>
                      <input type="hidden" name="id" value={k.id} />
                      <button type="submit" className="text-red-500 hover:text-red-700">Delete</button>
                    </form>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No affiliate keywords defined yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
