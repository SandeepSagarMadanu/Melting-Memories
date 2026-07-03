'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Palette, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function BottomNavbar() {
  const pathname = usePathname();
  const { getCartItemsCount, user } = useCart();

  // Hide mobile navbar on admin views
  if (pathname?.startsWith('/admin')) return null;

  const tabs = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Custom', href: '/custom-orders', icon: Palette },
    { name: 'Cart', href: '/cart', icon: ShoppingCart, badge: true },
    { name: 'Profile', href: user ? '/profile' : '/login', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-rose/15 py-2 px-3 flex items-center justify-around z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        
        return (
          <Link 
            key={tab.name}
            href={tab.href}
            className="flex flex-col items-center justify-center flex-1 py-1 relative text-charcoal hover:text-gold transition-colors"
          >
            <div className={`p-1 rounded-full ${isActive ? 'text-gold' : 'text-charcoal/70'}`}>
              <Icon size={20} className={isActive ? 'scale-110 transition-transform' : ''} />
            </div>
            
            <span className={`text-[10px] tracking-wider font-medium mt-0.5 uppercase ${isActive ? 'text-gold font-bold' : 'text-charcoal/60'}`}>
              {tab.name}
            </span>

            {tab.badge && getCartItemsCount() > 0 && (
              <span className="absolute top-0 right-1/2 translate-x-4 bg-gold text-charcoal text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white">
                {getCartItemsCount()}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
