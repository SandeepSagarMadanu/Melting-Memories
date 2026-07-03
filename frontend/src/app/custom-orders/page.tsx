'use client';

import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import QuickCustomForm from '@/components/QuickCustomForm';
import { Palette, Sparkles, Gift } from 'lucide-react';

// Reusable scroll-reveal hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function CustomOrdersPage() {
  const bannerRef  = useScrollReveal();
  const card1Ref   = useScrollReveal();
  const card2Ref   = useScrollReveal();
  const card3Ref   = useScrollReveal();
  const formRef    = useScrollReveal();

  return (
    <>
      <Header />
      <main className="flex-grow pt-28 pb-24 bg-ivory/30">

        {/* Banner Section */}
        <div className="bg-charcoal text-white py-20 text-center relative overflow-hidden mb-16">
          {/* Background image */}
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1541256996761-85df2efaa164?w=1600&auto=format&fit=crop&q=70"
              alt="Custom Candle Crafting"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Gradient veil */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 to-charcoal/95" />

          <div
            ref={bannerRef}
            className="reveal reveal-up relative z-10 max-w-4xl mx-auto px-4"
          >
            <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase block mb-3 delay-100">
              Bespoke &amp; Handcrafted
            </span>
            <h1 className="font-luxury-serif text-4xl sm:text-6xl font-bold mb-5 leading-tight">
              Custom Candle{' '}
              <span className="text-gold italic font-light">Ordering</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 font-light max-w-xl mx-auto mb-8 leading-relaxed">
              Create perfect personalized candles for weddings, corporate gifts,
              birthdays, or special moments.
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3 opacity-40">
              <span className="h-px w-16 bg-gold block" />
              <Sparkles size={14} className="text-gold" />
              <span className="h-px w-16 bg-gold block" />
            </div>
          </div>
        </div>

        {/* Info Grid — staggered cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

            {/* Card 1 */}
            <div
              ref={card1Ref}
              className="reveal reveal-up delay-100 bg-white border border-rose/10 p-10 rounded-2xl shadow-sm hover:shadow-lg hover:border-gold/25 hover-gold-pulse transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mx-auto mb-5 group-hover:bg-gold/20 transition-colors">
                <Palette size={22} />
              </div>
              <h3 className="font-luxury-serif text-xl font-bold text-charcoal mb-3">
                Personalized Design
              </h3>
              <p className="text-sm text-charcoal/60 font-light leading-relaxed">
                Choose custom message engravings, specialized label layouts, or
                shape specifications that reflect your personality.
              </p>
            </div>

            {/* Card 2 */}
            <div
              ref={card2Ref}
              className="reveal reveal-up delay-300 bg-white border border-rose/10 p-10 rounded-2xl shadow-sm hover:shadow-lg hover:border-gold/25 hover-gold-pulse transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mx-auto mb-5 group-hover:bg-gold/20 transition-colors">
                <Sparkles size={22} />
              </div>
              <h3 className="font-luxury-serif text-xl font-bold text-charcoal mb-3">
                Bespoke Fragrances
              </h3>
              <p className="text-sm text-charcoal/60 font-light leading-relaxed">
                Select from our signature aromatherapy scents including Vintage
                Lilly, Rose Bloom, and Chocolate — or blend your own.
              </p>
            </div>

            {/* Card 3 */}
            <div
              ref={card3Ref}
              className="reveal reveal-up delay-500 bg-white border border-rose/10 p-10 rounded-2xl shadow-sm hover:shadow-lg hover:border-gold/25 hover-gold-pulse transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mx-auto mb-5 group-hover:bg-gold/20 transition-colors">
                <Gift size={22} />
              </div>
              <h3 className="font-luxury-serif text-xl font-bold text-charcoal mb-3">
                Perfect For Gifting
              </h3>
              <p className="text-sm text-charcoal/60 font-light leading-relaxed">
                Individually boxed and styled, our custom candles make
                extraordinary keepsakes for any celebration or corporate event.
              </p>
            </div>
          </div>
        </section>

        {/* Custom Order Form — scale-in on scroll */}
        <div ref={formRef} className="reveal reveal-scale">
          <QuickCustomForm />
        </div>

      </main>
      <WhatsAppBubble />
      <BottomNavbar />
      <Footer />
    </>
  );
}
