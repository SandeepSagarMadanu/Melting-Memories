'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import { CreditCard, CheckCircle2, Lock, MapPin, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { apiCall } from '@/utils/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, getCartTotal, coupon, shippingCharge, taxRate, user } = useCart();

  // Form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = getCartTotal();
  const discount = coupon
    ? coupon.discountType === 'PERCENTAGE'
      ? (subtotal * coupon.value) / 100
      : coupon.value
    : 0;
  const taxAmount = (subtotal - discount) * taxRate;
  const orderTotal = subtotal - discount + taxAmount + shippingCharge;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.salePrice || item.price,
        quantity: item.quantity,
        fragrance: item.fragrance,
        color: item.color
      })),
      totalAmount: orderTotal,
      shippingFee: shippingCharge,
      taxAmount,
      discountAmount: discount,
      couponCode: coupon?.code || null
    };

    const { data, error } = await apiCall<any>('/orders', 'POST', payload);

    // Simulate Razorpay payment modal (mock success)
    await new Promise(resolve => setTimeout(resolve, 1800));

    const generatedOrderNum = data?.orderNumber || `MM-${Date.now().toString().slice(-6)}`;

    // Mock verify payment
    if (data?.id) {
      await apiCall('/orders/verify', 'POST', {
        orderId: data.id,
        paymentId: `pay_mock_${Date.now()}`,
        status: 'success'
      });
    }

    setLoading(false);
    setOrderNumber(generatedOrderNum);
    setOrderComplete(true);
    clearCart();
  };

  if (orderComplete) {
    return (
      <>
        <Header />
        <main className="flex-grow pt-28 pb-24 bg-ivory/30 flex items-center justify-center">
          <div className="bg-white border border-rose/10 rounded-2xl p-12 shadow-xl text-center max-w-md mx-4">
            <CheckCircle2 size={60} className="text-gold mx-auto mb-5 animate-pulse" />
            <h1 className="font-luxury-serif text-3xl font-bold text-charcoal mb-3">Order Confirmed!</h1>
            <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 mb-6">
              <span className="block text-xs font-bold uppercase tracking-widest text-gold mb-1">Your Order Number</span>
              <span className="font-luxury-serif text-2xl font-bold text-charcoal">{orderNumber}</span>
            </div>
            <p className="text-sm text-charcoal/70 leading-relaxed font-light mb-8">
              Thank you for your order! We'll send a confirmation to <strong>{email}</strong> and our team will WhatsApp you with order updates and tracking details.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/')}
                className="bg-ivory hover:bg-rose/10 text-charcoal text-xs font-bold uppercase tracking-widest py-3 rounded-md transition-all border border-rose/15"
              >
                Back to Home
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-3 rounded-md transition-all"
              >
                View Orders
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-28 pb-24 bg-ivory/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-luxury-serif text-3xl sm:text-4xl font-bold text-charcoal mb-8">Secure Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Left: Delivery & Payment Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-6">

              {/* Delivery Details Card */}
              <div className="bg-white border border-rose/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-5 pb-3 border-b border-rose/10">
                  <MapPin size={16} className="text-gold" />
                  <h2 className="font-luxury-serif text-lg font-bold text-charcoal">Delivery Details</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        required
                        className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Email Address *</label>
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
                    <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Delivery Address *</label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Full delivery address including city, state, pincode"
                      required
                      className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white border border-rose/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-5 pb-3 border-b border-rose/10">
                  <CreditCard size={16} className="text-gold" />
                  <h2 className="font-luxury-serif text-lg font-bold text-charcoal">Payment Method</h2>
                </div>

                {/* Payment logos */}
                <div className="bg-ivory rounded-xl p-5 mb-4 border border-rose/10">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Razorpay', 'UPI', 'GPay', 'PhonePe', 'Paytm', 'Cards'].map(method => (
                      <span key={method} className="bg-white border border-rose/10 text-charcoal text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {method}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-charcoal/50 font-light flex items-center space-x-1">
                    <Lock size={12} className="text-gold" />
                    <span>Secured by Razorpay. All transactions are encrypted & safe.</span>
                  </p>
                </div>

                <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-xs text-charcoal/70">
                  <span className="font-bold text-gold block mb-1">⚡ Instant Confirmation</span>
                  After payment, you'll receive a WhatsApp message with your order ID and processing timeline from our team.
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold hover:bg-gold-hover text-charcoal text-sm font-bold uppercase tracking-widest py-5 rounded-xl transition-all shadow-lg disabled:opacity-60 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span className="animate-pulse">Processing Payment...</span>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Place Order — ₹{orderTotal.toFixed(0)}</span>
                  </>
                )}
              </button>
            </form>

            {/* Right: Mini Order Summary */}
            <div>
              <div className="bg-white border border-rose/10 rounded-2xl p-6 shadow-sm sticky top-28">
                <h2 className="font-luxury-serif text-xl font-bold text-charcoal mb-5 pb-3 border-b border-rose/10">
                  Order Summary ({cart.length} items)
                </h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map(item => {
                    const itemPrice = item.salePrice !== null && item.salePrice !== undefined ? item.salePrice : item.price;
                    return (
                      <div key={`${item.id}-${item.fragrance}`} className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-ivory flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <span className="text-xs font-semibold text-charcoal line-clamp-1">{item.name}</span>
                          <span className="block text-[10px] text-charcoal/50">{item.fragrance} × {item.quantity}</span>
                        </div>
                        <span className="text-sm font-bold text-gold flex-shrink-0">₹{(itemPrice * item.quantity).toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2 text-sm pt-4 border-t border-rose/10">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center space-x-1"><Tag size={11} /><span>Coupon</span></span>
                      <span>-₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-charcoal/70">
                    <span>GST (5%)</span><span>₹{taxAmount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span>Shipping</span><span>₹{shippingCharge}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-charcoal pt-2 border-t border-rose/10">
                    <span>Total</span>
                    <span className="text-gold text-lg">₹{orderTotal.toFixed(0)}</span>
                  </div>
                </div>
              </div>
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
