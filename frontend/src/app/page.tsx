'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

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
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductSlider from '@/components/ProductSlider';
import WhyChoose from '@/components/WhyChoose';
import ReviewSection from '@/components/ReviewSection';
import QuickCustomForm from '@/components/QuickCustomForm';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import { MOCK_CATEGORIES, getStoredCategories, getStoredProducts } from '@/utils/api';

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  // Initialize with MOCK_CATEGORIES (SSR-safe), hydrate from localStorage after mount
  const [categories, setCategories] = useState(MOCK_CATEGORIES);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCategories(getStoredCategories());
    const handler = () => setCategories(getStoredCategories());
    window.addEventListener('categoriesUpdated', handler);
    return () => window.removeEventListener('categoriesUpdated', handler);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      q: "How long do Melting Memories candles burn?",
      a: "Our single decorative candles (like the Peony Rose and Love Rose) burn for approximately 3-4 hours, while our Triple Rose Pillar burns for up to 6 hours. Our luxury glass Jar Candles burn for approximately 20-30 hours when wicks are trimmed correctly."
    },
    {
      q: "Do you offer personalization and custom orders?",
      a: "Yes, customization is our specialty! You can configure wicks, wax colors, fragrances (Vintage Lilly, Rose Bloom, Chocolate), custom text engravings on wax, or upload reference photo specs. Use our custom request forms, and we'll contact you directly."
    },
    {
      q: "Do you deliver across India?",
      a: "Yes! We offer secure, trackable Pan-India delivery from our studio in Hayathnagar, Hyderabad. Orders are shipped in signature gift boxes with protective linings to ensure zero transit damage."
    },
    {
      q: "What fragrances are available?",
      a: "Our signature collection offers three therapeutic aromas: Vintage Lilly (soft clean floral), Rose Bloom (romantic premium rose), and Chocolate (rich warm sweetness). We can custom mix oils on request for bulk corporate orders."
    },
    {
      q: "How long does shipping take?",
      a: "Standard orders are processed within 1-2 business days. Shipping takes 2-4 days within Telangana and 4-7 days for other parts of India. Custom bulk orders require 7-14 days depending on quantity and detailing specifications."
    }
  ];

  const instagramPosts = [
    { id: 1, img: 'https://images.unsplash.com/photo-1596435707261-05600be4db6a?w=400&auto=format&fit=crop&q=80', likes: '1.2k' },
    { id: 2, img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&auto=format&fit=crop&q=80', likes: '840' },
    { id: 3, img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&auto=format&fit=crop&q=80', likes: '2.1k' },
    { id: 4, img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80', likes: '960' }
  ];

  // Resolve image for a category: try to find a product image from the shop first
  const getCategoryImage = (category: any) => {
    if (!mounted) {
      if (category.id === 'cat-single') {
        return 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80';
      }
      if (category.id === 'cat-bouquets') {
        return 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80';
      }
      if (category.id === 'cat-jars') {
        return 'https://images.unsplash.com/photo-1602872030219-cbf948a910d8?w=600&auto=format&fit=crop&q=80';
      }
      return category.image || 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80';
    }

    try {
      const products = getStoredProducts();
      const catProducts = products.filter(p => p.categoryId === category.id);
      // Find the first product image that is not an SVG (or any image if only SVG is available)
      const imageProduct = catProducts.find(p => p.images && p.images[0] && !p.images[0].endsWith('.svg')) || catProducts[0];
      if (imageProduct && imageProduct.images && imageProduct.images[0]) {
        return imageProduct.images[0];
      }
    } catch (e) {
      console.error("Error fetching product image for category", e);
    }

    if (category.image && category.image.trim() !== '') {
      return category.image;
    }

    // Curated fallbacks
    if (category.id === 'cat-single') {
      return 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80';
    }
    if (category.id === 'cat-jars') {
      return 'https://images.unsplash.com/photo-1602872030219-cbf948a910d8?w=600&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, categoryId: string) => {
    const img = e.currentTarget;
    try {
      const products = getStoredProducts();
      const catProducts = products.filter(p => p.categoryId === categoryId);
      const imageProduct = catProducts.find(p => p.images && p.images[0] && !p.images[0].endsWith('.svg')) || catProducts[0];
      if (imageProduct && imageProduct.images && imageProduct.images[0]) {
        img.src = imageProduct.images[0];
        return;
      }
    } catch (err) { }

    if (categoryId === 'cat-single') {
      img.src = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80';
    } else if (categoryId === 'cat-jars') {
      img.src = 'https://images.unsplash.com/photo-1602872030219-cbf948a910d8?w=600&auto=format&fit=crop&q=80';
    } else {
      img.src = 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80';
    }
  };

  return (
    <>
      <Header />

      <main className="flex-grow">
        {/* Section 1: Hero Video Banner */}
        <HeroSection />

        {/* Section 2: Best Sellers Swipeable Slider */}
        <ProductSlider />

        {/* Section 3: Why Choose Us Cards */}
        <WhyChoose />

        {/* Section 4: Product Collections & Category Grid */}
        <section className="py-24 bg-white relative border-t border-rose/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-sans font-bold tracking-[0.3em] text-gold uppercase block mb-3">
                Curated Categories
              </span>
              <h2 className="font-luxury-serif text-3xl sm:text-5xl font-bold text-charcoal mb-4">
                Explore Collections
              </h2>
              <p className="text-sm text-charcoal/60 font-light leading-relaxed">
                From delicate floral shapes to elegant jar wicks and corporate bundles, select the perfect match for your mood or gifting event.
              </p>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.id}`}
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-md border border-rose/5 cursor-pointer block"
                >
                  {/* Backdrop Cover */}
                  <img
                    src={getCategoryImage(category)}
                    onError={(e) => handleImageError(e, category.id)}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col justify-end">
                    <h3 className="font-luxury-serif text-2xl font-bold mb-1 group-hover:text-gold transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-white/70 font-light line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Custom Candle Builder Studio */}
        <QuickCustomForm />

        {/* Section 6: Customer Reviews Carousels */}
        <ReviewSection />

        {/* FAQ Section */}
        <section className="py-24 bg-white border-t border-rose/10 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 text-gold mb-4">
                <HelpCircle size={22} />
              </div>
              <h2 className="font-luxury-serif text-3xl sm:text-4xl font-bold text-charcoal mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-charcoal/50 font-light">
                Find answers regarding shipping, custom layouts, burn details, and studio operations.
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-rose/15 hover:border-gold/30 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left px-6 py-5 bg-ivory/25 hover:bg-ivory/50 flex items-center justify-between focus:outline-none transition-colors"
                    >
                      <span className="font-luxury-serif text-base sm:text-lg font-bold text-charcoal">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp size={18} className="text-gold flex-shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-gold flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-6 py-5 bg-white border-t border-rose/10 text-sm text-charcoal/70 leading-relaxed font-light">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Instagram Grid Gallery */}
        <section className="py-24 bg-ivory border-t border-rose/10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <div className="mb-12">
              <span className="text-xs font-sans font-bold tracking-[0.3em] text-gold uppercase block mb-3">
                Social Showroom
              </span>
              <h2 className="font-luxury-serif text-3xl sm:text-5xl font-bold text-charcoal mb-4">
                @melting_memories__
              </h2>
              <p className="text-sm text-charcoal/60 font-light max-w-md mx-auto mb-6">
                Join our family of 10k+ followers. Tag us in your photos to get featured on our page.
              </p>

              <a
                href="https://www.instagram.com/melting_memories__/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-charcoal hover:bg-gold hover:text-charcoal text-white text-xs font-bold uppercase tracking-widest py-3 px-8 rounded-full transition-all shadow-md"
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
