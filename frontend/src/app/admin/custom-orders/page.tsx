'use client';

import React, { useState, useEffect } from 'react';
import { apiCall, getStoredCustomOrders, saveStoredCustomOrders } from '@/utils/api';
import { Palette, MessageCircle, Eye, Trash2, Calendar, FileText, CheckCircle } from 'lucide-react';

export default function AdminCustomOrdersPage() {
  const [customRequests, setCustomRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await apiCall<any[]>('/custom-orders');
    if (data && data.length > 0) {
      setCustomRequests(data);
    } else {
      const stored = getStoredCustomOrders();
      if (stored && stored.length > 0) {
        setCustomRequests(stored);
      } else {
        // Mock requests
        const mockRequests = [
          {
            id: 'cust-1',
            name: 'Priyanka Sen',
            email: 'priyankanet@gmail.com',
            phone: '+91 91122 33445',
            occasion: 'Wedding',
            fragrance: 'Vintage Lilly',
            customMessage: 'Together Forever - P & K 12.12.2026',
            referenceImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
            quantity: 150,
            deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            notes: ''
          },
          {
            id: 'cust-2',
            name: 'Vikram Mehta',
            email: 'vikram.mehta@corp.in',
            phone: '+91 94412 51145',
            occasion: 'Corporate Event',
            fragrance: 'Chocolate',
            customMessage: 'V-Tech Solutions - Excellence',
            referenceImage: 'https://images.unsplash.com/photo-1602872030219-cbf948a910d8?w=300&auto=format&fit=crop&q=80',
            quantity: 80,
            deliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'CONTACTED',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Discussed box branding color options on WhatsApp.'
          }
        ];
        setCustomRequests(mockRequests);
      }
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, updates: { status?: string; notes?: string }) => {
    setUpdatingId(id);
    const { data } = await apiCall(`/custom-orders/${id}`, 'PUT', updates);

    // Update locally
    const updated = customRequests.map(r => {
      if (r.id === id) {
        const item = { ...r, ...updates };
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest(item);
        }
        return item;
      }
      return r;
    });

    setCustomRequests(updated);

    // Persist custom orders changes to local storage
    try {
      const stored = getStoredCustomOrders();
      const updatedStored = stored.map(r => r.id === id ? { ...r, ...updates } : r);
      saveStoredCustomOrders(updatedStored);
    } catch (e) {
      console.error(e);
    }

    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom query?')) return;
    const { error } = await apiCall(`/custom-orders/${id}`, 'DELETE');
    
    const remaining = customRequests.filter(r => r.id !== id);
    setCustomRequests(remaining);
    if (selectedRequest?.id === id) setSelectedRequest(null);

    // Persist deletion to local storage
    try {
      const stored = getStoredCustomOrders();
      const updatedStored = stored.filter(r => r.id !== id);
      saveStoredCustomOrders(updatedStored);
    } catch (e) {
      console.error(e);
    }
  };

  const getWhatsAppLink = (phone: string, name: string, occasion: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const text = `Hello ${name}! This is Melting Memories regarding your custom candle query for the upcoming ${occasion}. Let's discuss design layouts, box customizations, and total pricing options.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-charcoal">Custom Candle Queries</h1>
        <p className="text-xs text-charcoal/50 mt-1">Review custom design specs, engagement dates, and message prints requested by buyers.</p>
      </div>

      {/* Grid of custom cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shimmer h-48 animate-pulse" />
          ))}
        </div>
      ) : customRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <Palette size={40} className="text-charcoal/20 mx-auto mb-4" />
          <h3 className="font-luxury-serif text-xl font-bold text-charcoal">No Custom Queries</h3>
          <p className="text-sm text-charcoal/50 font-light">Custom candle submissions from the homepage/bespoke studio will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customRequests.map(request => {
            return (
              <div key={request.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">Occasion: {request.occasion}</span>
                      <h2 className="font-luxury-serif text-lg font-bold text-charcoal">{request.name}</h2>
                      <span className="text-[10px] text-charcoal/40">{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>

                    <select
                      value={request.status}
                      onChange={e => handleUpdateStatus(request.id, { status: e.target.value })}
                      disabled={updatingId === request.id}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border focus:outline-none ${
                        request.status === 'APPROVED'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : request.status === 'REJECTED'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : request.status === 'CONTACTED'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-xs text-charcoal/70">
                      <Calendar size={13} className="text-gold mr-1.5 flex-shrink-0" />
                      <span>Delivery Target: <strong>{new Date(request.deliveryDate).toLocaleDateString()}</strong></span>
                    </div>
                    <div className="flex items-center text-xs text-charcoal/70">
                      <FileText size={13} className="text-gold mr-1.5 flex-shrink-0" />
                      <span>Qty: <strong>{request.quantity} candles</strong> | Scent: <strong>{request.fragrance}</strong></span>
                    </div>
                    {request.customMessage && (
                      <p className="bg-ivory/50 border border-rose/5 p-3 rounded-lg text-xs text-charcoal/80 font-light italic mt-2">
                        "{request.customMessage}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-gray-50 mt-4">
                  <a
                    href={getWhatsAppLink(request.phone, request.name, request.occasion)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Customer</span>
                  </a>
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="p-3 border border-gray-100 hover:border-gold text-charcoal/60 hover:text-gold rounded-xl transition-all"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="p-3 border border-gray-100 hover:border-red-400 text-charcoal/60 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Query Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50">
              <h2 className="font-luxury-serif text-lg font-bold text-charcoal">Bespoke Query Details</h2>
              <button onClick={() => setSelectedRequest(null)} className="text-charcoal/40 hover:text-charcoal font-bold p-1">Close</button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 block">Customer Name</span>
                  <span className="font-bold text-charcoal text-sm">{selectedRequest.name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 block">Phone / WhatsApp</span>
                  <span className="font-bold text-charcoal text-sm">{selectedRequest.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 block">Email Address</span>
                  <span className="font-semibold text-charcoal">{selectedRequest.email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 block">Delivery Goal</span>
                  <span className="font-semibold text-charcoal">{new Date(selectedRequest.deliveryDate).toLocaleDateString()}</span>
                </div>
              </div>

              {selectedRequest.referenceImage && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 block mb-2">Reference Image</span>
                  <div className="w-40 h-40 rounded-xl overflow-hidden border border-gray-100 bg-ivory">
                    <img src={selectedRequest.referenceImage} alt="Reference" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Internal Office Notes</label>
                <textarea
                  rows={3}
                  defaultValue={selectedRequest.notes || ''}
                  onBlur={e => handleUpdateStatus(selectedRequest.id, { notes: e.target.value })}
                  placeholder="Record order quotes, color agreements, or customer requests..."
                  className="w-full bg-ivory border border-gray-200/60 p-3 rounded-lg text-xs text-charcoal focus:outline-none focus:border-gold resize-none"
                />
                <span className="text-[9px] text-charcoal/40 block mt-1">Changes are automatically saved to database on input blur.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
