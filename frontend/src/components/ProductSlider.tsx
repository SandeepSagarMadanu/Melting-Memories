'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Plus, Minus, MessageCircle, X } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import { apiCall, getStoredProducts } from '@/utils/api';
import { FEATURED_PRODUCT_IMAGE_PATHS, DEFAULT_PRODUCT_IMAGE } from '@/utils/imageConfig';

export default function ProductSlider() {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, whatsappNumber } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [activeFragrances, setActiveFragrances] = useState<Record<string, string>>({});
  const [activeColors, setActiveColors] = useState<Record<string, string>>({});

  const scrollRef = useRef<HTMLDivElement>(null);

  // State for products, initially empty to keep SSR and client markup consistent
  const [products, setProducts] = useState<Product[]>([]);
  // Flag to indicate client‑side mount
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    // Mark component as mounted (client side only)
    setIsMounted(true);

    const loadProducts = async () => {
      const { data } = await apiCall<Product[]>('/products');
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(getStoredProducts());
      }
    };
    loadProducts();

    const handler = () => {
      const stored = getStoredProducts();
      setProducts(stored);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('productsUpdated', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('productsUpdated', handler);
      }
    };
  }, []);

  // Render nothing (or a skeleton) on the server to avoid hydration mismatch
  if (!isMounted) {
    return null; // or you can return a loading placeholder
  }

  const bestSellers = products.filter(p => p.isFeatured);

  // Scroll controls
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Qty helpers
  const handleQtyChange = (id: string, type: 'inc' | 'dec') => {
    const currentQty = quantities[id] || 1;
    if (type === 'inc') {
      setQuantities({ ...quantities, [id]: currentQty + 1 });
    } else {
      setQuantities({ ...quantities, [id]: Math.max(1, currentQty - 1) });
    }
  };

  // Add to Cart handler
  const handleAddToCart = (product: any, buyNow = false) => {
    const qty = quantities[product.id] || 1;
    const fragrance = activeFragrances[product.id] || product.fragrances[0] || 'Rose Bloom';
    const color = activeColors[product.id] || product.colors[0] || 'All Colors';

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      quantity: qty,
      image: product.images[0],
      fragrance,
      color
    });

    if (buyNow) {
      window.location.href = '/cart';
    }
  };

  // Wishlist toggle handler
  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // WhatsApp link generator
  const getWhatsAppLink = (product: any) => {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const price = product.salePrice || product.price;
    const text = `Hello Melting Memories! I would like to order "${product.name}" (Quantity: ${quantities[product.id] || 1}, Fragrance: ${activeFragrances[product.id] || product.fragrances[0] || 'Default'}, Color: ${activeColors[product.id] || product.colors[0] || 'Default'}) for ₹${price * (quantities[product.id] || 1)}. Please confirm order.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section className="py-24 bg-ivory overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-sans font-bold tracking-[0.3em] text-gold uppercase block mb-3">
              Customer Favorites
            </span>
            <h2 className="font-luxury-serif text-3xl sm:text-5xl font-bold text-charcoal">
              Our Best Sellers
            </h2>
          </div>

          {/* Custom navigation arrows */}
          <div className="flex space-x-3 mt-6 md:mt-0">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-charcoal hover:bg-gold hover:text-charcoal transition-all focus:outline-none"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-charcoal hover:bg-gold hover:text-charcoal transition-all focus:outline-none"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        {/* Swipeable Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing"
        >
          {bestSellers.map((product) => {
            const qty = quantities[product.id] || 1;
            const isFavorite = isInWishlist(product.id);
            const displayPrice = product.salePrice || product.price;

            return (
              <div
                key={product.id}
                className="flex-shrink-0 w-80 sm:w-96 snap-start bg-white border border-rose/10 rounded-2xl p-4 shadow-[0_10px_30px_rgba(43,43,43,0.03)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.08)] transition-all duration-300 relative group flex flex-col justify-between"
              >

                {/* Wishlist Button */}
                <button
                  onClick={() => handleWishlistToggle(product)}
                  className={`absolute top-6 right-6 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md border focus:outline-none transition-all ${isFavorite
                      ? 'bg-rose text-charcoal border-rose'
                      : 'bg-white text-charcoal/40 hover:text-rose border-rose/10'
                    }`}
                >
                  <Heart size={16} fill={isFavorite ? '#E8CFCF' : 'none'} />
                </button>

                {/* Product Image Panel */}
                <div className="relative aspect-square w-full bg-ivory rounded-xl overflow-hidden mb-5 border border-rose/5">
                  <img
                    src={FEATURED_PRODUCT_IMAGE_PATHS[product.id] || product.images?.[0] || DEFAULT_PRODUCT_IMAGE}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />

                  {/* Image Overlays for quick view and variants */}
                  <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={() => {
                        setQuickViewProduct(product);
                        setQuickViewQty(1);
                      }}
                      className="bg-white/95 backdrop-blur-md text-charcoal py-2.5 px-5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 shadow-lg hover:bg-gold hover:text-charcoal transition-all"
                    >
                      <Eye size={14} />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                {/* Info Area */}
                <div>
                  <h3 className="font-luxury-serif text-lg font-bold text-charcoal mb-1">
                    {product.name}
                  </h3>

                  {/* Prices */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-base font-bold text-gold">₹{displayPrice}</span>
                    {product.salePrice && (
                      <span className="text-xs text-charcoal/40 line-through">₹{product.price}</span>
                    )}
                  </div>

                  {/* Custom selection dropdown mini info */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-[11px]">
                    <div>
                      <label className="text-charcoal/50 block mb-0.5">Fragrance</label>
                      <select
                        value={activeFragrances[product.id] || product.fragrances[0]}
                        onChange={(e) => setActiveFragrances({ ...activeFragrances, [product.id]: e.target.value })}
                        className="w-full bg-ivory border border-rose/10 py-1 px-1.5 rounded text-charcoal focus:outline-none"
                      >
                        {product.fragrances.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-charcoal/50 block mb-0.5">Color</label>
                      <select
                        value={activeColors[product.id] || product.colors[0]}
                        onChange={(e) => setActiveColors({ ...activeColors, [product.id]: e.target.value })}
                        className="w-full bg-ivory border border-rose/10 py-1 px-1.5 rounded text-charcoal focus:outline-none"
                      >
                        {product.colors.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Quantity & Buy operations */}
                  <div className="flex items-center justify-between border-t border-rose/10 pt-4 mb-4">
                    <span className="text-xs text-charcoal/60 uppercase tracking-widest">Quantity</span>
                    <div className="flex items-center bg-ivory border border-rose/15 rounded-md">
                      <button
                        onClick={() => handleQtyChange(product.id, 'dec')}
                        className="p-1.5 text-charcoal/60 hover:text-charcoal focus:outline-none"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-semibold">{qty}</span>
                      <button
                        onClick={() => handleQtyChange(product.id, 'inc')}
                        className="p-1.5 text-charcoal/60 hover:text-charcoal focus:outline-none"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* CTA Action Buttons Grid */}
                <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-charcoal hover:bg-gold hover:text-charcoal text-white text-[10px] font-semibold uppercase tracking-widest py-3 rounded-md transition-all flex items-center justify-center space-x-1"
                  >
                    <ShoppingBag size={11} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => handleAddToCart(product, true)}
                    className="bg-gold hover:bg-gold-hover text-charcoal text-[10px] font-bold uppercase tracking-widest py-3 rounded-md transition-all text-center"
                  >
                    Buy Now
                  </button>

                  <a
                    href={getWhatsAppLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 mt-1.5 border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] text-[10px] font-semibold uppercase tracking-widest py-2.5 rounded-md transition-all flex items-center justify-center space-x-1.5 bg-[#25D366]/5"
                  >
                    <MessageCircle size={13} />
                    <span>Order via WhatsApp</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Quick View Overlay Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-rose/15 relative flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-y-visible">

            {/* Dismiss Button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-ivory text-charcoal hover:bg-gold flex items-center justify-center focus:outline-none transition-all shadow"
            >
              <X size={18} />
            </button>

            {/* Left Image Side */}
            <div className="md:w-1/2 bg-ivory aspect-square md:aspect-auto flex items-center justify-center border-r border-rose/5">
              <img
                src={quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Information Details Side */}
            <div className="md:w-1/2 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold tracking-widest text-gold uppercase block mb-1">Melting Memories</span>
                <h3 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-charcoal mb-3">{quickViewProduct.name}</h3>

                {/* Price tag */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl font-bold text-gold">₹{quickViewProduct.salePrice || quickViewProduct.price}</span>
                  {quickViewProduct.salePrice && (
                    <span className="text-sm text-charcoal/40 line-through">₹{quickViewProduct.price}</span>
                  )}
                </div>

                <hr className="border-rose/10 my-4" />

                {/* Description */}
                <p className="text-sm text-charcoal/70 font-light leading-relaxed mb-5">
                  {quickViewProduct.description}
                </p>

                {/* Specs */}
                <ul className="space-y-2 text-xs text-charcoal/60 mb-6 font-medium">
                  <li>✨ <strong>Burn Time:</strong> {quickViewProduct.burnTime}</li>
                  <li>⚖️ <strong>Weight:</strong> {quickViewProduct.weight}</li>
                  <li>🏷️ <strong>Colors Available:</strong> {quickViewProduct.colors.join(', ')}</li>
                </ul>
              </div>

              {/* Action buttons */}
              <div>
                <div className="flex items-center justify-between border-t border-rose/10 pt-4 mb-4">
                  <span className="text-xs text-charcoal/60 uppercase tracking-widest">Quantity</span>
                  <div className="flex items-center bg-ivory border border-rose/15 rounded-md">
                    <button
                      onClick={() => setQuickViewQty(Math.max(1, quickViewQty - 1))}
                      className="p-1.5 text-charcoal/60 hover:text-charcoal focus:outline-none"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-sm font-semibold">{quickViewQty}</span>
                    <button
                      onClick={() => setQuickViewQty(quickViewQty + 1)}
                      className="p-1.5 text-charcoal/60 hover:text-charcoal focus:outline-none"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      addToCart({
                        id: quickViewProduct.id,
                        name: quickViewProduct.name,
                        price: quickViewProduct.price,
                        salePrice: quickViewProduct.salePrice,
                        quantity: quickViewQty,
                        image: quickViewProduct.images[0],
                        fragrance: quickViewProduct.fragrances[0] || 'Rose Bloom',
                        color: quickViewProduct.colors[0] || 'All Colors'
                      });
                      setQuickViewProduct(null);
                    }}
                    className="bg-charcoal hover:bg-gold hover:text-charcoal text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-md transition-all flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingBag size={14} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => {
                      addToCart({
                        id: quickViewProduct.id,
                        name: quickViewProduct.name,
                        price: quickViewProduct.price,
                        salePrice: quickViewProduct.salePrice,
                        quantity: quickViewQty,
                        image: quickViewProduct.images[0],
                        fragrance: quickViewProduct.fragrances[0] || 'Rose Bloom',
                        color: quickViewProduct.colors[0] || 'All Colors'
                      });
                      window.location.href = '/cart';
                    }}
                    className="bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-3.5 rounded-md transition-all"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
