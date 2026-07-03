'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function WhatsAppBubble() {
  const { whatsappNumber } = useCart();
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);

  // Hide WhatsApp bubble on admin pages
  if (pathname?.startsWith('/admin')) return null;

  // Show a helpful floating tooltip after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent("Hello Melting Memories! I'd like to inquire about handcrafted personalized candles.")}`;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-6 z-30 flex items-center space-x-2">
      {/* Tooltip Popup */}
      {showTooltip && (
        <div className="bg-white text-charcoal border border-gold/20 shadow-xl py-2 px-4 rounded-xl text-xs max-w-xs animate-float relative flex items-center space-x-2">
          <div className="flex flex-col">
            <span className="font-semibold text-gold text-[10px] uppercase tracking-wider">Melting Memories Help</span>
            <span className="text-charcoal-light font-medium">Chat on WhatsApp for custom designs!</span>
          </div>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-charcoal/40 hover:text-charcoal-light p-0.5 focus:outline-none"
            aria-label="Dismiss help alert"
          >
            <X size={12} />
          </button>
          {/* Arrow */}
          <div className="absolute right-3 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-white"></div>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] hover:bg-[#20ba56] text-white p-4 rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-108 flex items-center justify-center cursor-pointer"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle size={24} className="animate-pulse" />
      </a>
    </div>
  );
}
