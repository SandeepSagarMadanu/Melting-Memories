'use client';

import React from 'react';
import { Palette, Heart, Gift, Sparkles, Box, Flame } from 'lucide-react';

export default function WhyChoose() {
  const cards = [
    {
      icon: Palette,
      title: 'Handcrafted Artistry',
      desc: 'Each candle is individually sculpted and hand-poured in small batches, ensuring unique character and attention to detail.'
    },
    {
      icon: Flame,
      title: 'Premium Fragrances',
      desc: 'Infused with therapeutic essential oils and premium fragrance formulations, creating clean burns and long-lasting aroma throw.'
    },
    {
      icon: Sparkles,
      title: 'Personalized Designs',
      desc: 'Tailor shapes, sizes, colors, and add customized monograms, engraving messages to celebrate special milestone moments.'
    },
    {
      icon: Box,
      title: 'Luxury Packaging',
      desc: 'Our signature boxes feature champagne gold detailing and protective inner linings, ready to present as an exquisite keepsake.'
    },
    {
      icon: Gift,
      title: 'Perfect For Gifting',
      desc: 'Designed with emotions in mind. Ideal for weddings, anniversaries, corporate delegations, baby showers, or birthday celebrations.'
    },
    {
      icon: Heart,
      title: 'Made With Love',
      desc: 'Every single wick is set, wax is heated, and design polished with extreme care, carrying love from hayathnagar to your home.'
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      {/* Decorative backdrop shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-rose-light/50 filter blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gold-light/20 filter blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-sans font-bold tracking-[0.3em] text-gold uppercase block mb-3">
            The Melting Memories Promise
          </span>
          <h2 className="font-luxury-serif text-3xl sm:text-5xl font-bold text-charcoal mb-4">
            Bespoke Quality in Every Wick
          </h2>
          <p className="text-sm sm:text-base text-charcoal/60 font-light leading-relaxed">
            We believe that a candle should do more than illuminate space; it should evoke memory and touch hearts through premium craftsmanship.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-ivory/40 hover:bg-white border border-rose/10 hover:border-gold/30 p-8 rounded-2xl shadow-[0_4px_24px_rgba(43,43,43,0.02)] hover:shadow-[0_10px_35px_rgba(212,175,55,0.06)] transition-all duration-300 group hover:translate-y-[-4px]"
              >
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={22} />
                </div>

                {/* Content */}
                <h3 className="font-luxury-serif text-xl font-bold text-charcoal mb-3 group-hover:text-gold transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-charcoal/65 font-light leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
