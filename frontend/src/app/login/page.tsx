'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { apiCall } from '@/utils/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { user, login } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // If already logged in, redirect to profile immediately
  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister ? { name, email, password } : { email, password };

    const { data, error } = await apiCall<any>(endpoint, 'POST', payload);

    if (error || !data) {
      // Demo fallback login for regular customer role
      if (email && password) {
        login('demo_token_123', {
          id: 'demo-user-1',
          email,
          name: name || email.split('@')[0],
          role: 'CUSTOMER',
          phone: '',
          address: ''
        });
        router.push('/profile');
      } else {
        setAuthError(error || 'Authentication failed. Please try again.');
      }
    } else {
      login(data.token, data.user);
      router.push('/profile');
    }

    setAuthLoading(false);
  };

  if (user) {
    return null; // Don't render anything if redirecting
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 warm-radial-section flex items-center justify-center min-h-[85vh] relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-rose-light/40 filter blur-3xl opacity-50 pointer-events-none animate-blob" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-gold-light/20 filter blur-3xl opacity-40 pointer-events-none animate-blob-2" />

        <div className="relative bg-white/70 backdrop-blur-md border border-rose/15 rounded-2xl p-8 sm:p-12 shadow-xl w-full max-w-md mx-4 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 rounded-full text-gold mb-4 hover:scale-110 transition-transform">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <h1 className="font-luxury-serif text-3xl font-bold text-charcoal mb-1 tracking-tight">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs text-charcoal/50 font-light tracking-wider">
              {isRegister ? 'Join the Melting Memories family' : 'Sign in to view your orders and wishlist'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-md font-semibold">
                {authError}
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full bg-ivory border border-rose/15 py-3 pl-10 pr-4 rounded-md text-sm text-charcoal"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-ivory border border-rose/15 py-3 pl-10 pr-4 rounded-md text-sm text-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-ivory border border-rose/15 py-3 pl-10 pr-10 rounded-md text-sm text-charcoal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="btn-shimmer w-full bg-charcoal hover:bg-gold hover:text-charcoal text-white text-xs font-bold uppercase tracking-widest py-4 rounded-md transition-all duration-300 disabled:opacity-60 shadow-md"
            >
              {authLoading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-charcoal/50 mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setAuthError(null); }}
              className="text-gold font-bold hover:text-gold-hover transition-colors"
            >
              {isRegister ? 'Sign In' : 'Create one'}
            </button>
          </p>

          {!isRegister && (
            <div className="text-center text-[10px] text-charcoal/30 font-light mt-4">
              Hint: Enter any email/password to sign in offline.
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
