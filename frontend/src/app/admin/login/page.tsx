'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { apiCall } from '@/utils/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useCart();

  const [email, setEmail] = useState('meltingmemories0102@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: apiError } = await apiCall<any>('/auth/login', 'POST', { email, password });

    if (apiError || !data) {
      // Fallback: allow demo admin login with any password
      if (email && password) {
        login('admin_demo_token', {
          id: 'admin-1',
          email,
          name: 'Delifa Anjum',
          role: 'ADMIN',
          phone: '+91 9441251145',
          address: 'Hayathnagar, Hyderabad'
        });
        router.push('/admin/dashboard');
      } else {
        setError('Please enter your email and password.');
      }
    } else {
      if (data.user?.role !== 'ADMIN') {
        setError('Access denied. Admin privileges required.');
      } else {
        login(data.token, data.user);
        router.push('/admin/dashboard');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gold rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold rounded-full filter blur-3xl" />
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-md border border-gold/10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center text-gold mx-auto mb-4">
            <Lock size={24} />
          </div>
          <h1 className="font-luxury-serif text-3xl font-bold text-charcoal mb-1">Admin Portal</h1>
          <p className="text-xs text-charcoal/50 font-light">Melting Memories Control Center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-md font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-1.5">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-ivory border border-rose/15 py-3 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full bg-ivory border border-rose/15 py-3 pl-4 pr-10 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-4 rounded-md transition-all disabled:opacity-60 shadow-lg shadow-gold/15"
          >
            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <p className="text-center text-[11px] text-charcoal/30 font-light mt-6">
          Hint: Enter any password with the admin email to sign in offline.
        </p>
      </div>
    </div>
  );
}
