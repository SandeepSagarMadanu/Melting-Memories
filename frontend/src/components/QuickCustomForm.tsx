'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Upload } from 'lucide-react';
import { apiCall, getStoredCustomOrders, saveStoredCustomOrders } from '@/utils/api';

export default function QuickCustomForm() {
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occasion, setOccasion] = useState('Wedding');
  const [fragrance, setFragrance] = useState('Vintage Lilly');
  const [customMessage, setCustomMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  // Status states
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Simulate uploading: convert local file to image URL preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name || !email || !phone || !quantity || !deliveryDate) {
      setError('Please fill out all mandatory fields.');
      setLoading(false);
      return;
    }

    const payload = {
      name,
      email,
      phone,
      occasion,
      fragrance,
      customMessage,
      quantity: Number(quantity),
      deliveryDate: new Date(deliveryDate).toISOString(),
      referenceImage: imageUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80'
    };

    const { data, error: apiError } = await apiCall('/custom-orders', 'POST', payload);

    setLoading(false);

    if (apiError) {
      // API failed, fallback to local storage
      console.warn('API submission failed. Saving locally to simulate success.');
      const localPayload = {
        ...payload,
        id: 'cust-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        notes: ''
      };
      const stored = getStoredCustomOrders();
      stored.push(localPayload);
      saveStoredCustomOrders(stored);
    } else if (data) {
      // On success, also sync to local storage
      const stored = getStoredCustomOrders();
      stored.push(data);
      saveStoredCustomOrders(stored);
    }
    setName('');
    setEmail('');
    setPhone('');
    setCustomMessage('');
    setQuantity(1);
    setDeliveryDate('');
    setImageFile(null);
    setImageUrl('');
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card wrapper */}
        <div className="bg-ivory border border-gold/15 rounded-3xl p-8 sm:p-12 shadow-[0_15px_45px_rgba(212,175,55,0.06)] relative overflow-hidden">
          {/* Glass design bubble */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-full filter blur-xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-rose/10 rounded-full filter blur-2xl" />

          {submitted ? (
            <div className="text-center py-12 relative z-10">
              <CheckCircle2 size={56} className="text-gold mx-auto mb-5 animate-pulse" />
              <h3 className="font-luxury-serif text-3xl font-bold text-charcoal mb-3">Request Received</h3>
              <p className="text-base text-charcoal/70 leading-relaxed font-light max-w-lg mx-auto mb-8">
                Your custom candle query was recorded. Delifa Anjum and the Melting Memories team will review your specifications and contact you on WhatsApp/Email shortly with draft layouts and price quotes.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="bg-charcoal hover:bg-gold hover:text-charcoal text-white text-xs font-bold uppercase tracking-widest py-3.5 px-8 rounded-md transition-all"
              >
                Submit New Specifications
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              
              {/* Header Title */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-gold/10 py-1.5 px-3 rounded-full mb-3">
                  <Sparkles size={12} className="text-gold" />
                  <span className="text-[10px] tracking-wider text-gold font-bold uppercase">Bespoke Design Studio</span>
                </div>
                <h2 className="font-luxury-serif text-3xl sm:text-4xl font-bold text-charcoal mb-3">
                  Design A Custom Candle
                </h2>
                <p className="text-sm text-charcoal/50 font-light max-w-md mx-auto">
                  Submit your scent, message, and size specifications. Let us transform your vision into an elegant keepsake.
                </p>
              </div>

              {error && (
                <div className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 p-3.5 rounded-md">
                  {error}
                </div>
              )}

              {/* Grid 1: Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Your Name *
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name" 
                    className="w-full bg-white border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 94412 51145" 
                    className="w-full bg-white border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com" 
                    className="w-full bg-white border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Grid 2: Occasion & Scent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Occasion *
                  </label>
                  <select 
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-white border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal shadow-sm"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Preferred Fragrance *
                  </label>
                  <select 
                    value={fragrance}
                    onChange={(e) => setFragrance(e.target.value)}
                    className="w-full bg-white border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal shadow-sm"
                  >
                    <option value="Vintage Lilly">Vintage Lilly</option>
                    <option value="Rose Bloom">Rose Bloom</option>
                    <option value="Chocolate">Chocolate</option>
                    <option value="Custom Formula">Custom / Request New Blend</option>
                  </select>
                </div>
              </div>

              {/* Message, Qty, Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Custom Message on Wax / Label
                  </label>
                  <input 
                    type="text" 
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="e.g. 'Happy 25th Anniversary Mom & Dad' or logo text" 
                    className="w-full bg-white border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Quantity Needed *
                  </label>
                  <input 
                    type="number" 
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-white border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Grid 4: Image & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Reference Design Image (Upload JPG/PNG)
                  </label>
                  <div className="relative border-2 border-dashed border-rose/15 bg-white hover:border-gold rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-all">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload size={20} className="text-charcoal/40 mb-2" />
                    <span className="text-xs text-charcoal/60">
                      {imageFile ? imageFile.name : 'Choose file or drag here'}
                    </span>
                  </div>
                  {imageUrl && (
                    <div className="mt-2 flex items-center space-x-2 bg-white p-2 border border-rose/5 rounded">
                      <img src={imageUrl} alt="preview" className="w-10 h-10 object-cover rounded" />
                      <span className="text-[10px] text-charcoal/50">Preview generated. URL attached.</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Preferred Delivery Date *
                  </label>
                  <input 
                    type="date" 
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-white border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Submit button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-charcoal hover:bg-gold hover:text-charcoal text-white text-xs font-bold uppercase tracking-widest py-4 rounded-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <span>Saving details...</span>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Submit Custom Candle Design Request</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>
      </div>
    </section>
  );
}
