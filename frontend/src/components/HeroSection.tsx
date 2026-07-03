'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Sparkles, Truck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Product Image Background */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: "url('/hero-candles.png')",
          backgroundPosition: 'center 60%',
        }}
      />

      {/* Dark veil — light enough to see the candles */}
      <div className="absolute inset-0 bg-charcoal/40" />

      {/* Luxury Golden Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/30 via-transparent to-charcoal/30" />


      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">

        {/* Soft Accent Tag */}
        <div className="inline-flex items-center space-x-2 bg-gold/15 border border-gold/30 py-1.5 px-4 rounded-full mb-6 animate-float">
          <Sparkles size={14} className="text-gold" />
          <span className="text-[11px] tracking-[0.25em] text-gold font-sans font-semibold uppercase">
            Bespoke Handcrafted Luxury
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-luxury-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
          Every Candle <span className="font-light italic text-gold">Holds A Memory</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-ivory/80 font-light max-w-3xl mx-auto mb-10 leading-relaxed">
          Luxury handcrafted personalized candles designed to celebrate love, milestones, emotions, and unforgettable moments.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-charcoal font-semibold uppercase tracking-widest text-xs py-4 px-8 rounded-md transition-all duration-300 transform hover:translate-y-[-2px] shadow-[0_4px_20px_rgba(212,175,55,0.25)] text-center border border-gold"
          >
            Shop Collection
          </Link>
          <Link
            href="/custom-orders"
            className="w-full sm:w-auto bg-transparent hover:bg-white/5 text-white font-semibold uppercase tracking-widest text-xs py-4 px-8 rounded-md transition-all duration-300 text-center border border-white/40 hover:border-white"
          >
            Create Custom Candle
          </Link>
        </div>

        {/* Trust Indicators (4 Columns Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-white/10 pt-8">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-gold/25 flex items-center justify-center text-gold mb-2">
              <Award size={18} />
            </div>
            <span className="text-xs text-white/90 tracking-wider font-semibold uppercase">100% Handmade</span>
            <span className="text-[10px] text-white/50 font-light mt-0.5">Artisanal Pouring</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-gold/25 flex items-center justify-center text-gold mb-2">
              <Sparkles size={18} />
            </div>
            <span className="text-xs text-white/90 tracking-wider font-semibold uppercase">Personalized Gifts</span>
            <span className="text-[10px] text-white/50 font-light mt-0.5">Bespoke Engravings</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-gold/25 flex items-center justify-center text-gold mb-2">
              <ShieldCheck size={18} />
            </div>
            <span className="text-xs text-white/90 tracking-wider font-semibold uppercase">Premium Fragrances</span>
            <span className="text-[10px] text-white/50 font-light mt-0.5">Therapeutic Oils</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-gold/25 flex items-center justify-center text-gold mb-2">
              <Truck size={18} />
            </div>
            <span className="text-xs text-white/90 tracking-wider font-semibold uppercase">Pan India Delivery</span>
            <span className="text-[10px] text-white/50 font-light mt-0.5">Secure Packaging</span>
          </div>
        </div>

      </div>
    </section>
  );
}
