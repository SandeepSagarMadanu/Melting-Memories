const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get auth header
const getHeaders = (hasFiles = false) => {
  const headers: Record<string, string> = {};
  if (!hasFiles) {
    headers['Content-Type'] = 'application/json';
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('mm_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Generic API caller that handles failures and gracefully falls back to mock data
export async function apiCall<T>(endpoint: string, method = 'GET', body?: any, hasFiles = false): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: getHeaders(hasFiles),
      body: body ? (hasFiles ? body : JSON.stringify(body)) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { data: null, error: errorData.message || `Request failed with status ${response.status}` };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error: any) {
    console.warn(`API Connection failed to ${endpoint}. Falling back to mock mock handler if available.`, error.message);
    return { data: null, error: error.message || 'API connection failed' };
  }
}

// ─── LocalStorage Product Store ───────────────────────────────────────────────
// Since the backend may not be running, all admin edits are persisted in
// localStorage so the customer-facing shop page stays in sync.
const PRODUCTS_STORAGE_KEY = 'mm_products';

export function getStoredProducts(): any[] {
  if (typeof window === 'undefined') return MOCK_PRODUCTS;
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return MOCK_PRODUCTS;
}

export function saveStoredProducts(products: any[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    // Notify any listeners that the product list has been updated
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('productsUpdated'));
    }
  } catch {}
}
// ──────────────────────────────────────────────────────────────────────────────

// ─── LocalStorage Blog Store ──────────────────────────────────────────────────
const BLOGS_STORAGE_KEY = 'mm_blogs';

export function getStoredBlogs(): any[] {
  if (typeof window === 'undefined') return MOCK_BLOGS;
  try {
    const stored = localStorage.getItem(BLOGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return MOCK_BLOGS;
}

export function saveStoredBlogs(blogs: any[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs));
    window.dispatchEvent(new Event('blogsUpdated'));
  } catch {}
}
// ──────────────────────────────────────────────────────────────────────────────

// ─── LocalStorage Category Store ─────────────────────────────────────────────
const CATEGORIES_STORAGE_KEY = 'mm_categories';

export function getStoredCategories(): any[] {
  if (typeof window === 'undefined') return MOCK_CATEGORIES;
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return MOCK_CATEGORIES;
}

export function saveStoredCategories(categories: any[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event('categoriesUpdated'));
  } catch {}
}
// ──────────────────────────────────────────────────────────────────────────────

// ─── LocalStorage Custom Orders Store ────────────────────────────────────────
const CUSTOM_ORDERS_STORAGE_KEY = 'mm_custom_orders';

export function getStoredCustomOrders(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CUSTOM_ORDERS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

export function saveStoredCustomOrders(orders: any[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('customOrdersUpdated'));
  } catch {}
}

