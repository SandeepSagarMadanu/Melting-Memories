'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import { Trash2, Plus, Minus, ShoppingBag, Tag, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { apiCall } from '@/utils/api';

export default function CartPage() {
  const {
    cart, removeFromCart, updateCartQty, clearCart,
    getCartTotal, getCartItemsCount,
    coupon, applyCoupon, removeCoupon,
    shippingCharge, taxRate
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = getCartTotal();
  const discount = coupon
    ? coupon.discountType === 'PERCENTAGE'
      ? (subtotal * coupon.value) / 100
      : coupon.value
    : 0;
  const taxAmount = (subtotal - discount) * taxRate;
  const orderTotal = subtotal - discount + taxAmount + shippingCharge;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);

    const { data, error } = await apiCall<any>('/coupons/validate', 'POST', { code: couponCode.trim().toUpperCase() });

    if (error) {
      // Demo coupon for offline test
      if (couponCode.toUpperCase() === 'MELTING10') {
        applyCoupon({ code: 'MELTING10', discountType: 'PERCENTAGE', value: 10 });
        setCouponCode('');
      } else {
        setCouponError('Invalid or expired coupon code. Try "MELTING10" for demo!');
      }
    } else if (data) {
      applyCoupon(data);
      setCouponCode('');
    }
    setCouponLoading(false);
  };

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-grow pt-28 pb-24 bg-ivory/30 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag size={64} className="text-charcoal/15 mx-auto mb-5" />
            <h1 className="font-luxury-serif text-3xl font-bold text-charcoal mb-3">Your Cart is Empty</h1>
            <p className="text-sm text-charcoal/50 font-light mb-8">
              Explore our handcrafted collections to find your perfect candle.
            </p>
            <Link
              href="/shop"
              className="bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-4 px-10 rounded-md transition-all inline-flex items-center space-x-2"
            >
              <span>Browse Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </main>
        <BottomNavbar />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-28 pb-24 bg-ivory/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h1 className="font-luxury-serif text-3xl sm:text-4xl font-bold text-charcoal mb-8">
            Shopping Cart
            <span className="ml-3 text-lg font-normal text-charcoal/50">({getCartItemsCount()} items)</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => {
                const itemPrice = item.salePrice !== null && item.salePrice !== undefined ? item.salePrice : item.price;
                return (
                  <div key={`${item.id}-${item.fragrance}-${item.color}`} className="bg-white border border-rose/10 rounded-2xl p-5 flex items-start gap-5 shadow-sm">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-rose/5 bg-ivory">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    {/* Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-luxury-serif text-base font-bold text-charcoal">{item.name}</h3>
                          <div className="flex flex-wrap gap-x-4 mt-1">
                            <span className="text-[11px] text-charcoal/50">Fragrance: <strong className="text-charcoal/70">{item.fragrance}</strong></span>
                            <span className="text-[11px] text-charcoal/50">Color: <strong className="text-charcoal/70">{item.color}</strong></span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.fragrance, item.color)}
                          className="text-charcoal/30 hover:text-red-500 transition-colors p-1 focus:outline-none"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-ivory border border-rose/15 rounded-lg">
                          <button onClick={() => updateCartQty(item.id, item.fragrance, item.color, item.quantity - 1)} className="p-2 text-charcoal/60 hover:text-charcoal focus:outline-none">
                            <Minus size={12} />
                          </button>
                          <span className="px-4 text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.id, item.fragrance, item.color, item.quantity + 1)} className="p-2 text-charcoal/60 hover:text-charcoal focus:outline-none">
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-bold text-gold">₹{(itemPrice * item.quantity).toFixed(0)}</span>
                          {item.salePrice && (
                            <span className="block text-xs text-charcoal/40 line-through">₹{item.price * item.quantity}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end pt-2">
                <button onClick={() => clearCart()} className="text-xs text-charcoal/40 hover:text-red-500 uppercase tracking-wider font-medium transition-colors flex items-center space-x-1">
                  <X size={12} />
                  <span>Clear Cart</span>
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-5">
              <div className="bg-white border border-rose/10 rounded-2xl p-6 shadow-sm">
                <h2 className="font-luxury-serif text-xl font-bold text-charcoal mb-5 pb-3 border-b border-rose/10">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Subtotal</span>
                    <span className="font-medium text-charcoal">₹{subtotal.toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center space-x-1">
                        <Tag size={12} />
                        <span>Coupon ({coupon?.code})</span>
                      </span>
                      <span>-₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-charcoal/70">
                    <span>Tax (5% GST)</span>
                    <span className="font-medium text-charcoal">₹{taxAmount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span>Shipping</span>
                    <span className="font-medium text-charcoal">₹{shippingCharge}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-rose/10 text-base font-bold text-charcoal">
                    <span>Total</span>
                    <span className="text-gold text-lg">₹{orderTotal.toFixed(0)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-4 rounded-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Coupon Code Box */}
              <div className="bg-white border border-rose/10 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-3">Apply Coupon Code</h3>
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <div>
                      <span className="text-xs font-bold text-green-700 uppercase">{coupon.code}</span>
                      <span className="block text-[10px] text-green-600">
                        {coupon.discountType === 'PERCENTAGE' ? `${coupon.value}% discount applied` : `₹${coupon.value} off applied`}
                      </span>
                    </div>
                    <button onClick={removeCoupon} className="text-green-600 hover:text-red-500">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code..."
                        className="flex-1 bg-ivory border border-rose/15 py-2.5 px-3 rounded-lg text-xs text-charcoal focus:outline-none focus:border-gold uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="bg-charcoal hover:bg-gold hover:text-charcoal text-white text-xs font-bold px-4 rounded-lg transition-all"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-[11px] mt-2">{couponError}</p>
                    )}
                  </>
                )}
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
