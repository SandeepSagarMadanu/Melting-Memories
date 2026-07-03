'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image, GripVertical, RefreshCw } from 'lucide-react';
import { getStoredCategories, saveStoredCategories, MOCK_CATEGORIES } from '@/utils/api';

const emptyForm = {
  id: '',
  name: '',
  description: '',
  image: '',
};

function toId(text: string) {
  return 'cat-' + text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setCategories(getStoredCategories());
  }, []);

  const save = () => {
    if (!form.name.trim() || !form.image.trim()) return;
    let updated: any[];
    if (editingId) {
      updated = categories.map(c => c.id === editingId ? { ...form, id: editingId } : c);
    } else {
      const newCat = {
        ...form,
        id: form.id || toId(form.name),
      };
      updated = [...categories, newCat];
    }
    setCategories(updated);
    saveStoredCategories(updated);
    resetForm();
  };

  const startEdit = (cat: any) => {
    setForm({ ...cat });
    setEditingId(cat.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    saveStoredCategories(updated);
    setDeleteConfirmId(null);
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(false);
  };

  const resetToMock = () => {
    localStorage.removeItem('mm_categories');
    saveStoredCategories(MOCK_CATEGORIES);
    setCategories(MOCK_CATEGORIES);
  };

  const inputCls = "w-full bg-[#F8F7F5] border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors";
  const labelCls = "block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-1.5";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury-serif text-2xl font-bold text-charcoal">Category Manager</h1>
          <p className="text-xs text-charcoal/50 mt-1">
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} — changes appear instantly on the Home page
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToMock}
            className="flex items-center gap-1.5 text-xs text-charcoal/40 hover:text-charcoal border border-gray-200 px-3 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={12} /> Reset to Defaults
          </button>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyForm }); }}
            className="flex items-center gap-2 bg-gold text-charcoal text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-gold-hover transition-colors shadow-sm"
          >
            <Plus size={14} />
            Add Category
          </button>
        </div>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white border border-rose/10 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-charcoal text-sm">
              {editingId ? '✏️ Edit Category' : '✨ New Category'}
            </h2>
            <button onClick={resetForm} className="text-charcoal/40 hover:text-red-400 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Category Name *</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Wedding Collections"
                    value={form.name}
                    onChange={e => setForm(f => ({
                      ...f,
                      name: e.target.value,
                      id: editingId ? f.id : toId(e.target.value),
                    }))}
                  />
                </div>
                <div>
                  <label className={labelCls}>ID / Slug</label>
                  <input
                    className={inputCls}
                    placeholder="cat-wedding-collections"
                    value={form.id}
                    onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                  />
                  <p className="text-[10px] text-charcoal/40 mt-1">
                    Used in shop URLs: /shop?category=<span className="font-mono">{form.id || 'cat-…'}</span>
                  </p>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={3}
                    placeholder="Short description shown under the category name on the home page."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Right — Image */}
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Cover Image URL *</label>
                  <input
                    className={inputCls}
                    type="url"
                    placeholder="https://images.unsplash.com/…"
                    value={form.image}
                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  />
                </div>

                {/* Preview card */}
                <div>
                  <p className="text-[10px] text-charcoal/40 uppercase tracking-widest mb-2">Card Preview</p>
                  <div className="relative h-52 rounded-2xl overflow-hidden shadow-md border border-rose/10 bg-ivory">
                    {form.image ? (
                      <img src={form.image} alt={form.name || 'Preview'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                        <Image size={36} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-luxury-serif text-lg font-bold truncate">{form.name || 'Category Name'}</p>
                      <p className="text-[10px] text-white/70 line-clamp-2 font-light mt-0.5">{form.description || 'Description…'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={save}
                disabled={!form.name.trim() || !form.image.trim()}
                className="flex items-center gap-2 bg-charcoal text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg hover:bg-gold hover:text-charcoal transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save size={13} />
                {editingId ? 'Save Changes' : 'Add Category'}
              </button>
              <button
                onClick={resetForm}
                className="text-xs font-semibold text-charcoal/40 hover:text-charcoal px-4 py-2.5 border border-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="group relative bg-white border border-rose/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gold/20 transition-all"
          >
            {/* Image */}
            <div className="relative h-44">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-ivory flex items-center justify-center text-charcoal/20">
                  <Image size={28} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="font-luxury-serif text-base font-bold leading-tight">{cat.name}</h3>
                <p className="text-[10px] text-white/65 line-clamp-1 font-light mt-0.5">{cat.description}</p>
              </div>
            </div>

            {/* Meta */}
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-[10px] text-charcoal/40 font-mono">ID: {cat.id}</span>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(cat)}
                  className="p-1.5 text-charcoal/50 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                {deleteConfirmId === cat.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="text-[10px] font-bold text-white bg-red-500 px-2 py-1 rounded-md"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-[10px] font-bold text-charcoal/40 border border-gray-200 px-2 py-1 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(cat.id)}
                    className="p-1.5 text-charcoal/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {categories.length === 0 && (
          <div className="col-span-full py-16 text-center text-charcoal/40 bg-white border border-rose/10 rounded-2xl">
            <GripVertical size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No categories yet. Click "Add Category" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
