'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Search, Heart, ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { apiCall, MOCK_PRODUCTS, getStoredProducts } from '@/utils/api';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { getCartItemsCount, wishlist, user, logout } = useCart();

  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  // Initialize with MOCK_PRODUCTS so SSR and first client render always match.
  const [products, setProducts] = useState<any[]>(MOCK_PRODUCTS);

  useEffect(() => {
    const loadProducts = async () => {
      // Apply localStorage first for instant update post-hydration
      setProducts(getStoredProducts());
      const { data } = await apiCall<any[]>('/products');
      if (data && data.length > 0) {
        setProducts(data);
      }
    };
    loadProducts();
  }, []);

  // Check scroll to make header sticky and glassmorphic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Handle live search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase();
      // Search in active products list
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Custom Orders', href: '/custom-orders' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${isSticky
          ? 'bg-charcoal/95 backdrop-blur-sm py-4 shadow-lg'
          : 'bg-gradient-to-b from-black/40 to-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo on Left */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex flex-col">
                <span className="font-luxury-serif text-2xl font-bold tracking-widest text-white drop-shadow-md">
                  MELTING
                </span>
                <span className="text-[10px] tracking-[0.4em] text-gold font-sans font-semibold uppercase -mt-1 pl-0.5 drop-shadow-sm">
                  Memories
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Menu (Centered) */}
            <nav className="hidden md:flex space-x-8 lg:space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-widest uppercase font-medium transition-colors duration-200 ${pathname === link.href
                    ? 'text-gold font-semibold'
                    : 'text-white/90 hover:text-gold drop-shadow-sm'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Action Icons on Right */}
            <div className="flex items-center space-x-3 sm:space-x-5">

              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white/90 hover:text-gold drop-shadow-sm p-1.5 transition-colors focus:outline-none"
                aria-label="Search Catalog"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="text-white/90 hover:text-gold drop-shadow-sm p-1.5 relative transition-colors"
                aria-label="View Wishlist"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-charcoal text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-ivory">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                href="/cart"
                className="text-white/90 hover:text-gold drop-shadow-sm p-1.5 relative transition-colors"
                aria-label="View Cart"
              >
                <ShoppingBag size={20} />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-charcoal text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-ivory">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>

              {/* Profile Link or Menu */}
              {user ? (
                <div className="relative group">
                  <button className="text-white/90 hover:text-gold drop-shadow-sm p-1.5 flex items-center space-x-1 focus:outline-none">
                    <User size={20} />
                    <span className="hidden lg:inline text-xs font-semibold max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-1 origin-top-right bg-white border border-rose/20 rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2.5 text-xs text-charcoal hover:bg-ivory hover:text-gold uppercase tracking-wider font-semibold">
                        My Profile
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link href="/admin/dashboard" className="block px-4 py-2.5 text-xs text-gold hover:bg-ivory uppercase tracking-wider font-bold">
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 uppercase tracking-wider font-semibold"
                      >
                        <LogOut size={14} className="mr-2" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-white/90 hover:text-gold drop-shadow-sm p-1.5 transition-colors"
                  aria-label="Sign In"
                >
                  <User size={20} />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white/90 hover:text-gold drop-shadow-sm p-1.5 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-rose/10 absolute top-full left-0 w-full shadow-lg transition-transform duration-300 ease-out z-50">
            <div className="px-4 pt-4 pb-6 space-y-3 bg-ivory">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2.5 rounded-md text-base font-medium uppercase tracking-widest ${pathname === link.href
                    ? 'text-gold bg-gold-light/20 font-semibold'
                    : 'text-charcoal hover:text-gold hover:bg-ivory'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Full Screen Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-charcoal/70 backdrop-blur-md z-50 flex flex-col justify-start pt-24 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSearchOpen(false)}
                className="text-white hover:text-gold p-2 bg-charcoal-light/50 rounded-full focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium candles, bouquets..."
                className="w-full bg-white text-charcoal py-4 pl-6 pr-12 rounded-full border-2 border-gold/45 focus:outline-none focus:border-gold shadow-lg text-lg placeholder-charcoal/50"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal hover:text-gold p-2"
              >
                <Search size={22} />
              </button>
            </form>

            {/* Real-time search predictions */}
            {searchResults.length > 0 && (
              <div className="mt-4 bg-white rounded-2xl shadow-2xl border border-rose/10 max-h-96 overflow-y-auto divide-y divide-ivory z-50 relative">
                {searchResults.map(product => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.id}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center p-4 hover:bg-ivory transition-colors group"
                  >
                    <div className="w-12 h-12 bg-ivory rounded-md overflow-hidden flex-shrink-0 mr-4 border border-rose/10">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal text-sm">{product.name}</h4>
                      <p className="text-xs text-gold font-medium">₹{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
