'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, Users, Package, Star, AlertTriangle, ArrowUp, ArrowDown, ClipboardList } from 'lucide-react';
import { apiCall, getStoredProducts } from '@/utils/api';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data } = await apiCall<any>('/dashboard/analytics');
      if (data) {
        setAnalytics(data);
      } else {
        // Mock analytics data for offline demo
        setAnalytics({
          metrics: {
            todayOrdersCount: 4,
            todayRevenue: 876,
            monthlyRevenue: 18420,
            monthlyOrdersCount: 94,
            totalOrdersCount: 312,
            customersCount: 247,
            productsCount: getStoredProducts().length,
            categoriesCount: 5,
            customOrdersPendingCount: 3
          },
          topProducts: [
            { name: 'Triple Rose Pillar', revenue: 2970, qty: 30 },
            { name: 'Peony Rose', revenue: 2829, qty: 41 },
            { name: 'Hand In Hand Heart', revenue: 2346, qty: 34 },
          ],
          lowInventoryProducts: getStoredProducts().filter(p => p.inventory < 5)
        });
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  const metrics = analytics?.metrics;

  const statCards = metrics ? [
    { label: "Today's Orders", value: metrics.todayOrdersCount, sub: `₹${metrics.todayRevenue} revenue`, icon: ShoppingBag, trend: '+12%', up: true, color: 'bg-blue-50 text-blue-600' },
    { label: 'Monthly Revenue', value: `₹${(metrics.monthlyRevenue / 1000).toFixed(1)}k`, sub: `${metrics.monthlyOrdersCount} orders`, icon: TrendingUp, trend: '+8%', up: true, color: 'bg-gold/10 text-gold' },
    { label: 'Total Customers', value: metrics.customersCount, sub: 'Registered accounts', icon: Users, trend: '+23', up: true, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Custom', value: metrics.customOrdersPendingCount, sub: 'Awaiting review', icon: ClipboardList, trend: 'Review now', up: false, color: 'bg-rose/20 text-rose' },
  ] : [];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-charcoal">Dashboard Overview</h1>
        <p className="text-xs text-charcoal/50 mt-1">Welcome back! Here's what's happening with Melting Memories today.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shimmer h-32" />
          ))}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                      <Icon size={18} />
                    </div>
                    <span className={`text-[10px] font-bold flex items-center space-x-0.5 ${card.up ? 'text-green-600' : 'text-charcoal/50'}`}>
                      {card.up ? <ArrowUp size={10} /> : null}
                      <span>{card.trend}</span>
                    </span>
                  </div>
                  <div className="font-luxury-serif text-2xl font-bold text-charcoal mb-0.5">{card.value}</div>
                  <div className="text-xs text-charcoal/50 font-medium">{card.label}</div>
                  <div className="text-[10px] text-charcoal/30 mt-0.5">{card.sub}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Selling Products */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-luxury-serif text-lg font-bold text-charcoal mb-5 pb-3 border-b border-gray-50">
                Top Selling Products
              </h2>
              <div className="space-y-4">
                {analytics?.topProducts?.map((product: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-gold/10 text-gold rounded-full flex items-center justify-center text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-charcoal">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gold block">₹{product.revenue}</span>
                      <span className="text-[10px] text-charcoal/40">{product.qty} sold</span>
                    </div>
                  </div>
                ))}
                {(!analytics?.topProducts || analytics.topProducts.length === 0) && (
                  <p className="text-sm text-charcoal/50 font-light">No sales data yet.</p>
                )}
              </div>
            </div>

            {/* Low Inventory Alert */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-5 pb-3 border-b border-gray-50">
                <AlertTriangle size={16} className="text-amber-500" />
                <h2 className="font-luxury-serif text-lg font-bold text-charcoal">Low Inventory Alert</h2>
              </div>
              {analytics?.lowInventoryProducts?.length === 0 ? (
                <div className="text-center py-6">
                  <Package size={32} className="text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-charcoal/50 font-light">All products have sufficient stock!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics?.lowInventoryProducts?.map((product: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl p-3">
                      <div>
                        <span className="text-xs font-bold text-charcoal block">{product.name}</span>
                        <span className="text-[10px] text-charcoal/50">₹{product.price}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        product.inventory === 0
                          ? 'bg-red-100 text-red-600'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {product.inventory === 0 ? 'Out of Stock' : `${product.inventory} left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Bottom Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Orders', value: metrics.totalOrdersCount },
              { label: 'Products Listed', value: metrics.productsCount },
              { label: 'Categories', value: metrics.categoriesCount },
              { label: 'Monthly Orders', value: metrics.monthlyOrdersCount }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                <div className="font-luxury-serif text-2xl font-bold text-charcoal">{stat.value}</div>
                <div className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
