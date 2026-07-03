'use client';

import React, { useState, useEffect } from 'react';
import { apiCall } from '@/utils/api';
import { ClipboardList, Download, Check, ShieldAlert, Eye, Search, AlertCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await apiCall<any[]>('/orders');
    if (data) {
      setOrders(data);
      setFilteredOrders(data);
    } else {
      // Mock Fallback Orders
      const mockOrders = [
        {
          id: 'ord-1',
          orderNumber: 'MM-100293',
          customerName: 'Aishwarya Rao',
          customerEmail: 'aishwarya@gmail.com',
          customerPhone: '+91 98765 43210',
          customerAddress: 'Jubilee Hills, Road No 36, Hyderabad - 500033',
          totalAmount: 219,
          paymentStatus: 'PAID',
          fulfillmentStatus: 'DELIVERED',
          trackingNumber: 'DEL-887102',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            { name: 'Peony Rose', price: 59, quantity: 2, fragrance: 'Rose Bloom', color: 'Pink' },
            { name: 'Love Rose', price: 39, quantity: 1, fragrance: 'Vintage Lilly', color: 'Red' }
          ]
        },
        {
          id: 'ord-2',
          orderNumber: 'MM-100187',
          customerName: 'Rohan Sharma',
          customerEmail: 'rohan.sharma@yahoo.com',
          customerPhone: '+91 90001 22334',
          customerAddress: 'Gachibowli, Near DLF, Hyderabad - 500032',
          totalAmount: 99,
          paymentStatus: 'PAID',
          fulfillmentStatus: 'SHIPPED',
          trackingNumber: 'INPOST-772910',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            { name: 'Triple Rose Pillar', price: 99, quantity: 1, fragrance: 'Chocolate', color: 'Ivory White' }
          ]
        },
        {
          id: 'ord-3',
          orderNumber: 'MM-100311',
          customerName: 'Neha Reddy',
          customerEmail: 'neha.reddy@gmail.com',
          customerPhone: '+91 88877 66554',
          customerAddress: 'Hayathnagar, Srinagar Colony, Hyderabad - 501505',
          totalAmount: 69,
          paymentStatus: 'PENDING',
          fulfillmentStatus: 'PENDING',
          trackingNumber: '',
          createdAt: new Date().toISOString(),
          items: [
            { name: 'Hand In Hand Heart', price: 69, quantity: 1, fragrance: 'Vintage Lilly', color: 'Champagne Gold' }
          ]
        }
      ];
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredOrders(
        orders.filter(
          o =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerPhone.includes(q)
        )
      );
    }
  }, [searchQuery, orders]);

  const handleUpdateStatus = async (id: string, updates: { paymentStatus?: string; fulfillmentStatus?: string; trackingNumber?: string }) => {
    setUpdatingId(id);
    const { data } = await apiCall(`/orders/${id}`, 'PUT', updates);

    // Update locally
    const updated = orders.map(o => {
      if (o.id === id) {
        const item = { ...o, ...updates };
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(item);
        }
        return item;
      }
      return o;
    });

    setOrders(updated);
    setUpdatingId(null);
  };

  const handleExportCSV = () => {
    // Generate manual CSV from frontend list
    let csvContent = 'data:text/csv;charset=utf-8,Order Number,Customer Name,Email,Phone,Total Amount,Payment Status,Fulfillment Status,Date\n';
    orders.forEach(order => {
      const row = [
        order.orderNumber,
        `"${order.customerName}"`,
        order.customerEmail,
        order.customerPhone,
        order.totalAmount,
        order.paymentStatus,
        order.fulfillmentStatus,
        order.createdAt.split('T')[0]
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `melting_memories_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Export */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-charcoal">Manage Orders</h1>
          <p className="text-xs text-charcoal/50 mt-1">Review customer transactions, update tracking codes, and fulfillment states.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-charcoal hover:bg-gold hover:text-charcoal text-white text-xs font-bold uppercase tracking-widest py-3 px-5 rounded-xl transition-all flex items-center justify-center space-x-2 border border-white/5 shadow-md w-fit"
        >
          <Download size={14} />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
          <Search size={16} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search order ID, client name, or contact number..."
          className="w-full bg-white border border-gray-100 py-3 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:border-gold shadow-sm"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-charcoal/60 uppercase tracking-wider">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Fulfillment</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-charcoal/40">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-charcoal/40">No orders found matching your search.</td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  return (
                    <tr key={order.id} className="hover:bg-ivory/10 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-luxury-serif font-bold text-charcoal block">{order.orderNumber}</span>
                        <span className="text-[10px] text-charcoal/40">{order.createdAt.split('T')[0]}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-charcoal block">{order.customerName}</span>
                        <span className="text-[10px] text-charcoal/40">{order.customerPhone}</span>
                      </td>
                      <td className="py-4 px-6 font-bold text-gold">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={order.paymentStatus}
                          onChange={e => handleUpdateStatus(order.id, { paymentStatus: e.target.value })}
                          disabled={updatingId === order.id}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border focus:outline-none ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : order.paymentStatus === 'FAILED'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="FAILED">FAILED</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={order.fulfillmentStatus}
                          onChange={e => handleUpdateStatus(order.id, { fulfillmentStatus: e.target.value })}
                          disabled={updatingId === order.id}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border focus:outline-none ${
                            order.fulfillmentStatus === 'DELIVERED'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : order.fulfillmentStatus === 'SHIPPED'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : order.fulfillmentStatus === 'PROCESSING'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : order.fulfillmentStatus === 'CANCELLED'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 border border-gray-100 hover:border-gold text-charcoal/60 hover:text-gold rounded-lg transition-all"
                        >
                          <Eye size={13} />
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="font-luxury-serif text-lg font-bold text-charcoal flex items-center space-x-2">
                  <span>Order Details</span>
                  <span className="text-gold text-sm font-normal font-sans">({selectedOrder.orderNumber})</span>
                </h2>
                <span className="text-[10px] text-charcoal/40">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-charcoal/40 hover:text-charcoal font-bold p-1">
                Close
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Customer summary */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/50 block mb-1">Customer Delivery Details</span>
                <div className="bg-ivory/40 p-4 rounded-xl border border-gray-100 space-y-1 text-xs text-charcoal/85">
                  <p className="font-bold text-charcoal">{selectedOrder.customerName}</p>
                  <p>Phone: {selectedOrder.customerPhone}</p>
                  <p>Email: {selectedOrder.customerEmail}</p>
                  <p className="pt-1.5 border-t border-rose/5 mt-1.5 italic font-light">Address: {selectedOrder.customerAddress}</p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/50 block mb-2">Order Items</span>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                      <div>
                        <span className="font-bold text-charcoal block">{item.name}</span>
                        <span className="text-[10px] text-charcoal/45">Fragrance: {item.fragrance} | Color: {item.color}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gold">₹{item.price * item.quantity}</span>
                        <span className="block text-[10px] text-charcoal/40">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking form */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal/70 block mb-1.5">Delivery Tracking Code</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    defaultValue={selectedOrder.trackingNumber || ''}
                    placeholder="Enter Delhivery/DTDC/Post tracking ID"
                    onBlur={e => handleUpdateStatus(selectedOrder.id, { trackingNumber: e.target.value })}
                    className="flex-1 bg-ivory border border-gray-200/60 py-2 px-3 rounded-md text-xs focus:outline-none focus:border-gold"
                  />
                  <span className="text-[10px] text-charcoal/40 flex items-center">Auto-saved on blur</span>
                </div>
              </div>

              {/* Totals */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                <span className="font-semibold text-charcoal">Grand Total:</span>
                <span className="text-gold font-bold text-lg">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
