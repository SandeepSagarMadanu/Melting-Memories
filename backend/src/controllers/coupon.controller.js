import prisma from '../utils/prisma.js';

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required.' });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code.' });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon code has expired.' });
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon limit has been reached.' });
    }

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value
    });
  } catch (error) {
    console.error('Validate Coupon Error:', error);
    res.status(500).json({ message: 'Error validating coupon.' });
  }
};

export const getCouponsAdmin = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(coupons);
  } catch (error) {
    console.error('Get Coupons Admin Error:', error);
    res.status(500).json({ message: 'Error retrieving coupons.' });
  }
};

export const createCouponAdmin = async (req, res) => {
  try {
    const { code, discountType, value, expiryDate, usageLimit } = req.body;

    if (!code || !discountType || value === undefined || !expiryDate) {
      return res.status(400).json({ message: 'Please provide code, type, value, and expiry date.' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        value: parseFloat(value),
        expiryDate: new Date(expiryDate),
        usageLimit: parseInt(usageLimit) || 100,
        isActive: true
      }
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.error('Create Coupon Error:', error);
    res.status(500).json({ message: 'Error creating coupon.' });
  }
};

export const updateCouponAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountType, value, expiryDate, usageLimit, isActive } = req.body;

    const data = {};
    if (code) data.code = code.toUpperCase();
    if (discountType) data.discountType = discountType;
    if (value !== undefined) data.value = parseFloat(value);
    if (expiryDate) data.expiryDate = new Date(expiryDate);
    if (usageLimit !== undefined) data.usageLimit = parseInt(usageLimit);
    if (isActive !== undefined) data.isActive = !!isActive;

    const coupon = await prisma.coupon.update({
      where: { id },
      data
    });

    res.json(coupon);
  } catch (error) {
    console.error('Update Coupon Error:', error);
    res.status(500).json({ message: 'Error updating coupon.' });
  }
};

export const deleteCouponAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    res.json({ message: 'Coupon deleted successfully.' });
  } catch (error) {
    console.error('Delete Coupon Error:', error);
    res.status(500).json({ message: 'Error deleting coupon.' });
  }
};
