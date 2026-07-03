'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { MOCK_BLOGS } from '@/utils/api';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const blog = MOCK_BLOGS.find(b => b.slug === slug);
  const relatedBlogs = MOCK_BLOGS.filter(b => b.slug !== slug).slice(0, 2);

  if (!blog) {
    return (
      <>
        <Header />
        <div className="pt-28 min-h-screen bg-ivory flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-luxury-serif text-3xl font-bold text-charcoal mb-4">Article Not Found</h1>
            <Link href="/blog" className="bg-gold text-charcoal text-xs font-bold uppercase tracking-widest py-3 px-8 rounded-md">
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-28 pb-24 bg-ivory/30">

        {/* Hero Image */}
        <div className="w-full h-72 sm:h-96 bg-charcoal overflow-hidden relative mb-12">
          <img
            src={blog.image || 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=1600&auto=format&fit=crop&q=70'}
            alt={blog.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
              <span className="inline-block bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                {blog.category}
              </span>
              <h1 className="font-luxury-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center space-x-2 mt-4 text-white/60 text-xs">
                <Clock size={13} />
                <span>{blog.readTime}</span>
                <span>·</span>
                <span>Melting Memories Journal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back Link */}
          <Link href="/blog" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-charcoal/50 hover:text-gold transition-colors mb-8">
            <ArrowLeft size={13} />
            <span>All Articles</span>
          </Link>

          {/* Article Content */}
          <article className="bg-white border border-rose/10 rounded-2xl p-8 sm:p-12 shadow-sm mb-12">
            <div className="prose prose-sm max-w-none text-charcoal/75 font-light leading-relaxed">
              {blog.content.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>

            <hr className="my-8 border-rose/10" />

            {/* CTA within Blog */}
            <div className="bg-ivory/50 border border-gold/15 rounded-xl p-6 text-center">
              <h3 className="font-luxury-serif text-xl font-bold text-charcoal mb-2">
                Ready to Create a Memory?
              </h3>
              <p className="text-xs text-charcoal/60 font-light mb-4">
                Explore our handcrafted candle collections or design a completely personalized order.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/shop" className="bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-md transition-all">
                  Shop Collection
                </Link>
                <Link href="/custom-orders" className="border border-charcoal text-charcoal text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-md hover:bg-charcoal hover:text-white transition-all">
                  Custom Order
                </Link>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div>
              <h2 className="font-luxury-serif text-2xl font-bold text-charcoal mb-6 pb-3 border-b border-rose/10">
                You Might Also Enjoy
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedBlogs.map(related => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="bg-white border border-rose/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="aspect-video overflow-hidden bg-ivory">
                      <img src={related.image || ''} alt={related.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform" />
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider block mb-2">{related.category}</span>
                      <h3 className="font-luxury-serif text-base font-bold text-charcoal group-hover:text-gold transition-colors line-clamp-2 mb-2">{related.title}</h3>
                      <span className="text-[10px] font-bold text-charcoal/40 flex items-center space-x-1">
                        <Clock size={11} />
                        <span>{related.readTime}</span>
                      </span>
                    </div>
                  </Link>
                ))}
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
