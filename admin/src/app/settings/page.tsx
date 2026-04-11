import { createClient } from '@/lib/supabase'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: setting } = await supabase
    .from('global_settings')
    .select('value')
    .eq('key', 'free_stories_enabled')
    .single()

  const isEnabled = setting?.value === 'true'

  async function toggleStories(formData: FormData) {
    'use server'
    const newStatus = formData.get('status') === 'true' ? 'false' : 'true'
    
    // Use the Service Role client to bypass RLS since the admin has no frontend login state
    const adminDb = createAdminClient()
    await adminDb
      .from('global_settings')
      .upsert({ key: 'free_stories_enabled', value: newStatus, updated_at: new Date().toISOString() })

    revalidatePath('/settings')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Global Settings</h1>
        <p className="text-gray-500 mb-8">Manage application-wide controls and feature flags.</p>

        <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Free Stories Paywall</h3>
            <p className="text-sm text-gray-500 mt-1">
              Toggle whether basic users can post stories for free. If disabled, they will hit a paywall popup.
            </p>
          </div>
          <form action={toggleStories}>
            <input type="hidden" name="status" value={isEnabled ? 'true' : 'false'} />
            <button 
              type="submit"
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isEnabled ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span className="sr-only">Toggle Free Stories</span>
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </form>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">Currently: {isEnabled ? 'ENABLED' : 'PAYWALLED'}</span>
        </div>
      </div>
    </div>
  )
}
