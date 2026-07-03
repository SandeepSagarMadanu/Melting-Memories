'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Clock, Tag, FileText, Image } from 'lucide-react';
import { getStoredBlogs, saveStoredBlogs, MOCK_BLOGS } from '@/utils/api';

const BLOG_CATEGORIES = ['Wedding Gifts', 'Birthday Gifts', 'Luxury Decor', 'Candle Care', 'Corporate Gifting'];

const emptyForm = {
  id: '',
  title: '',
  slug: '',
  category: BLOG_CATEGORIES[0],
  readTime: '3 mins read',
  image: '',
  content: '',
  publishedAt: new Date().toISOString(),
  isPublished: true,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');

  // Load blogs from localStorage on mount
  useEffect(() => {
    setBlogs(getStoredBlogs());
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingId) {
      setForm(f => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, editingId]);

  const save = () => {
    if (!form.title.trim() || !form.content.trim()) return;

    let updated: any[];
    if (editingId) {
      updated = blogs.map(b => b.id === editingId ? { ...form, id: editingId } : b);
    } else {
      const newBlog = {
        ...form,
        id: `blog-${Date.now()}`,
        slug: form.slug || slugify(form.title),
        publishedAt: new Date().toISOString(),
      };
      updated = [newBlog, ...blogs];
    }
    setBlogs(updated);
    saveStoredBlogs(updated);
    resetForm();
  };

  const startEdit = (blog: any) => {
    setForm({ ...blog });
    setEditingId(blog.id);
    setShowForm(true);
    setPreviewMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteBlog = (id: string) => {
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated);
    saveStoredBlogs(updated);
    setDeleteConfirmId(null);
  };

  const resetForm = () => {
    setForm({ ...emptyForm, publishedAt: new Date().toISOString() });
    setEditingId(null);
    setShowForm(false);
    setPreviewMode(false);
  };

  const resetToMock = () => {
    saveStoredBlogs([]);
    localStorage.removeItem('mm_blogs');
    setBlogs(MOCK_BLOGS);
  };

  const inputCls = "w-full bg-[#F8F7F5] border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors";
  const labelCls = "block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-1.5";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury-serif text-2xl font-bold text-charcoal">Blog Manager</h1>
          <p className="text-xs text-charcoal/50 mt-1">{blogs.length} post{blogs.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToMock}
            className="text-xs text-charcoal/40 hover:text-red-400 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyForm, publishedAt: new Date().toISOString() }); }}
            className="flex items-center gap-2 bg-gold text-charcoal text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-gold-hover transition-colors shadow-sm"
          >
            <Plus size={14} />
            New Post
          </button>
        </div>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white border border-rose/10 rounded-2xl shadow-sm overflow-hidden">
          {/* Form Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-charcoal text-sm">
              {editingId ? '✏️ Editing Post' : '✨ Create New Post'}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode(p => !p)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${previewMode ? 'bg-gold/10 text-gold border-gold/30' : 'text-charcoal/50 border-gray-200 hover:border-gold/30'}`}
              >
                {previewMode ? <EyeOff size={12} /> : <Eye size={12} />}
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button onClick={resetForm} className="text-charcoal/40 hover:text-red-400 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {previewMode ? (
              /* ── Card Preview ── */
              <div className="max-w-sm mx-auto">
                <p className="text-xs text-charcoal/40 text-center mb-4 uppercase tracking-widest">Card Preview</p>
                <div className="bg-white border border-rose/10 rounded-2xl overflow-hidden shadow-md">
                  <div className="aspect-video overflow-hidden bg-ivory">
                    {form.image ? (
                      <img src={form.image} alt={form.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-ivory/80 text-charcoal/20">
                        <Image size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="inline-block bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                      {form.category}
                    </span>
                    <h3 className="font-luxury-serif text-lg font-bold text-charcoal mb-2 leading-snug">
                      {form.title || 'Post Title'}
                    </h3>
                    <p className="text-xs text-charcoal/60 line-clamp-3 mb-3 font-light">{form.content || 'Content preview…'}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-rose/10">
                      <span className="flex items-center gap-1 text-[10px] text-charcoal/40">
                        <Clock size={11} /> {form.readTime}
                      </span>
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Read More →</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Edit Form ── */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Title *</label>
                    <input
                      className={inputCls}
                      placeholder="e.g. The Art of Gifting Candles"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Slug (URL path)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-charcoal/40">/blog/</span>
                      <input
                        className={inputCls}
                        placeholder="auto-generated-from-title"
                        value={form.slug}
                        onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Category</label>
                      <select
                        className={inputCls}
                        value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      >
                        {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Read Time</label>
                      <input
                        className={inputCls}
                        placeholder="3 mins read"
                        value={form.readTime}
                        onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Cover Image URL</label>
                    <input
                      className={inputCls}
                      type="url"
                      placeholder="https://images.unsplash.com/…"
                      value={form.image}
                      onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    />
                    {form.image && (
                      <img src={form.image} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-lg border border-rose/10" />
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Content / Body *</label>
                    <textarea
                      className={`${inputCls} min-h-[220px] resize-y`}
                      placeholder="Write the full blog post content here. Supports plain text paragraphs."
                      value={form.content}
                      onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={form.isPublished !== false}
                        onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                      />
                      <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gold rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                    <span className="text-xs font-semibold text-charcoal/70">Published</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!previewMode && (
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={save}
                  disabled={!form.title.trim() || !form.content.trim()}
                  className="flex items-center gap-2 bg-charcoal text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg hover:bg-gold hover:text-charcoal transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Save size={13} />
                  {editingId ? 'Save Changes' : 'Publish Post'}
                </button>
                <button
                  onClick={resetForm}
                  className="text-xs font-semibold text-charcoal/40 hover:text-charcoal px-4 py-2.5 border border-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blog List */}
      <div className="bg-white border border-rose/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-sm font-bold text-charcoal">All Posts</h2>
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {['All', ...BLOG_CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`py-1 px-3.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                  filterCategory === cat
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'bg-white text-charcoal/60 border-rose/10 hover:border-gold hover:text-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {(() => {
          const filtered = filterCategory === 'All'
            ? blogs
            : blogs.filter(b => b.category === filterCategory);

          if (filtered.length === 0) {
            return (
              <div className="py-16 text-center text-charcoal/40">
                <FileText size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No blog posts found under "{filterCategory}".</p>
              </div>
            );
          }

          return (
            <div className="divide-y divide-gray-50">
              {filtered.map(blog => (
                <div key={blog.id} className="flex items-start gap-4 p-5 hover:bg-[#F8F7F5] transition-colors group">
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-ivory flex-shrink-0 border border-rose/10">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                        <Image size={20} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block bg-gold/10 text-gold text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                        {blog.category}
                      </span>
                      {blog.isPublished === false && (
                        <span className="text-[9px] bg-gray-100 text-charcoal/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Draft</span>
                      )}
                    </div>
                    <h3 className="font-luxury-serif text-sm font-bold text-charcoal truncate">{blog.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-charcoal/40">
                        <Clock size={10} /> {blog.readTime}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-charcoal/40">
                        <Tag size={10} /> /blog/{blog.slug}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => startEdit(blog)}
                      className="p-1.5 text-charcoal/50 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    {deleteConfirmId === blog.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="text-[10px] font-bold text-white bg-red-500 px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-[10px] font-bold text-charcoal/50 border border-gray-200 px-2 py-1 rounded-md hover:border-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(blog.id)}
                        className="p-1.5 text-charcoal/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
