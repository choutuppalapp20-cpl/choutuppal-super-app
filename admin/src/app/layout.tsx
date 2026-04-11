import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { LayoutDashboard, Users, Settings, Home, Link as LinkIcon, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Choutuppal Admin Dashboard',
  description: 'Manage Local Super App Data',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const headerList = await headers()
  const pathname = headerList.get('x-pathname') || ''
  
  // If no user and not on login page, middleware should handle it, 
  // but we can also hide UI elements here.
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <main className="min-h-screen bg-gray-950">
            {children}
          </main>
        </body>
      </html>
    )
  }

  async function logout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 text-white flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
              <h1 className="text-xl font-bold tracking-wider text-primary">CHOUTUPPAL</h1>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link href="/leads" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Users size={20} />
                <span className="font-medium">Real Estate Leads</span>
              </Link>
              <Link href="/affiliates" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <LinkIcon size={20} />
                <span className="font-medium">Auto-Affiliates</span>
              </Link>
              <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Settings size={20} />
                <span className="font-medium">Global Settings</span>
              </Link>
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-4">
              <form action={logout}>
                <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors">
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </form>
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400">
                <Home size={16} />
                <span>Super App v2.0</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50">
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">Admin Portal</h2>
              {user && (
                <div className="text-sm text-gray-500">
                  {user.email}
                </div>
              )}
            </header>
            <div className="p-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
