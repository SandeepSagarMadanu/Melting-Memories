'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  LayoutDashboard, ShoppingBag, ClipboardList, Palette, Star,
  Tag, Settings, Users, FileText, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/custom-orders', label: 'Custom Orders', icon: Palette },
  { href: '/admin/blogs', label: 'Blog Posts', icon: FileText },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const storedUser = localStorage.getItem('mm_user');
    if (!storedUser) {
      router.push('/admin/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'ADMIN') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8F7F5] flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-charcoal text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex flex-col">
            <span className="font-luxury-serif text-xl font-bold tracking-widest text-gold">MELTING</span>
            <span className="text-[9px] tracking-[0.35em] text-white/60 font-sans font-medium uppercase -mt-0.5">Memories Admin</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {adminNavItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between py-2.5 px-4 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-gold/20 text-gold border border-gold/25'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={17} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-gold" />}
              </Link>
            );
          })}
        </nav>

        {/* Admin User + Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-3 px-2">
            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
              <Users size={15} className="text-gold" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">{user?.name || 'Admin'}</span>
              <span className="text-[10px] text-white/40">{user?.email || ''}</span>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/admin/login'); }}
            className="w-full flex items-center space-x-2 py-2 px-4 text-xs font-semibold text-white/60 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-charcoal hover:text-gold focus:outline-none p-1"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-sm font-bold text-charcoal uppercase tracking-wider">
                {adminNavItems.find(i => pathname?.startsWith(i.href))?.label || 'Admin Panel'}
              </h1>
              <span className="text-[10px] text-charcoal/40">Melting Memories Control Center</span>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold text-charcoal/60 hover:text-gold flex items-center space-x-1.5 border border-gray-100 px-3 py-1.5 rounded-lg hover:border-gold/30 transition-all"
          >
            <span>View Storefront</span>
            <ChevronRight size={12} />
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
