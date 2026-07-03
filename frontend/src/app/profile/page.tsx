'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import { User, ShoppingBag, Heart, LogOut, Package, Edit2, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { apiCall } from '@/utils/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, login, logout, wishlist, removeFromWishlist } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  // Statically check user authentication on client side
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Mock orders for display
  const mockOrders = user ? [
    { orderNumber: 'MM-100293', status: 'Delivered', date: '2026-05-15', total: '₹219', items: 'Peony Rose × 2, Love Rose × 1' },
    { orderNumber: 'MM-100187', status: 'Shipped', date: '2026-06-02', total: '₹99', items: 'Triple Rose Pillar × 1' },
  ] : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-ivory/30 flex items-center justify-center">
        <p className="text-sm text-charcoal/50 font-light animate-pulse">Redirecting to login...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: Edit2 }
  ];

  return (
    <>
      <Header />
      <main className="flex-grow pt-28 pb-24 bg-ivory/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Profile Banner */}
          <div className="bg-white border border-rose/10 rounded-2xl p-6 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gold/10 border-2 border-gold/20 rounded-full flex items-center justify-center">
                <User size={24} className="text-gold" />
              </div>
              <div>
                <h1 className="font-luxury-serif text-xl font-bold text-charcoal">{user.name}</h1>
                <span className="text-xs text-charcoal/50 font-light">{user.email}</span>
                {user.role === 'ADMIN' && (
                  <span className="ml-2 bg-gold/15 text-gold text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-gold/20">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  className="bg-gold text-charcoal text-xs font-bold uppercase tracking-widest py-2.5 px-5 rounded-md transition-all"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="flex items-center space-x-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors border border-red-200 py-2.5 px-4 rounded-md"
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Tab Nav */}
          <div className="flex space-x-2 mb-8 bg-white border border-rose/10 p-1.5 rounded-xl shadow-sm w-fit">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab.id
                      ? 'bg-charcoal text-white shadow-sm'
                      : 'text-charcoal/60 hover:text-charcoal'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {mockOrders.length === 0 ? (
                <div className="text-center py-16 bg-white border border-rose/10 rounded-2xl shadow-sm">
                  <ShoppingBag size={40} className="text-charcoal/20 mx-auto mb-4" />
                  <h3 className="font-luxury-serif text-xl font-bold text-charcoal mb-2">No Orders Yet</h3>
                  <p className="text-sm text-charcoal/50 font-light mb-6">Start shopping to see your orders here.</p>
                  <Link href="/shop" className="bg-gold text-charcoal text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-md">
                    Browse Collection
                  </Link>
                </div>
              ) : (
                mockOrders.map(order => (
                  <div key={order.orderNumber} className="bg-white border border-rose/10 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="font-luxury-serif text-base font-bold text-charcoal">{order.orderNumber}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-gold/10 text-gold'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal/60 font-light">{order.items}</p>
                      <span className="text-[10px] text-charcoal/40 mt-0.5 block">{order.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-gold text-base">{order.total}</span>
                      <button className="flex items-center space-x-1.5 border border-rose/15 hover:border-gold text-xs text-charcoal/60 hover:text-gold font-semibold py-2 px-3 rounded-md transition-all">
                        <Eye size={12} />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              {wishlist.length === 0 ? (
                <div className="text-center py-16 bg-white border border-rose/10 rounded-2xl shadow-sm">
                  <Heart size={40} className="text-charcoal/20 mx-auto mb-4" />
                  <h3 className="font-luxury-serif text-xl font-bold text-charcoal mb-2">Empty Wishlist</h3>
                  <p className="text-sm text-charcoal/50 font-light mb-6">Save products you love for later.</p>
                  <Link href="/shop" className="bg-gold text-charcoal text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-md">
                    Browse Collection
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {wishlist.map(item => (
                    <div key={item.id} className="bg-white border border-rose/10 rounded-2xl p-4 shadow-sm group">
                      <div className="aspect-square bg-ivory rounded-xl overflow-hidden mb-3">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform" />
                      </div>
                      <h3 className="font-luxury-serif text-base font-bold text-charcoal mb-1">{item.name}</h3>
                      <span className="text-sm font-bold text-gold block mb-3">₹{item.salePrice || item.price}</span>
                      <div className="flex items-center space-x-2">
                        <Link href={`/shop/${item.id}`} className="flex-1 bg-charcoal hover:bg-gold hover:text-charcoal text-white text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-md transition-all text-center">
                          View Product
                        </Link>
                        <button onClick={() => removeFromWishlist(item.id)} className="border border-rose/20 hover:border-red-400 hover:text-red-500 text-charcoal/40 p-2.5 rounded-md transition-all">
                          <Heart size={13} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white border border-rose/10 rounded-2xl p-8 shadow-sm max-w-lg">
              <h2 className="font-luxury-serif text-xl font-bold text-charcoal mb-5">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Name</label>
                  <input type="text" defaultValue={user.name} className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Email</label>
                  <input type="email" defaultValue={user.email} disabled className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md text-sm text-charcoal/60 cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Phone</label>
                  <input type="tel" defaultValue={user.phone || ''} placeholder="+91 XXXXX XXXXX" className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Delivery Address</label>
                  <textarea rows={3} defaultValue={user.address || ''} placeholder="Your delivery address" className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal resize-none" />
                </div>
                <button className="w-full bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-3.5 rounded-md transition-all">
                  Update Profile
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      <WhatsAppBubble />
      <BottomNavbar />
      <Footer />
    </>
  );
}
