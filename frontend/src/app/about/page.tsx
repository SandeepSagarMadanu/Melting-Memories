'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import { Heart, Target } from 'lucide-react';

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

// Scroll-reveal hook
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function AboutPage() {
  const founders = [
    {
      name: 'Delifa Anjum',
      title: 'Founder & Creative Director',
      bio: "Delifa's passion for preserving emotions through art inspired the creation of Melting Memories. With an eye for elegant detail and love for handcrafted beauty, she leads the artisan team in crafting each candle with precision and purpose.",
      image: '/founders/founder_delifa.png'
    },
    {
      name: 'Pasala Tharun',
      title: 'Co-Founder & Operations Head',
      bio: "Tharun manages end-to-end operations, ensuring every order is processed, packaged, and delivered with the brand's signature premium care. His logistics expertise enables seamless Pan-India delivery experiences.",
      image: '/founders/founder_tharun.png'
    },
    {
      name: 'Madanu Sandeep Sagar',
      title: 'Co-Founder & Technology Lead',
      bio: 'Sandeep oversees the digital presence and technology infrastructure of Melting Memories, building platforms that make luxury handcrafted candles accessible to customers across India and beyond.',
      image: '/founders/founder_sandeep.png'
    }
  ];

  // Refs for each animated section
  const heroBannerRef   = useReveal();
  const storyTextRef    = useReveal();
  const storyImageRef   = useReveal();
  const missionRef      = useReveal();
  const visionRef       = useReveal();
  const foundersHeadRef = useReveal();
  const founder1Ref     = useReveal();
  const founder2Ref     = useReveal();
  const founder3Ref     = useReveal();
  const ctaRef          = useReveal();

  return (
    <>
      <Header />
      <main className="flex-grow pt-28 pb-24 bg-ivory/30">

        {/* Hero Banner */}
        <section className="relative py-24 bg-charcoal text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1600&auto=format&fit=crop&q=70"
              alt="Luxury Candles Studio"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-charcoal/70" />
          <div
            ref={heroBannerRef}
            className="reveal reveal-up relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase block mb-3">Our Story</span>
            <h1 className="font-luxury-serif text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              The Artisans Behind<br />
              <span className="italic text-gold font-light">The Memories</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
              Born from a passion for preserving emotions through handcrafted artistry. Every candle illuminates a story, a moment, a memory.
            </p>
          </div>
        </section>

        {/* Brand Story — split reveal */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

              {/* Text — slides in from left */}
              <div ref={storyTextRef} className="reveal reveal-left">
                <span className="text-xs font-bold tracking-widest text-gold uppercase block mb-3">How It Began</span>
                <h2 className="font-luxury-serif text-3xl sm:text-4xl font-bold text-charcoal mb-5">
                  Melting Memories Was Born From Love
                </h2>
                <div className="space-y-4 text-sm text-charcoal/70 font-light leading-relaxed">
                  <p>
                    Melting Memories was born from a profound passion for preserving emotions through handcrafted artistry. Our founders believed that candles are more than a source of warm light — they are timeless keepsakes that can carry the essence of a cherished moment.
                  </p>
                  <p>
                    From a small creative studio in Hayathnagar, Hyderabad, we hand-pour each candle with premium wax blends and therapeutic fragrance oils. Every design is meticulously sculpted and inspected to ensure it meets our exacting standards of luxury.
                  </p>
                  <p>
                    What started as a creative dream became India's most love-driven personalized candle studio — where artistry, emotion, and elegance meet in every wick.
                  </p>
                </div>
              </div>

              {/* Image — slides in from right */}
              <div ref={storyImageRef} className="reveal reveal-right relative">
                <img
                  src="https://images.unsplash.com/photo-1541256996761-85df2efaa164?w=600&auto=format&fit=crop&q=80"
                  alt="Melting Memories Studio"
                  className="rounded-2xl shadow-xl w-full aspect-square object-cover border border-rose/10"
                />
                <div className="absolute -bottom-5 -left-5 bg-gold text-charcoal rounded-2xl p-4 shadow-xl">
                  <span className="font-luxury-serif text-2xl font-bold block">500+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Happy Customers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-ivory/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div ref={missionRef} className="reveal reveal-left bg-white border border-rose/10 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full filter blur-2xl" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold mb-5">
                    <Heart size={22} />
                  </div>
                  <h3 className="font-luxury-serif text-2xl font-bold text-charcoal mb-4">Our Mission</h3>
                  <p className="text-sm text-charcoal/70 font-light leading-relaxed italic">
                    "To transform precious memories into handcrafted luxury candles that create lasting emotional connections."
                  </p>
                </div>
              </div>

              <div ref={visionRef} className="reveal reveal-right delay-200 bg-charcoal border border-gold/10 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full filter blur-2xl" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center text-gold mb-5">
                    <Target size={22} />
                  </div>
                  <h3 className="font-luxury-serif text-2xl font-bold text-white mb-4">Our Vision</h3>
                  <p className="text-sm text-white/70 font-light leading-relaxed italic">
                    "To become India's most loved premium personalized candle brand — making every occasion extraordinary, one handcrafted flame at a time."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Founders — staggered cards */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            <div ref={foundersHeadRef} className="reveal reveal-up text-center mb-14">
              <span className="text-xs font-bold tracking-widest text-gold uppercase block mb-3">The Dream Team</span>
              <h2 className="font-luxury-serif text-3xl sm:text-5xl font-bold text-charcoal">
                Meet the Founders
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Founder 1 */}
              <div
                ref={founder1Ref}
                className="reveal reveal-up delay-100 group bg-ivory border border-rose/10 rounded-2xl p-7 shadow-sm text-center hover:shadow-xl hover:border-gold/30 hover-gold-pulse transition-all duration-400 cursor-default"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-5 border-4 border-gold/20 shadow-lg group-hover:border-gold/50 transition-all duration-300 group-hover:scale-105">
                  <img src={founders[0].image} alt={founders[0].name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-luxury-serif text-xl font-bold text-charcoal mb-1">{founders[0].name}</h3>
                <span className="block text-xs font-bold uppercase tracking-widest text-gold mb-4">{founders[0].title}</span>
                <p className="text-xs text-charcoal/65 font-light leading-relaxed">{founders[0].bio}</p>
              </div>

              {/* Founder 2 */}
              <div
                ref={founder2Ref}
                className="reveal reveal-up delay-300 group bg-ivory border border-rose/10 rounded-2xl p-7 shadow-sm text-center hover:shadow-xl hover:border-gold/30 hover-gold-pulse transition-all duration-400 cursor-default"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-5 border-4 border-gold/20 shadow-lg group-hover:border-gold/50 transition-all duration-300 group-hover:scale-105">
                  <img src={founders[1].image} alt={founders[1].name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-luxury-serif text-xl font-bold text-charcoal mb-1">{founders[1].name}</h3>
                <span className="block text-xs font-bold uppercase tracking-widest text-gold mb-4">{founders[1].title}</span>
                <p className="text-xs text-charcoal/65 font-light leading-relaxed">{founders[1].bio}</p>
              </div>

              {/* Founder 3 */}
              <div
                ref={founder3Ref}
                className="reveal reveal-up delay-500 group bg-ivory border border-rose/10 rounded-2xl p-7 shadow-sm text-center hover:shadow-xl hover:border-gold/30 hover-gold-pulse transition-all duration-400 cursor-default"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-5 border-4 border-gold/20 shadow-lg group-hover:border-gold/50 transition-all duration-300 group-hover:scale-105">
                  <img src={founders[2].image} alt={founders[2].name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-luxury-serif text-xl font-bold text-charcoal mb-1">{founders[2].name}</h3>
                <span className="block text-xs font-bold uppercase tracking-widest text-gold mb-4">{founders[2].title}</span>
                <p className="text-xs text-charcoal/65 font-light leading-relaxed">{founders[2].bio}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-charcoal text-white text-center">
          <div ref={ctaRef} className="reveal reveal-scale max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-luxury-serif text-3xl sm:text-4xl font-bold mb-4">
              Let's Create Something <span className="text-gold italic">Beautiful Together</span>
            </h2>
            <p className="text-sm text-white/70 font-light mb-8 leading-relaxed">
              From birthdays to boardrooms — our candles carry your story with elegance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-4 px-8 rounded-md transition-all"
              >
                Shop Collection
              </Link>
              <a
                href="https://www.instagram.com/melting_memories__/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border border-white/30 hover:border-white text-white text-xs font-bold uppercase tracking-widest py-4 px-8 rounded-md transition-all flex items-center space-x-2"
              >
                <Instagram size={14} />
                <span>Follow on Instagram</span>
              </a>
            </div>
          </div>
        </section>

      </main>
      <WhatsAppBubble />
      <BottomNavbar />
      <Footer />
    </>
  );
}