// ──────────────────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS = [
  {
    id: 'prod-peony',
    name: 'Peony Rose',
    description: 'An exquisitely detailed peony rose handcrafted candle. Perfect for adding a touch of floral elegance and warm lighting to any room.',
    price: 69,
    salePrice: 59,
    inventory: 50,
    images: ['/peony-rose-candle.svg'],
    categoryId: 'cat-single',
    colors: ['Pink', 'Cream', 'Red', 'All Colors'],
    fragrances: ['Rose Bloom', 'Vintage Lilly', 'Chocolate'],
    burnTime: 'Approximately 4 Hours',
    weight: '75g',
    isFeatured: true,
  },
  {
    id: 'prod-love-rose',
    name: 'Love Rose',
    description: 'Beautifully sculpted rose candle representing affection and warmth. Crafted from premium natural wax blends.',
    price: 39,
    salePrice: null,
    inventory: 120,
    images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80'],
    categoryId: 'cat-single',
    colors: ['Red', 'White', 'Soft Rose Blush', 'All Colors'],
    fragrances: ['Rose Bloom', 'Vintage Lilly'],
    burnTime: 'Approximately 3 Hours',
    weight: '45g',
    isFeatured: true,
  },
  {
    id: 'prod-daisy',
    name: 'Daisy',
    description: 'A charming, cheerful daisy candle. Its minimalist design radiates positivity and soft light.',
    price: 19,
    salePrice: null,
    inventory: 3, // Low inventory for test warnings
    images: ['https://images.unsplash.com/photo-1570824104453-508955ab713e?w=600&auto=format&fit=crop&q=80'],
    categoryId: 'cat-single',
    colors: ['Yellow', 'White', 'Blue', 'All Colors'],
    fragrances: ['Vintage Lilly'],
    burnTime: 'Approximately 2 Hours',
    weight: '25g',
    isFeatured: true,
  },
  {
    id: 'prod-heart',
    name: 'Hand In Hand Heart',
    description: 'Two interlocking hands holding a central heart. Symbolizes everlasting bonding, friendship, and romantic connection.',
    price: 69,
    salePrice: null,
    inventory: 45,
    images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'],
    categoryId: 'cat-single',
    colors: ['Champagne Gold', 'Ivory White', 'All Colors'],
    fragrances: ['Vintage Lilly', 'Rose Bloom', 'Chocolate'],
    burnTime: 'Approximately 4 Hours',
    weight: '80g',
    isFeatured: true,
  },
  {
    id: 'prod-plumeria',
    name: 'Plumeria',
    description: 'Frangipani inspired shaped candle bringing tropical bliss and premium visual accents to your home decor.',
    price: 29,
    salePrice: null,
    inventory: 85,
    images: ['https://images.unsplash.com/photo-1541256996761-85df2efaa164?w=600&auto=format&fit=crop&q=80'],
    categoryId: 'cat-single',
    colors: ['White-Yellow', 'Blush Pink', 'All Colors'],
    fragrances: ['Vintage Lilly'],
    burnTime: 'Approximately 3 Hours',
    weight: '35g',
    isFeatured: true,
  },
  {
    id: 'prod-triple-pillar',
    name: 'Triple Rose Pillar',
    description: 'A stately pillar candle adorned with detailed rose carvings. An elegant centerpiece for formal gifting and luxury decor.',
    price: 99,
    salePrice: 89,
    inventory: 25,
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80'],
    categoryId: 'cat-single',
    colors: ['Champagne Gold', 'Soft Ivory White', 'All Colors'],
    fragrances: ['Vintage Lilly', 'Rose Bloom', 'Chocolate'],
    burnTime: 'Approximately 6 Hours',
    weight: '150g',
    isFeatured: true,
  },
  {
    id: 'prod-single-bouquet',
    name: 'Single Flower Bouquet',
    description: 'Elegant bouquet design containing one large handcrafted flower wax sculpture, wrapped in premium gift packaging.',
    price: 89,
    salePrice: 39, // Range representation in cards
    inventory: 30,
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80'],
    categoryId: 'cat-bouquets',
    colors: ['Pink', 'Cream', 'Red', 'All Colors'],
    fragrances: ['Rose Bloom'],
    burnTime: 'Approximately 4 Hours',
    weight: '100g',
    isFeatured: false,
  },
  {
    id: 'prod-three-bouquet',
    name: 'Three Flower Bouquet',
    description: 'A gorgeous arrangement of three handcrafted candle flowers wrapped beautifully. Perfect for anniversaries and luxury gifts.',
    price: 149,
    salePrice: null,
    inventory: 15,
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80'],
    categoryId: 'cat-bouquets',
    colors: ['Pastel Mixed', 'Ivory White', 'All Colors'],
    fragrances: ['Rose Bloom', 'Vintage Lilly'],
    burnTime: 'Approximately 4 Hours',
    weight: '220g',
    isFeatured: false,
  },
  {
    id: 'prod-jar-classic',
    name: 'Classic Amber Jar Candle',
    description: 'Luxury scented wax poured into high-quality amber glass jars. Offers long, soot-free burns and intense fragrance throws.',
    price: 189,
    salePrice: 149,
    inventory: 90,
    images: ['https://images.unsplash.com/photo-1602872030219-cbf948a910d8?w=600&auto=format&fit=crop&q=80'],
    categoryId: 'cat-jars',
    colors: ['Amber Glass'],
    fragrances: ['Vintage Lilly', 'Rose Bloom', 'Chocolate'],
    burnTime: 'Approximately 20 Hours',
    weight: '120g',
    isFeatured: false,
  }
];

