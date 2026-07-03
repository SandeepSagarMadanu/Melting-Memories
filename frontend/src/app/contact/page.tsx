'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

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

export default function ContactPage() {
  const { whatsappNumber } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending - in production integrate with email/WhatsApp API
    setSent(true);
    setName(''); setEmail(''); setMessage('');
  };

  const cleanWA = whatsappNumber.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${cleanWA}?text=${encodeURIComponent("Hello Melting Memories! I have a query about your candles.")}`;

  return (
    <>
      <Header />
      <main className="flex-grow pt-28 pb-24 bg-ivory/30">

        {/* Page Header */}
        <div className="bg-white border-b border-rose/10 py-12 text-center mb-16">
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase block mb-3">We're Here to Help</span>
          <h1 className="font-luxury-serif text-4xl sm:text-5xl font-bold text-charcoal">Get In Touch</h1>
          <p className="text-sm text-charcoal/50 font-light mt-3 max-w-md mx-auto">
            Whether it's a custom order, a question about candle care, or simply saying hello — we'd love to hear from you.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left: Contact Info Cards */}
            <div className="space-y-5">
              {/* WhatsApp Card */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-rose/10 hover:border-green-300 rounded-2xl p-6 shadow-sm transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center text-[#25D366] flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <h3 className="font-luxury-serif text-lg font-bold text-charcoal group-hover:text-[#25D366] transition-colors">WhatsApp Chat</h3>
                    <p className="text-xs text-charcoal/50 font-light mb-2">Fastest response — we reply within minutes!</p>
                    <span className="text-sm font-semibold text-charcoal">{whatsappNumber}</span>
                  </div>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:meltingmemories0102@gmail.com"
                className="block bg-white border border-rose/10 hover:border-gold/30 rounded-2xl p-6 shadow-sm transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="font-luxury-serif text-lg font-bold text-charcoal group-hover:text-gold transition-colors">Email Us</h3>
                    <p className="text-xs text-charcoal/50 font-light mb-2">We respond within 24 business hours.</p>
                    <span className="text-sm font-semibold text-charcoal">meltingmemories0102@gmail.com</span>
                  </div>
                </div>
              </a>

              {/* Location Card */}
              <div className="bg-white border border-rose/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-rose/10 rounded-xl flex items-center justify-center text-rose flex-shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-luxury-serif text-lg font-bold text-charcoal mb-1">Studio Location</h3>
                    <p className="text-xs text-charcoal/50 font-light mb-1">Available for studio visits by appointment.</p>
                    <span className="text-sm font-medium text-charcoal">Hayathnagar, Hyderabad, Telangana, India</span>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/melting_memories__/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-rose/10 hover:border-purple-300 rounded-2xl p-6 shadow-sm transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Instagram size={22} />
                  </div>
                  <div>
                    <h3 className="font-luxury-serif text-lg font-bold text-charcoal group-hover:text-purple-500 transition-colors">Instagram</h3>
                    <p className="text-xs text-charcoal/50 font-light mb-1">Follow for latest designs and studio behind-the-scenes.</p>
                    <span className="text-sm font-semibold text-charcoal">@melting_memories__</span>
                  </div>
                </div>
              </a>

              {/* Mock Map */}
              <div className="h-48 rounded-2xl overflow-hidden border border-rose/10 shadow-sm bg-ivory flex items-center justify-center relative">
                <img
                  src="https://maps.googleapis.com/maps/api/staticmap?center=Hayathnagar,Hyderabad,India&zoom=13&size=600x300&key=DEMO"
                  alt="Studio Location Map"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ivory/80">
                  <div className="text-center">
                    <MapPin size={32} className="text-gold mx-auto mb-2" />
                    <span className="text-xs font-semibold text-charcoal">Hayathnagar, Hyderabad</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="bg-white border border-rose/10 rounded-2xl p-8 shadow-sm">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={52} className="text-gold mx-auto mb-4 animate-pulse" />
                  <h3 className="font-luxury-serif text-2xl font-bold text-charcoal mb-3">Message Sent!</h3>
                  <p className="text-sm text-charcoal/60 font-light mb-6">
                    Thank you for reaching out! Our team will respond within 24 hours.
                  </p>
                  <button onClick={() => setSent(false)} className="text-xs font-bold text-gold uppercase tracking-widest border-b border-gold">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-luxury-serif text-2xl font-bold text-charcoal mb-5 pb-3 border-b border-rose/10">
                    Send Us a Message
                  </h2>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                      className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-1.5">Your Message *</label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Tell us about your requirement, custom order, or query..."
                      required
                      className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-charcoal hover:bg-gold hover:text-charcoal text-white text-xs font-bold uppercase tracking-widest py-4 rounded-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Send size={14} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>
      <WhatsAppBubble />
      <BottomNavbar />
      <Footer />
    </>
  );
}
