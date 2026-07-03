'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import { Star, Heart, ShoppingBag, MessageCircle, Plus, Minus, ArrowLeft, Share2, Flame, Weight, Palette, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { apiCall, getStoredProducts, MOCK_REVIEWS } from '@/utils/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, whatsappNumber } = useCart();

  const productId = params?.id as string;
  const [products, setProducts] = useState<any[]>(() => getStoredProducts());

  useEffect(() => {
    const loadProducts = async () => {
      const { data } = await apiCall<any[]>('/products');
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(getStoredProducts());
      }
    };
    loadProducts();
  }, []);

  const product = products.find(p => p.id === productId);

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedFragrance, setSelectedFragrance] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedFragrance(product.fragrances[0] || '');
      setSelectedColor(product.colors[0] || '');
    }
  }, [product]);

  if (!product) {
    return (
      <>
        <Header />
        <div className="pt-28 min-h-screen bg-ivory flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-luxury-serif text-3xl font-bold text-charcoal mb-4">Product Not Found</h1>
            <Link href="/shop" className="bg-gold text-charcoal text-xs font-bold uppercase tracking-widest py-3 px-8 rounded-md">
              Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const displayPrice = product.salePrice || product.price;
  const isFavorite = isInWishlist(product.id);
  const productReviews = MOCK_REVIEWS.filter(r => r.productId === product.id);
  const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 3);

  const getWhatsAppLink = () => {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const text = `Hello Melting Memories! I'd like to order "${product.name}" — Qty: ${qty}, Fragrance: ${selectedFragrance}, Color: ${selectedColor}, Total: ₹${displayPrice * qty}. Please confirm availability.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleAddToCart = (buyNow = false) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      quantity: qty,
      image: product.images[0],
      fragrance: selectedFragrance,
      color: selectedColor
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
    if (buyNow) router.push('/cart');
  };

  const handleWishlist = () => {
    if (isFavorite) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied!');
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow pt-28 pb-24 bg-ivory/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-charcoal/50 mb-8">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-gold font-medium">{product.name}</span>
          </div>

          {/* Main Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">

            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white border border-rose/10 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={product.images[activeImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.salePrice && (
                  <span className="absolute top-4 left-4 bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                    Sale
                  </span>
                )}
                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <button
                    onClick={handleWishlist}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border shadow transition-all ${
                      isFavorite ? 'bg-rose text-charcoal border-rose' : 'bg-white text-charcoal/50 hover:text-rose border-rose/10'
                    }`}
                  >
                    <Heart size={16} fill={isFavorite ? '#E8CFCF' : 'none'} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-rose/10 hover:border-gold text-charcoal/50 hover:text-gold transition-all shadow"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex space-x-3">
                  {product.images.map((image: string, imageIndex: number) => (
                    <button
                      key={imageIndex}
                      onClick={() => setActiveImage(imageIndex)}
                      className={`w-18 h-18 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === imageIndex ? 'border-gold' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-widest text-gold uppercase mb-2">Melting Memories</span>
              <h1 className="font-luxury-serif text-3xl sm:text-4xl font-bold text-charcoal mb-4">{product.name}</h1>

              {/* Rating Summary */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} fill="#D4AF37" className="text-gold" />
                  ))}
                </div>
                <span className="text-xs text-charcoal/50 font-medium">({productReviews.length} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-3xl font-bold text-gold">₹{displayPrice}</span>
                {product.salePrice && (
                  <>
                    <span className="text-lg text-charcoal/40 line-through">₹{product.price}</span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <hr className="border-rose/10 mb-6" />

              {/* Description */}
              <p className="text-sm text-charcoal/70 font-light leading-relaxed mb-6">{product.description}</p>

              {/* Product Specs Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-ivory rounded-xl border border-rose/10">
                <div className="flex flex-col items-center text-center">
                  <Flame size={18} className="text-gold mb-1" />
                  <span className="text-[10px] font-bold uppercase text-charcoal/60 tracking-wider">Burn Time</span>
                  <span className="text-xs text-charcoal font-semibold mt-0.5">{product.burnTime}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Weight size={18} className="text-gold mb-1" />
                  <span className="text-[10px] font-bold uppercase text-charcoal/60 tracking-wider">Weight</span>
                  <span className="text-xs text-charcoal font-semibold mt-0.5">{product.weight}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Palette size={18} className="text-gold mb-1" />
                  <span className="text-[10px] font-bold uppercase text-charcoal/60 tracking-wider">Colors</span>
                  <span className="text-xs text-charcoal font-semibold mt-0.5">{product.colors.length} Options</span>
                </div>
              </div>

              {/* Fragrance Selector */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-2">
                  Fragrance: <span className="text-gold font-bold">{selectedFragrance}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.fragrances.map((f: string) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFragrance(f)}
                      className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition-all ${
                        selectedFragrance === f
                          ? 'bg-gold text-charcoal border-gold'
                          : 'bg-white text-charcoal/70 border-rose/20 hover:border-gold'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-2">
                  Color: <span className="text-gold font-bold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition-all ${
                        selectedColor === c
                          ? 'bg-charcoal text-white border-charcoal'
                          : 'bg-white text-charcoal/70 border-rose/20 hover:border-charcoal'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-charcoal/70">Quantity:</span>
                <div className="flex items-center bg-ivory border border-rose/15 rounded-md">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 text-charcoal/60 hover:text-charcoal focus:outline-none">
                    <Minus size={15} />
                  </button>
                  <span className="px-5 text-sm font-bold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-2 text-charcoal/60 hover:text-charcoal focus:outline-none">
                    <Plus size={15} />
                  </button>
                </div>
                <span className="text-sm font-bold text-gold">Total: ₹{displayPrice * qty}</span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAddToCart()}
                    className={`flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-widest py-4 rounded-md transition-all ${
                      addedToCart
                        ? 'bg-green-600 text-white'
                        : 'bg-charcoal hover:bg-gold hover:text-charcoal text-white'
                    }`}
                  >
                    {addedToCart ? <Check size={15} /> : <ShoppingBag size={15} />}
                    <span>{addedToCart ? 'Added!' : 'Add to Cart'}</span>
                  </button>
                  <button
                    onClick={() => handleAddToCart(true)}
                    className="bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-4 rounded-md transition-all"
                  >
                    Buy Now
                  </button>
                </div>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] text-xs font-semibold uppercase tracking-widest py-3 rounded-md transition-all flex items-center justify-center space-x-2 bg-[#25D366]/5"
                >
                  <MessageCircle size={14} />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="mb-20">
            <h2 className="font-luxury-serif text-2xl font-bold text-charcoal mb-6 pb-3 border-b border-rose/10">
              Customer Reviews ({productReviews.length})
            </h2>
            {productReviews.length === 0 ? (
              <p className="text-sm text-charcoal/50 italic">Be the first to leave a review for this product!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productReviews.map(review => (
                  <div key={review.id} className="bg-white border border-rose/10 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-1 mb-3">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14} fill={i <= review.rating ? '#D4AF37' : 'none'} className={i <= review.rating ? 'text-gold' : 'text-charcoal/20'} />
                      ))}
                    </div>
                    <p className="text-sm text-charcoal/70 italic font-light leading-relaxed mb-4">"{review.comment}"</p>
                    <div className="flex items-center space-x-3 border-t border-rose/5 pt-3">
                      {review.image && (
                        <img src={review.image} alt={review.authorName} className="w-9 h-9 rounded-full object-cover" />
                      )}
                      <div>
                        <span className="text-xs font-bold text-charcoal">{review.authorName}</span>
                        <span className="block text-[10px] text-gold uppercase tracking-wider">Verified Buyer</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-luxury-serif text-2xl font-bold text-charcoal mb-6 pb-3 border-b border-rose/10">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProducts.map(related => (
                  <Link
                    key={related.id}
                    href={`/shop/${related.id}`}
                    className="bg-white border border-rose/10 rounded-2xl p-4 hover:shadow-md transition-all group"
                  >
                    <div className="aspect-square bg-ivory rounded-xl overflow-hidden mb-3">
                      <img src={related.images[0]} alt={related.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                    </div>
                    <h3 className="font-luxury-serif text-base font-bold text-charcoal group-hover:text-gold transition-colors">{related.name}</h3>
                    <span className="text-sm font-bold text-gold">₹{related.salePrice || related.price}</span>
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
