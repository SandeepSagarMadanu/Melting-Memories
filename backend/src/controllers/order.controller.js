import prisma from '../utils/prisma.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, items, totalAmount, shippingFee, taxAmount, discountAmount, couponCode } = req.body;
    
    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !items || !items.length) {
      return res.status(400).json({ message: 'Missing required order details.' });
    }

    const orderNumber = `MM-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user ? req.user.id : null,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items, // JSON array
        totalAmount: parseFloat(totalAmount),
        shippingFee: parseFloat(shippingFee || 0),
        taxAmount: parseFloat(taxAmount || 0),
        discountAmount: parseFloat(discountAmount || 0),
        couponCode: couponCode || null,
        paymentStatus: 'PENDING',
        fulfillmentStatus: 'PENDING'
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Internal error creating order.' });
  }
};

// Verify order payment status
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, status } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required.' });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // In a production app, verify the Razorpay webhook signature.
    // For local/dev testing, mock verification is supported.
    const isPaid = status === 'success' || status === 'PAID';

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: isPaid ? 'PAID' : 'FAILED',
        paymentId: paymentId || 'MOCK_TXN_' + Date.now(),
        fulfillmentStatus: isPaid ? 'PROCESSING' : 'PENDING'
      }
    });

    res.json({ message: 'Payment status updated successfully.', order: updatedOrder });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ message: 'Error verifying payment.' });
  }
};

// Retrieve client's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({ message: 'Error retrieving your orders.' });
  }
};

// Retrieve specific order
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Authorization check
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get Order ID Error:', error);
    res.status(500).json({ message: 'Error retrieving order.' });
  }
};

// Retrieve specific order by order number (public search/tracking)
export const getOrderByNumber = async (req, res) => {
  try {
    const { number } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber: number }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt
    });
  } catch (error) {
    console.error('Get Order Number Error:', error);
    res.status(500).json({ message: 'Error retrieving tracking details.' });
  }
};

// Admin list all orders
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Get Admin Orders Error:', error);
    res.status(500).json({ message: 'Error retrieving orders.' });
  }
};

// Admin update order
export const updateOrderAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, fulfillmentStatus, trackingNumber } = req.body;

    const data = {};
    if (paymentStatus) data.paymentStatus = paymentStatus;
    if (fulfillmentStatus) data.fulfillmentStatus = fulfillmentStatus;
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;

    const order = await prisma.order.update({
      where: { id },
      data
    });

    res.json(order);
  } catch (error) {
    console.error('Update Order Admin Error:', error);
    res.status(500).json({ message: 'Error updating order.' });
  }
};

// Admin export CSV
export const exportOrdersCsv = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    let csvContent = 'Order Number,Customer Name,Email,Phone,Total Amount,Payment Status,Fulfillment Status,Date\n';
    
    orders.forEach(order => {
      const row = [
        order.orderNumber,
        `"${order.customerName.replace(/"/g, '""')}"`,
        order.customerEmail,
        order.customerPhone,
        order.totalAmount.toFixed(2),
        order.paymentStatus,
        order.fulfillmentStatus,
        order.createdAt.toISOString().split('T')[0]
      ].join(',');
      csvContent += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders_report.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Export CSV Error:', error);
    res.status(500).json({ message: 'Error generating report.' });
  }
};