export const MOCK_CATEGORIES = [
  { id: 'cat-single', name: 'Single Candles', description: 'Exquisite standalone shapes for personal delight and aesthetics', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80' },
  { id: 'cat-bouquets', name: 'Bouquets', description: 'Stunning artistic combinations resembling floral flower displays', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80' },
  { id: 'cat-jars', name: 'Jar Candles', description: 'Long-burning classic and custom soy candle jars', image: 'https://images.unsplash.com/photo-1602872030219-cbf948a910d8?w=600&auto=format&fit=crop&q=80' },
  { id: 'cat-corporate', name: 'Corporate Orders', description: 'Branded luxury tokens and premium gifts for business delegates', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=80' },
  { id: 'cat-custom', name: 'Customized Orders', description: 'Made-to-order shapes, fragrance formulas and custom printing options', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80' }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    authorName: 'Aishwarya Rao',
    rating: 5,
    comment: 'Absolutely breathtaking! The Peony Rose candle is too beautiful to burn, but the scent is outstanding. Packed in gorgeous boxes.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    video: null,
    productId: 'prod-peony',
    isApproved: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rev-2',
    authorName: 'Rohan Sharma',
    rating: 5,
    comment: 'Ordered 50 customized jar candles for a corporate event. Delifa and team delivered them ahead of time. Exceptional craftsmanship!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    video: null,
    productId: 'prod-jar-classic',
    isApproved: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rev-3',
    authorName: 'Meghana Reddy',
    rating: 5,
    comment: 'The Vintage Lilly scent fills my entire living room. Best anniversary gift ever. Will definitely buy more!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    video: null,
    productId: 'prod-triple-pillar',
    isApproved: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  }
];

export const MOCK_BLOGS = [
  {
    id: 'blog-1',
    title: 'The Art of Gifting: Why Handcrafted Candles Speak Volumes',
    slug: 'art-of-gifting-handcrafted-candles',
    category: 'Luxury Decor',
    readTime: '4 mins read',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80',
    content: 'When we give gifts, we seek to convey emotion. A generic item rarely matches the feelings we hold. Handcrafted personalized candles, however, carry stories. The wax is hand-poured, the fragrances are carefully curated, and the custom messages hold specific significance. Discover how you can light up your loved ones faces with Melting Memories customized collections...',
    publishedAt: new Date().toISOString()
  },
  {
    id: 'blog-2',
    title: 'Essential Candle Care: How to Maximize Burn Time & Fragrance',
    slug: 'essential-candle-care-guide',
    category: 'Candle Care',
    readTime: '3 mins read',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
    content: 'To keep your luxury candles burning clean and throwing fragrance effectively, proper maintenance is vital. Always trim the wick to 1/4 inch before lighting. On your first burn, ensure the wax melts entirely to the edges to prevent tunneling. Avoid burning for more than 4 hours at a time, and store them away from direct sunlight to preserve the colors and fragrance oils...',
    publishedAt: new Date().toISOString()
  },
  {
    id: 'blog-3',
    title: 'Wedding Favor Trends: Personalizing Keepsakes for Your Guests',
    slug: 'wedding-favor-trends-personalized',
    category: 'Wedding Gifts',
    readTime: '5 mins read',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
    content: 'Weddings celebrate milestones of love. Giving favors is a gesture of gratitude. Modern couples are opting for eco-friendly, artisanal items rather than plastic trinkets. Personalized candles with the couple’s monogram and customized wedding scent (like Rose Bloom) create an emotional trigger. Every time the guest lights it, they recall the magic of your special day...',
    publishedAt: new Date().toISOString()
  }
];

export const MOCK_SETTINGS = {
  WHATSAPP_NUMBER: '+919441251145',
  STORE_EMAIL: 'meltingmemories0102@gmail.com',
  STORE_ADDRESS: 'Hayathnagar, Hyderabad, Telangana, India',
  INSTAGRAM_URL: 'https://www.instagram.com/melting_memories__/',
  SHIPPING_CHARGES: '50',
  TAX_RATE: '0.05'
};
