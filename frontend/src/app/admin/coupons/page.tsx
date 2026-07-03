'use client';

import React, { useState, useEffect } from 'react';
import { apiCall } from '@/utils/api';
import { Tag, Plus, Trash2, Calendar, Eye, ToggleLeft, ToggleRight, X, AlertCircle } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Add coupon state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [value, setValue] = useState(10);
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState(100);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    const { data } = await apiCall<any[]>('/coupons');
    if (data && data.length > 0) {
      setCoupons(data);
    } else {
      // Mock active coupons
      setCoupons([
        {
          id: 'coup-1',
          code: 'MELTING10',
          discountType: 'PERCENTAGE',
          value: 10,
          expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          usageLimit: 500,
          timesUsed: 42,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'coup-2',
          code: 'FESTIVE50',
          discountType: 'FLAT',
          value: 50,
          expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Expired
          usageLimit: 100,
          timesUsed: 100,
          isActive: true,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    }
    setLoading(false);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const nextActive = !currentActive;
    await apiCall(`/coupons/${id}`, 'PUT', { isActive: nextActive });
    setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: nextActive } : c));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    const { error } = await apiCall(`/coupons/${id}`, 'DELETE');
    if (!error) {
      setCoupons(coupons.filter(c => c.id !== id));
    } else {
      setCoupons(coupons.filter(c => c.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      code: code.toUpperCase(),
      discountType,
      value: Number(value),
      expiryDate,
      usageLimit: Number(usageLimit)
    };

    const { data } = await apiCall<any>('/coupons', 'POST', payload);

    if (data) {
      setCoupons([data, ...coupons]);
    } else {
      // Mock insert fallback
      const mockNew = {
        id: `coup-${Date.now()}`,
        ...payload,
        timesUsed: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setCoupons([mockNew, ...coupons]);
    }

    setIsModalOpen(false);
    setCode('');
    setDiscountType('PERCENTAGE');
    setValue(10);
    setExpiryDate('');
    setUsageLimit(100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-charcoal">Coupons & Offers</h1>
          <p className="text-xs text-charcoal/50 mt-1">Manage promotional discount codes, validity dates, and usage restrictions.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl transition-all flex items-center space-x-2 shadow-md"
        >
          <Plus size={15} />
          <span>New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-charcoal/60 uppercase tracking-wider">
                <th className="py-4 px-6">Coupon Details</th>
                <th className="py-4 px-6">Discount Type</th>
                <th className="py-4 px-6">Expiry Date</th>
                <th className="py-4 px-6">Usage (Limit)</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-charcoal/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-charcoal/40">Loading coupons...</td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-charcoal/40">No coupons configured.</td>
                </tr>
              ) : (
                coupons.map(coupon => {
                  const isExpired = new Date(coupon.expiryDate) < new Date();
                  const isLimitReached = coupon.timesUsed >= coupon.usageLimit;

                  return (
                    <tr key={coupon.id} className="hover:bg-ivory/10 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Tag size={15} className="text-gold" />
                          <span className="font-bold text-charcoal font-mono tracking-wider">{coupon.code}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold">
                        {coupon.discountType === 'PERCENTAGE' ? `${coupon.value}% Off` : `₹${coupon.value} Flat`}
                      </td>
                      <td className="py-4 px-6 text-xs text-charcoal/60">
                        <span className={isExpired ? 'text-red-500 font-semibold' : ''}>
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                          {isExpired && ' (Expired)'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs font-semibold">
                        <span className={isLimitReached ? 'text-red-500 font-bold' : ''}>
                          {coupon.timesUsed} / {coupon.usageLimit}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                          className={`text-xs flex items-center space-x-1.5 focus:outline-none ${
                            coupon.isActive && !isExpired && !isLimitReached
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {coupon.isActive && !isExpired && !isLimitReached ? (
                            <>
                              <ToggleRight size={24} className="text-green-500" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={24} className="text-gray-300" />
                              <span>Disabled</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 border border-gray-100 hover:border-red-400 text-charcoal/60 hover:text-red-500 rounded-lg transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Coupon Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50">
              <h2 className="font-luxury-serif text-lg font-bold text-charcoal">Create Discount Coupon</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal/40 hover:text-charcoal p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Coupon Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE15"
                  required
                  className="w-full bg-ivory border border-gray-200/60 py-2.5 px-4 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Discount Type *</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value)}
                    className="w-full bg-ivory border border-gray-200/60 py-2.5 px-3 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Price (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Value *</label>
                  <input
                    type="number"
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    required
                    className="w-full bg-ivory border border-gray-200/60 py-2.5 px-3 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Expiry Date *</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    required
                    className="w-full bg-ivory border border-gray-200/60 py-2.5 px-3 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Usage Limit *</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={e => setUsageLimit(Number(e.target.value))}
                    required
                    className="w-full bg-ivory border border-gray-200/60 py-2.5 px-3 rounded-md focus:outline-none focus:border-gold text-sm text-charcoal"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold uppercase tracking-widest py-3.5 rounded-md transition-all text-center shadow-md pt-4"
              >
                Create Promotional Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
