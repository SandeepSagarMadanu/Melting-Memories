'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

const Instagram = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
import { useCart } from '@/context/CartContext';

export default function Footer() {
  const { whatsappNumber } = useCart();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-charcoal text-white pt-16 pb-8 border-t border-gold/15 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Info */}
          <div>
            <Link href="/" className="flex flex-col mb-4">
              <span className="font-luxury-serif text-3xl font-bold tracking-widest text-gold">
                MELTING
              </span>
              <span className="text-[11px] tracking-[0.42em] text-white/80 font-sans font-medium uppercase pl-0.5">
                Memories
              </span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed font-light mb-6">
              Transforming precious memories into handcrafted luxury candles designed to celebrate love, milestones, emotions, and unforgettable moments.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/melting_memories__/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-white/80 hover:text-gold hover:border-gold transition-colors"
                aria-label="Instagram Profile"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-luxury-serif text-lg font-semibold tracking-wider text-gold mb-6 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3.5 text-sm font-light text-white/80">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors">Shop Catalog</Link>
              </li>
              <li>
                <Link href="/custom-orders" className="hover:text-gold transition-colors">Create Custom Candle</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">Artisan Story</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-gold transition-colors">Wellness Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">Get In Touch</Link>
              </li>
            </ul>
          </div>

          {/* Policies Links */}
          <div>
            <h3 className="font-luxury-serif text-lg font-semibold tracking-wider text-gold mb-6 uppercase">
              Our Policies
            </h3>
            <ul className="space-y-3.5 text-sm font-light text-white/80">
              <li>
                <Link href="/policies/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/policies/refund" className="hover:text-gold transition-colors">Refund & Return Policy</Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-gold transition-colors">Shipping Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-luxury-serif text-lg font-semibold tracking-wider text-gold mb-6 uppercase">
              Location & Details
            </h3>
            <ul className="space-y-4 text-sm font-light text-white/80">
              <li className="flex items-start">
                <MapPin size={18} className="text-gold mr-3 mt-0.5 flex-shrink-0" />
                <span>Hayathnagar, Hyderabad, Telangana, India</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-gold mr-3 flex-shrink-0" />
                <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                  {whatsappNumber}
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-gold mr-3 flex-shrink-0" />
                <a href="mailto:meltingmemories0102@gmail.com" className="hover:text-gold transition-colors">
                  meltingmemories0102@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <hr className="border-white/10 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 font-light">
          <div>
            <p>Copyright © 2026 Melting Memories. All Rights Reserved.</p>
            <p className="mt-1">Designed by Delifa Anjum, Pasala Tharun & Madanu Sandeep Sagar.</p>
          </div>

          <button
            onClick={handleScrollTop}
            className="mt-4 sm:mt-0 flex items-center space-x-2 bg-charcoal-light/60 hover:bg-gold hover:text-charcoal border border-white/10 hover:border-gold py-2 px-4 rounded-full transition-all text-white"
            aria-label="Scroll to top of page"
          >
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
