'use client';

import React, { useState, useEffect } from 'react';
import { apiCall, MOCK_CATEGORIES, saveStoredProducts } from '@/utils/api';
import { Plus, Edit2, Trash2, Check, X, Tag, ShieldAlert, Package, Flame, Weight } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [salePrice, setSalePrice] = useState<number | null>(null);
  const [inventory, setInventory] = useState(10);
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [colors, setColors] = useState<string[]>(['']);
  const [fragrances, setFragrances] = useState<string[]>(['']);
  const [burnTime, setBurnTime] = useState('');
  const [weight, setWeight] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await apiCall<any[]>('/products');
    if (data && data.length > 0) {
      setProducts(data);
      saveStoredProducts(data); // keep localStorage in sync with real API
    } else {
      // No real API — load from localStorage (which admin may have edited)
      const { getStoredProducts } = await import('@/utils/api');
      const stored = getStoredProducts();
      setProducts(stored);
    }
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice(0);
    setSalePrice(null);
    setInventory(10);
    setCategoryId(MOCK_CATEGORIES[0]?.id || '');
    setImages(['https://images.unsplash.com/photo-1596435707261-05600be4db6a?w=600&auto=format&fit=crop&q=80']);
    setColors(['Pink', 'Cream', 'Red']);
    setFragrances(['Rose Bloom', 'Vintage Lilly']);
    setBurnTime('Approximately 4 Hours');
    setWeight('75g');
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price);
    setSalePrice(product.salePrice);
    setInventory(product.inventory);
    setCategoryId(product.categoryId);
    setImages(product.images || ['']);
    setColors(product.colors || ['']);
    setFragrances(product.fragrances || ['']);
    setBurnTime(product.burnTime || '');
    setWeight(product.weight || '');
    setIsFeatured(product.isFeatured || false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      inventory: Number(inventory),
      categoryId,
      images: images.filter(Boolean),
      colors: colors.filter(Boolean),
      fragrances: fragrances.filter(Boolean),
      burnTime,
      weight,
      isFeatured
    };

    if (editingProduct) {
      // Update
      const { data } = await apiCall(`/products/${editingProduct.id}`, 'PUT', payload);
      let updatedList: any[];
      if (data) {
        updatedList = products.map(p => p.id === editingProduct.id ? data : p);
      } else {
        updatedList = products.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p);
      }
      setProducts(updatedList);
      saveStoredProducts(updatedList);
    } else {
      // Create
      const { data } = await apiCall('/products', 'POST', payload);
      let updatedList: any[];
      if (data) {
        updatedList = [data, ...products];
      } else {
        const newProd = { id: `prod-${Date.now()}`, ...payload };
        updatedList = [newProd, ...products];
      }
      setProducts(updatedList);
      saveStoredProducts(updatedList);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await apiCall(`/products/${id}`, 'DELETE');
    const updatedList = products.filter(p => p.id !== id);
    setProducts(updatedList);
    saveStoredProducts(updatedList);
    if (error) console.warn('Delete API failed, removed locally only.');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-charcoal">Manage Products</h1>
          <p className="text-xs text-charcoal/50 mt-1">Catalog management, inventory status, and item properties.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl transition-all flex items-center space-x-2 shadow-md"
        >
          <Plus size={15} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Table Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-charcoal/60 uppercase tracking-wider">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-charcoal/40">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-charcoal/40">No products found.</td>
                </tr>
              ) : (
                products.map(product => {
                  const hasLowStock = product.inventory < 5;
                  const catName = MOCK_CATEGORIES.find(c => c.id === product.categoryId)?.name || 'General';

                  return (
                    <tr key={product.id} className="hover:bg-ivory/10 transition-colors">
                      <td className="py-4 px-6 flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-ivory overflow-hidden border border-gray-100 flex-shrink-0">
                          <img src={product.images?.[0] || ''} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-charcoal block">{product.name}</span>
                          <span className="text-[10px] text-charcoal/40 uppercase tracking-widest">{product.weight} · {product.burnTime}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-charcoal/70">
                        <span className="bg-gray-100 text-charcoal/70 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {catName}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-gold">
                        ₹{product.salePrice || product.price}
                        {product.salePrice && (
                          <span className="block text-[10px] text-charcoal/30 line-through">₹{product.price}</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${hasLowStock ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                          <span className={`font-semibold ${hasLowStock ? 'text-red-500 font-bold' : 'text-charcoal/75'}`}>
                            {product.inventory} units
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 border border-gray-100 hover:border-gold text-charcoal/60 hover:text-gold rounded-lg transition-all"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 border border-gray-100 hover:border-red-400 text-charcoal/60 hover:text-red-500 rounded-lg transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="font-luxury-serif text-xl font-bold text-charcoal">
                {editingProduct ? 'Edit Product Details' : 'Create New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal/40 hover:text-charcoal p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Category *</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  >
                    {MOCK_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Description *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal resize-none"
                />
              </div>

              {/* Price, Sale Price, Inventory */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Regular Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    required
                    className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={salePrice || ''}
                    onChange={e => setSalePrice(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Stock Quantity *</label>
                  <input
                    type="number"
                    value={inventory}
                    onChange={e => setInventory(Number(e.target.value))}
                    required
                    className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  />
                </div>
              </div>

              {/* Burn Time & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Burn Time</label>
                  <input
                    type="text"
                    value={burnTime}
                    onChange={e => setBurnTime(e.target.value)}
                    placeholder="e.g. Approximately 4 Hours"
                    className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Weight</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="e.g. 75g"
                    className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Product Image URL *</label>
                <input
                  type="text"
                  value={images[0]}
                  onChange={e => setImages([e.target.value])}
                  required
                  className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                />
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-gold text-charcoal border-gray-300 rounded focus:ring-gold"
                />
                <label htmlFor="isFeatured" className="text-xs font-bold uppercase tracking-widest text-charcoal/70 cursor-pointer">
                  Feature this product on homepage slider
                </label>
              </div>

              {/* Save & Cancel */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-bold uppercase tracking-widest py-3.5 rounded-md transition-all text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-3.5 rounded-md transition-all text-center shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
