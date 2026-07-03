'use client';

import React, { useState, useEffect } from 'react';
import { apiCall, MOCK_SETTINGS } from '@/utils/api';
import { Settings, Save, CheckCircle, Smartphone, Mail, MapPin, Truck, Percent } from 'lucide-react';

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

export default function AdminSettingsPage() {
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [shipping, setShipping] = useState('');
  const [tax, setTax] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await apiCall<any>('/settings');
    
    const settingsObj = data || MOCK_SETTINGS;
    setWhatsapp(settingsObj.WHATSAPP_NUMBER || '');
    setEmail(settingsObj.STORE_EMAIL || '');
    setAddress(settingsObj.STORE_ADDRESS || '');
    setInstagram(settingsObj.INSTAGRAM_URL || '');
    setShipping(settingsObj.SHIPPING_CHARGES || '');
    setTax(settingsObj.TAX_RATE || '');
    
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const payload = {
      settings: {
        WHATSAPP_NUMBER: whatsapp,
        STORE_EMAIL: email,
        STORE_ADDRESS: address,
        INSTAGRAM_URL: instagram,
        SHIPPING_CHARGES: shipping,
        TAX_RATE: tax
      }
    };

    const { data } = await apiCall('/settings', 'PUT', payload);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-charcoal">Global Configurations</h1>
        <p className="text-xs text-charcoal/50 mt-1">Configure company links, dispatch rates, GST rules, and WhatsApp support accounts.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm shimmer h-96 animate-pulse" />
      ) : (
        <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-4 rounded-xl flex items-center space-x-2 font-semibold animate-pulse">
              <CheckCircle size={16} />
              <span>Configurations updated and saved to server database successfully.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* WhatsApp */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 flex items-center space-x-1.5 mb-2">
                <Smartphone size={13} className="text-gold" />
                <span>WhatsApp Line *</span>
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                required
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-xs text-charcoal"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 flex items-center space-x-1.5 mb-2">
                <Mail size={13} className="text-gold" />
                <span>Contact Email *</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="store@gmail.com"
                className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-xs text-charcoal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Instagram */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 flex items-center space-x-1.5 mb-2">
                <Instagram size={13} className="text-gold" />
                <span>Instagram Profile URL *</span>
              </label>
              <input
                type="url"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                required
                placeholder="https://instagram.com/profile"
                className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-xs text-charcoal"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 flex items-center space-x-1.5 mb-2">
                <MapPin size={13} className="text-gold" />
                <span>Studio Location *</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                placeholder="Street address, City, State"
                className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-xs text-charcoal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
            {/* Shipping */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 flex items-center space-x-1.5 mb-2">
                <Truck size={13} className="text-gold" />
                <span>Flat Shipping Fee (₹) *</span>
              </label>
              <input
                type="number"
                value={shipping}
                onChange={e => setShipping(e.target.value)}
                required
                placeholder="50"
                className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-xs text-charcoal"
              />
            </div>

            {/* Tax */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 flex items-center space-x-1.5 mb-2">
                <Percent size={13} className="text-gold" />
                <span>GST Rate (Decimal Representation) *</span>
              </label>
              <input
                type="text"
                value={tax}
                onChange={e => setTax(e.target.value)}
                required
                placeholder="0.05 for 5%"
                className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-xs text-charcoal"
              />
              <span className="text-[10px] text-charcoal/40 mt-1 block">e.g. 0.05 represents a 5% tax.</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-gray-50 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-3.5 px-8 rounded-xl transition-all flex items-center space-x-2 shadow-md disabled:opacity-60"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
