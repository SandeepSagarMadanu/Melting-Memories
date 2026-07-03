'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import { Clock, ArrowRight } from 'lucide-react';
import { MOCK_BLOGS, getStoredBlogs } from '@/utils/api';

const BLOG_CATEGORIES = ['All', 'Wedding Gifts', 'Birthday Gifts', 'Luxury Decor', 'Candle Care', 'Corporate Gifting'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  // Initialize with MOCK_BLOGS (SSR-safe), hydrate from localStorage after mount
  const [blogs, setBlogs] = useState(MOCK_BLOGS);

  useEffect(() => {
    setBlogs(getStoredBlogs());
    const handler = () => setBlogs(getStoredBlogs());
    window.addEventListener('blogsUpdated', handler);
    return () => window.removeEventListener('blogsUpdated', handler);
  }, []);

  const filteredBlogs = activeCategory === 'All'
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  return (
    <>
      <Header />
      <main className="flex-grow pt-28 pb-24 bg-ivory/30">

        {/* Page Banner */}
        <div className="bg-white border-b border-rose/10 py-12 text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-gold uppercase block mb-3">Stories & Insights</span>
          <h1 className="font-luxury-serif text-4xl sm:text-5xl font-bold text-charcoal mb-3">Our Journal</h1>
          <p className="text-sm text-charcoal/50 font-light max-w-md mx-auto">
            Discover candle care tips, gifting ideas, and behind-the-scenes artisan stories.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-1.5 px-5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                  activeCategory === cat
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'bg-white text-charcoal/70 border-rose/20 hover:border-gold hover:text-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="font-luxury-serif text-2xl font-bold text-charcoal mb-3">No Posts Yet</h3>
              <p className="text-sm text-charcoal/50">Check back soon for new articles in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map(blog => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="bg-white border border-rose/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gold/20 transition-all group block"
                >
                  {/* Image */}
                  <div className="aspect-video overflow-hidden bg-ivory">
                    <img
                      src={blog.image || 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <span className="inline-block bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                      {blog.category}
                    </span>
                    <h2 className="font-luxury-serif text-xl font-bold text-charcoal group-hover:text-gold transition-colors mb-3 leading-snug">
                      {blog.title}
                    </h2>
                    <p className="text-xs text-charcoal/60 font-light leading-relaxed line-clamp-3 mb-4">
                      {blog.content}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-rose/10">
                      <span className="flex items-center space-x-1 text-[10px] text-charcoal/40">
                        <Clock size={12} />
                        <span>{blog.readTime}</span>
                      </span>
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center space-x-1 group-hover:space-x-2 transition-all">
                        <span>Read More</span>
                        <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
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
