'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  quantity: number;
  image: string;
  fragrance: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  colors: string[];
  fragrances: string[];
  burnTime: string;
  weight: string;
  isFeatured: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string;
  address?: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  token: string | null;
  coupon: Coupon | null;
  whatsappNumber: string;
  shippingCharge: number;
  taxRate: number;
  
  // Auth actions
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;

  // Cart actions
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string, fragrance: string, color: string) => void;
  updateCartQty: (productId: string, fragrance: string, color: string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  // Wishlist actions
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupon actions
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;

  // Dynamic system settings setter
  setSystemSettings: (whatsapp: string, shipping: number, tax: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  // Dynamic settings with defaults matching prompt brand details
  const [whatsappNumber, setWhatsappNumber] = useState('+919441251145');
  const [shippingCharge, setShippingCharge] = useState(50);
  const [taxRate, setTaxRate] = useState(0.05);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('mm_cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem('mm_wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedToken = localStorage.getItem('mm_token');
      const storedUser = localStorage.getItem('mm_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }

      const storedCoupon = localStorage.getItem('mm_coupon');
      if (storedCoupon) setCoupon(JSON.parse(storedCoupon));
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('mm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Auth Operations
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('mm_token', newToken);
    localStorage.setItem('mm_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCoupon(null);
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_user');
    localStorage.removeItem('mm_coupon');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('mm_user', JSON.stringify(updatedUser));
  };

  // Cart Operations
  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.fragrance === newItem.fragrance &&
          item.color === newItem.color
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += newItem.quantity;
        return newCart;
      }

      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (productId: string, fragrance: string, color: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.id === productId && item.fragrance === fragrance && item.color === color)
      )
    );
  };

  const updateCartQty = (productId: string, fragrance: string, color: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, fragrance, color);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.fragrance === fragrance && item.color === color
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    localStorage.removeItem('mm_coupon');
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.salePrice !== undefined && item.salePrice !== null ? item.salePrice : item.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Wishlist Operations
  const addToWishlist = (product: Product) => {
    if (!wishlist.some((item) => item.id === product.id)) {
      setWishlist((prev) => [...prev, product]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Coupon Operations
  const applyCoupon = (newCoupon: Coupon) => {
    setCoupon(newCoupon);
    localStorage.setItem('mm_coupon', JSON.stringify(newCoupon));
  };

  const removeCoupon = () => {
    setCoupon(null);
    localStorage.removeItem('mm_coupon');
  };

  const setSystemSettings = (whatsapp: string, shipping: number, tax: number) => {
    if (whatsapp) setWhatsappNumber(whatsapp);
    if (shipping !== undefined) setShippingCharge(shipping);
    if (tax !== undefined) setTaxRate(tax);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        user,
        token,
        coupon,
        whatsappNumber,
        shippingCharge,
        taxRate,
        login,
        logout,
        updateUser,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        setSystemSettings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
