'use client';

import React, { useState, useEffect } from 'react';
import { apiCall, MOCK_REVIEWS } from '@/utils/api';
import { Star, CheckCircle2, XCircle, Trash2, ShieldAlert } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await apiCall<any[]>('/reviews');
    if (data && data.length > 0) {
      setReviews(data);
    } else {
      setReviews(MOCK_REVIEWS);
    }
    setLoading(false);
  };

  const handleToggleApprove = async (id: string, isApproved: boolean) => {
    setUpdatingId(id);
    const { data } = await apiCall(`/reviews/${id}`, 'PUT', { isApproved });

    // Update locally
    setReviews(reviews.map(r => r.id === id ? { ...r, isApproved } : r));
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;
    const { error } = await apiCall(`/reviews/${id}`, 'DELETE');
    if (!error) {
      setReviews(reviews.filter(r => r.id !== id));
    } else {
      // Mock delete
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-charcoal">Moderate Reviews</h1>
        <p className="text-xs text-charcoal/50 mt-1">Approve, reject, or delete user-submitted product reviews before they display on storefront.</p>
      </div>

      {/* Table List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-charcoal/60 uppercase tracking-wider">
                <th className="py-4 px-6">User / Product ID</th>
                <th className="py-4 px-6">Review Content</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-charcoal/40">Loading reviews...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-charcoal/40">No reviews found.</td>
                </tr>
              ) : (
                reviews.map(review => {
                  return (
                    <tr key={review.id} className="hover:bg-ivory/10 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {review.image && (
                            <img src={review.image} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-100" />
                          )}
                          <div>
                            <span className="font-bold text-charcoal block">{review.authorName}</span>
                            <span className="text-[10px] text-charcoal/40">{review.productId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-xs text-xs text-charcoal/70 leading-relaxed italic">
                        "{review.comment}"
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <Star
                              key={star}
                              size={12}
                              fill={star <= review.rating ? '#D4AF37' : 'none'}
                              className={star <= review.rating ? 'text-gold' : 'text-charcoal/20'}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          review.isApproved
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {review.isApproved ? 'Approved' : 'Pending Review'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleToggleApprove(review.id, !review.isApproved)}
                            disabled={updatingId === review.id}
                            className={`p-2 border rounded-lg transition-all ${
                              review.isApproved
                                ? 'border-amber-100 text-amber-600 hover:bg-amber-50/50'
                                : 'border-green-100 text-green-600 hover:bg-green-50/50'
                            }`}
                            title={review.isApproved ? 'Revoke Approval' : 'Approve Review'}
                          >
                            {review.isApproved ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-2 border border-gray-100 hover:border-red-400 text-charcoal/60 hover:text-red-500 rounded-lg transition-all"
                            title="Delete Review"
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
    </div>
  );
}
