import prisma from '../utils/prisma.js';

export const createCustomOrder = async (req, res) => {
  try {
    const { name, email, phone, occasion, fragrance, customMessage, referenceImage, quantity, deliveryDate } = req.body;

    if (!name || !email || !phone || !occasion || !fragrance || !quantity || !deliveryDate) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const customOrder = await prisma.customOrder.create({
      data: {
        name,
        email,
        phone,
        occasion,
        fragrance,
        customMessage: customMessage || null,
        referenceImage: referenceImage || null,
        quantity: parseInt(quantity),
        deliveryDate: new Date(deliveryDate),
        status: 'PENDING'
      }
    });

    res.status(201).json(customOrder);
  } catch (error) {
    console.error('Create Custom Order Error:', error);
    res.status(500).json({ message: 'Internal error submitting request.' });
  }
};

export const getAllCustomOrdersAdmin = async (req, res) => {
  try {
    const customOrders = await prisma.customOrder.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(customOrders);
  } catch (error) {
    console.error('Get Admin Custom Orders Error:', error);
    res.status(500).json({ message: 'Error retrieving custom requests.' });
  }
};

export const updateCustomOrderStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const data = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;

    const customOrder = await prisma.customOrder.update({
      where: { id },
      data
    });

    res.json(customOrder);
  } catch (error) {
    console.error('Update Custom Order Admin Error:', error);
    res.status(500).json({ message: 'Error updating custom request.' });
  }
};

export const deleteCustomOrderAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.customOrder.delete({ where: { id } });
    res.json({ message: 'Custom order request deleted successfully.' });
  } catch (error) {
    console.error('Delete Custom Order Error:', error);
    res.status(500).json({ message: 'Error deleting custom request.' });
  }
};
