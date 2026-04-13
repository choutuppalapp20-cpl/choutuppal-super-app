import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { LayoutDashboard, Users, Settings, Home, Link as LinkIcon, LogOut, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Choutuppal 2.0 Admin Console',
  description: 'Manage Local Super App Ecosystem',
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
          <aside className="w-68 bg-brand-dark text-white flex flex-col shadow-2xl relative z-10">
            <div className="h-20 flex items-center px-8 border-b border-gray-800/50 bg-brand-dark/50 backdrop-blur-sm">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  CHOUTUPPAL <span className="text-primary text-xs ml-1 bg-primary/10 px-2 py-0.5 rounded-full">v2.0</span>
                </h1>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mt-1">Admin Console</span>
              </div>
            </div>
            
            <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
              <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Core Management</p>
              
              <Link href="/" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${pathname === '/' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                <LayoutDashboard size={20} className={pathname === '/' ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                <span className="font-semibold text-sm">Dashboard</span>
              </Link>

              <Link href="/listings" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${pathname === '/listings' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                <LayoutGrid size={20} className={pathname === '/listings' ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                <span className="font-semibold text-sm">Listings Management</span>
              </Link>

              <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4">Growth & Revenue</p>

              <Link href="/leads" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${pathname === '/leads' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                <Users size={20} className={pathname === '/leads' ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                <span className="font-semibold text-sm">Real Estate Leads</span>
              </Link>

              <Link href="/affiliates" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${pathname === '/affiliates' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                <LinkIcon size={20} className={pathname === '/affiliates' ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                <span className="font-semibold text-sm">Auto-Affiliates</span>
              </Link>

              <Link href="/marketing" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${pathname === '/marketing' || pathname === '/banners' || pathname === '/settings' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                <ImageIcon size={20} className={pathname === '/marketing' ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                <span className="font-semibold text-sm">Marketing & Stories</span>
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
          <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#F8FAFC]">
            <header className="h-20 glass border-b border-gray-200/60 flex items-center justify-between px-10 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                  {pathname === '/' ? 'Operational Insight' : 
                   pathname === '/listings' ? 'Ecosystem Assets' :
                   pathname === '/marketing' ? 'Growth Console' : 
                   pathname === '/leads' ? 'Revenue Opportunities' : 'Management Portal'}
                </h2>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Physical Territory: Choutuppal Region</p>
              </div>
              
              {user && (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-900 leading-none">{user.email?.split('@')[0]}</span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">Super Administrator</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                </div>
              )}
            </header>
            <div className="p-10 max-w-7xl mx-auto w-full mb-12">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
