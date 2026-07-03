import prisma from '../utils/prisma.js';

export const getDashboardAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get all orders to aggregate
    const allOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID'
      }
    });

    // Today's paid orders
    const todayOrders = allOrders.filter(o => new Date(o.createdAt) >= today);
    const todayOrdersCount = todayOrders.length;
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Monthly revenue
    const monthlyOrders = allOrders.filter(o => new Date(o.createdAt) >= firstDayOfMonth);
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const monthlyOrdersCount = monthlyOrders.length;

    // Total orders count
    const totalOrdersCount = allOrders.length;

    // Products metrics aggregations
    const productSales = {};
    allOrders.forEach(order => {
      let itemsList = [];
      try {
        itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      } catch (e) {
        itemsList = order.items || [];
      }

      if (Array.isArray(itemsList)) {
        itemsList.forEach(item => {
          const id = item.productId || 'unknown';
          const name = item.name || 'Unknown Product';
          const qty = parseInt(item.quantity) || 1;
          const total = parseFloat(item.price) * qty || 0;

          if (!productSales[id]) {
            productSales[id] = { id, name, qty: 0, revenue: 0 };
          }
          productSales[id].qty += qty;
          productSales[id].revenue += total;
        });
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Low inventory check (less than 5 units left)
    const lowInventoryProducts = await prisma.product.findMany({
      where: { inventory: { lt: 5 } },
      select: { id: true, name: true, inventory: true, price: true },
      take: 10
    });

    // Categories count
    const categoriesCount = await prisma.category.count();
    const productsCount = await prisma.product.count();
    const customOrdersPendingCount = await prisma.customOrder.count({
      where: { status: 'PENDING' }
    });

    // Active customers count
    const customersCount = await prisma.user.count({
      where: { role: 'CUSTOMER' }
    });

    res.json({
      metrics: {
        todayOrdersCount,
        todayRevenue,
        monthlyRevenue,
        monthlyOrdersCount,
        totalOrdersCount,
        customersCount,
        productsCount,
        categoriesCount,
        customOrdersPendingCount
      },
      topProducts,
      lowInventoryProducts
    });
  } catch (error) {
    console.error('Get Dashboard Analytics Error:', error);
    res.status(500).json({ message: 'Error retrieving dashboard stats.' });
  }
};
