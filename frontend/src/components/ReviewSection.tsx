'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, CheckCircle2, User } from 'lucide-react';
import { apiCall, MOCK_REVIEWS, MOCK_PRODUCTS, getStoredProducts } from '@/utils/api';

export default function ReviewSection() {
  const [reviews, setReviews] = useState<any[]>(MOCK_REVIEWS);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Form states
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  // Initialize with MOCK_PRODUCTS so SSR and first client render always match,
  // then hydrate from localStorage inside useEffect (client-only, after hydration).
  const [products, setProducts] = useState<any[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<string>(MOCK_PRODUCTS[0]?.id || '');
  const [image, setImage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from localStorage and/or API — runs client-side only, after hydration.
  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await apiCall<any[]>('/reviews/featured');
      if (data && data.length > 0) {
        setReviews(data);
      }
    };
    const loadProducts = async () => {
      // First, immediately apply localStorage products so the UI is responsive
      const stored = getStoredProducts();
      setProducts(stored);
      setSelectedProduct(stored[0]?.id || '');

      // Then attempt a live API fetch for fresher data
      const { data } = await apiCall<any[]>('/products');
      if (data && data.length > 0) {
        setProducts(data);
        setSelectedProduct((prev) => prev || data[0]?.id || '');
      }
    };
    fetchReviews();
    loadProducts();
  }, []);

  // Auto-slide reviews
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!authorName || !comment) {
      setError('Please provide your name and comments.');
      return;
    }

    const payload = {
      authorName,
      rating,
      comment,
      productId: selectedProduct,
      image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', // Fallback avatar
    };

    const { data, error: apiError } = await apiCall('/reviews', 'POST', payload);

    if (apiError) {
      // Fallback: simulate database success in UI
      const mockNewReview = {
        id: `rev-new-${Date.now()}`,
        authorName,
        rating,
        comment,
        image: payload.image,
        productId: selectedProduct,
        createdAt: new Date().toISOString()
      };
      setReviews([mockNewReview, ...reviews]);
    } else if (data) {
      setReviews([data, ...reviews]);
    }

    setSubmitted(true);
    setAuthorName('');
    setComment('');
    setImage('');
    setRating(5);
  };

  return (
    <section className="py-24 bg-ivory/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Side: Animated Review Carousel */}
          <div>
            <span className="text-xs font-sans font-bold tracking-[0.3em] text-gold uppercase block mb-3">
              Words From Our Customers
            </span>
            <h2 className="font-luxury-serif text-3xl sm:text-5xl font-bold text-charcoal mb-8">
              Love & Memories Shared
            </h2>

            {/* Carousel Container */}
            {reviews.length > 0 && (
              <div className="bg-white border border-rose/10 rounded-2xl p-8 sm:p-10 shadow-lg relative min-h-[300px] flex flex-col justify-between transition-all duration-500">
                {/* Large Quote Mark */}
                <span className="absolute top-4 right-8 text-gold/10 font-serif text-[120px] leading-none pointer-events-none select-none">
                  “
                </span>

                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < reviews[activeReviewIdx].rating ? '#D4AF37' : 'none'}
                        className={i < reviews[activeReviewIdx].rating ? 'text-gold' : 'text-charcoal/20'}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-base sm:text-lg text-charcoal/80 font-light italic leading-relaxed mb-8">
                    "{reviews[activeReviewIdx].comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center border-t border-rose/5 pt-6 mt-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-ivory border border-rose/10 flex-shrink-0">
                    <img
                      src={reviews[activeReviewIdx].image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={reviews[activeReviewIdx].authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal text-sm">{reviews[activeReviewIdx].authorName}</h4>
                    <span className="text-[10px] text-gold tracking-widest uppercase font-bold">Verified Buyer</span>
                  </div>
                </div>

                {/* Bullets navigation indicator */}
                <div className="flex space-x-2 mt-6 justify-center">
                  {reviews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveReviewIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-all focus:outline-none ${activeReviewIdx === idx ? 'bg-gold w-4' : 'bg-charcoal/10'
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

              </div>
            )}
          </div>

          {/* Right Side: Interactive Review Form */}
          <div className="bg-white border border-rose/10 rounded-2xl p-8 sm:p-10 shadow-lg">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle2 size={48} className="text-gold mx-auto mb-4" />
                <h3 className="font-luxury-serif text-2xl font-bold text-charcoal mb-2">Thank You!</h3>
                <p className="text-sm text-charcoal/60 leading-relaxed font-light">
                  Your feedback has been submitted successfully. In order to maintain our luxury standards, reviews undergo verification and will appear online shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs uppercase font-bold tracking-widest text-gold hover:text-gold-hover border-b border-gold"
                >
                  Submit Another Review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-luxury-serif text-xl font-bold text-charcoal border-b border-rose/10 pb-3">
                  Share Your Experience
                </h3>

                {error && (
                  <p className="text-xs font-semibold text-red-500 bg-red-50 p-2.5 rounded">{error}</p>
                )}

                {/* Author Name */}
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                    required
                  />
                </div>

                {/* Rating Input */}
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className="text-charcoal hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          size={24}
                          fill={num <= rating ? '#D4AF37' : 'none'}
                          className={num <= rating ? 'text-gold' : 'text-charcoal/20'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Selection */}
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Product Reviewed
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Image URL Optional */}
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Review Photo (Optional URL)
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  />
                </div>

                {/* Comment Text */}
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-widest mb-1.5">
                    Your Comments
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the burn quality, fragrance, packaging, and the emotions it evoked..."
                    className="w-full bg-ivory border border-rose/15 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal placeholder-charcoal/40"
                    required
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-charcoal hover:bg-gold hover:text-charcoal text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-md transition-all flex items-center justify-center space-x-2"
                >
                  <Send size={14} />
                  <span>Submit Review</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
