'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import { Star, Heart, ShoppingBag, MessageCircle, SlidersHorizontal, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { apiCall, MOCK_CATEGORIES, getStoredProducts } from '@/utils/api';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';
  const initialCategory = searchParams?.get('category') || 'all';

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, whatsappNumber } = useCart();

  // Filter States
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState('newest'); // price-asc, price-desc, newest
  const [priceRange, setPriceRange] = useState(200);

  // Load products: try real API first, then localStorage, then mock fallback
  useEffect(() => {
    const loadProducts = async () => {
      const { data } = await apiCall<any[]>('/products');
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        // Use localStorage (reflects any admin edits made this session)
        setProducts(getStoredProducts());
      }
    };
    loadProducts();
  }, []);

  // Sync state if URL query changes
  useEffect(() => {
    setSearch(searchParams?.get('search') || '');
    setCategory(searchParams?.get('category') || 'all');
  }, [searchParams]);

  // Apply filtering and sorting logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                          product.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = category === 'all' || product.categoryId === category;
    
    const displayPrice = product.salePrice || product.price;
    const matchesPrice = displayPrice <= priceRange;

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;

    if (sortOrder === 'price-asc') return priceA - priceB;
    if (sortOrder === 'price-desc') return priceB - priceA;
    // default newest: mock by ID string comparison
    return b.id.localeCompare(a.id);
  });

  const getWhatsAppLink = (product: any) => {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const price = product.salePrice || product.price;
    const text = `Hello Melting Memories! I'd like to buy your "${product.name}" for ₹${price}. Is it available for delivery?`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <>
      <Header />
      
      <main className="flex-grow pt-28 pb-16 bg-ivory/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="text-center mb-12">
            <h1 className="font-luxury-serif text-4xl sm:text-5xl font-bold text-charcoal mb-3">Shop Collection</h1>
            <p className="text-xs sm:text-sm text-charcoal/50 uppercase tracking-[0.2em] font-sans font-semibold">
              Melting Memories • Premium Handcrafted Candles
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Side: Desktop Filters Panel */}
            <div className="bg-white border border-rose/10 p-6 rounded-2xl shadow-sm h-fit space-y-6">
              <div className="flex items-center space-x-2 border-b border-rose/10 pb-3">
                <SlidersHorizontal size={16} className="text-gold" />
                <h3 className="font-luxury-serif text-lg font-bold text-charcoal">Filters</h3>
              </div>

              {/* Search input */}
              <div className="relative">
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..." 
                  className="w-full bg-ivory border border-rose/10 py-2 pl-3 pr-8 rounded text-xs text-charcoal focus:outline-none focus:border-gold"
                />
                <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
              </div>

              {/* Categories selection */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-3">Categories</h4>
                <div className="space-y-2 text-xs">
                  <button 
                    onClick={() => setCategory('all')}
                    className={`block w-full text-left py-1.5 px-2 rounded transition-colors ${
                      category === 'all' ? 'bg-gold-light/40 text-charcoal font-bold' : 'text-charcoal/70 hover:bg-ivory'
                    }`}
                  >
                    All Categories
                  </button>
                  {MOCK_CATEGORIES.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`block w-full text-left py-1.5 px-2 rounded transition-colors ${
                        category === cat.id ? 'bg-gold-light/40 text-charcoal font-bold' : 'text-charcoal/70 hover:bg-ivory'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-charcoal/85 mb-2">
                  <span>Max Price</span>
                  <span className="text-gold">₹{priceRange}</span>
                </div>
                <input 
                  type="range" 
                  min={10} 
                  max={300} 
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-charcoal/40 mt-1">
                  <span>₹10</span>
                  <span>₹300</span>
                </div>
              </div>

              {/* Sorting Selection */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-3">Sort By</h4>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full bg-ivory border border-rose/10 py-2 px-2.5 rounded text-xs text-charcoal focus:outline-none"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Right Side: Products Catalog Grid */}
            <div className="lg:col-span-3">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-white border border-rose/10 rounded-2xl shadow-sm">
                  <ShoppingBag size={48} className="text-charcoal/20 mx-auto mb-4" />
                  <h3 className="font-luxury-serif text-2xl font-bold text-charcoal mb-2">No Products Found</h3>
                  <p className="text-sm text-charcoal/50 font-light mb-6">
                    Try adjusting your filters or search tags.
                  </p>
                  <button 
                    onClick={() => {
                      setSearch('');
                      setCategory('all');
                      setPriceRange(200);
                    }}
                    className="bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-md transition-all"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map(product => {
                    const isFavorite = isInWishlist(product.id);
                    const displayPrice = product.salePrice || product.price;

                    return (
                      <div 
                        key={product.id}
                        className="bg-white border border-rose/10 rounded-2xl p-4 shadow-[0_4px_16px_rgba(43,43,43,0.02)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.08)] transition-all duration-300 relative group flex flex-col justify-between"
                      >
                        
                        {/* Wishlist Button */}
                        <button 
                          onClick={() => handleWishlistToggle(product)}
                          className={`absolute top-6 right-6 z-10 w-8.5 h-8.5 rounded-full flex items-center justify-center border shadow transition-all ${
                            isFavorite 
                              ? 'bg-rose text-charcoal border-rose' 
                              : 'bg-white text-charcoal/30 hover:text-rose border-rose/10'
                          }`}
                        >
                          <Heart size={14} fill={isFavorite ? '#E8CFCF' : 'none'} />
                        </button>

                        {/* Image */}
                        <Link href={`/shop/${product.id}`} className="block relative aspect-square bg-ivory rounded-xl overflow-hidden mb-4 border border-rose/5 cursor-pointer">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                        </Link>

                        {/* Content */}
                        <div>
                          <span className="text-[9px] font-bold tracking-widest text-gold uppercase mb-0.5 block">Melting Memories</span>
                          <Link href={`/shop/${product.id}`} className="block">
                            <h3 className="font-luxury-serif text-base font-bold text-charcoal hover:text-gold transition-colors line-clamp-1 mb-1">
                              {product.name}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-sm font-bold text-gold">₹{displayPrice}</span>
                            {product.salePrice && (
                              <span className="text-xs text-charcoal/40 line-through">₹{product.price}</span>
                            )}
                          </div>
                        </div>

                        {/* CTA Grid */}
                        <div className="space-y-1.5 mt-auto pt-2">
                          <div className="grid grid-cols-2 gap-1.5">
                            <button 
                              onClick={() => addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                salePrice: product.salePrice,
                                quantity: 1,
                                image: product.images[0],
                                fragrance: product.fragrances[0] || 'Rose Bloom',
                                color: product.colors[0] || 'All Colors'
                              })}
                              className="bg-charcoal hover:bg-gold hover:text-charcoal text-white text-[9px] font-semibold uppercase tracking-widest py-2.5 rounded transition-all text-center"
                            >
                              Add To Cart
                            </button>
                            <button 
                              onClick={() => {
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  salePrice: product.salePrice,
                                  quantity: 1,
                                  image: product.images[0],
                                  fragrance: product.fragrances[0] || 'Rose Bloom',
                                  color: product.colors[0] || 'All Colors'
                                });
                                window.location.href = '/cart';
                              }}
                              className="bg-gold hover:bg-gold-hover text-charcoal text-[9px] font-bold uppercase tracking-widest py-2.5 rounded transition-all text-center"
                            >
                              Buy Now
                            </button>
                          </div>

                          <a 
                            href={getWhatsAppLink(product)}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] text-[9px] font-semibold uppercase tracking-widest py-2 rounded transition-all flex items-center justify-center space-x-1 bg-[#25D366]/5"
                          >
                            <MessageCircle size={12} />
                            <span>WhatsApp Order</span>
                          </a>
                        </div>

                      </div>
                    );
                  })}
                </div>
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

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <span className="text-charcoal/40 font-luxury-serif text-lg animate-pulse">Loading Collection...</span>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
