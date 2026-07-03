import prisma from '../utils/prisma.js';

export const createReview = async (req, res) => {
  try {
    const { rating, comment, image, video, productId, authorName } = req.body;

    if (!rating || !comment || !productId) {
      return res.status(400).json({ message: 'Rating, comment, and product ID are required.' });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        image: image || null,
        video: video || null,
        productId,
        userId: req.user ? req.user.id : null,
        authorName: authorName || (req.user ? req.user.name : 'Valued Customer'),
        isApproved: false // default false, must be approved by admin
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({ message: 'Error submitting review.' });
  }
};

export const getApprovedReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get Product Reviews Error:', error);
    res.status(500).json({ message: 'Error retrieving reviews.' });
  }
};

export const getFeaturedReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        isApproved: true,
        isFeatured: true
      },
      include: {
        product: { select: { name: true, images: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get Featured Reviews Error:', error);
    res.status(500).json({ message: 'Error retrieving reviews.' });
  }
};

export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get Admin Reviews Error:', error);
    res.status(500).json({ message: 'Error retrieving reviews.' });
  }
};

export const updateReviewStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, isFeatured } = req.body;

    const data = {};
    if (isApproved !== undefined) data.isApproved = !!isApproved;
    if (isFeatured !== undefined) data.isFeatured = !!isFeatured;

    const review = await prisma.review.update({
      where: { id },
      data
    });

    res.json(review);
  } catch (error) {
    console.error('Update Review Admin Error:', error);
    res.status(500).json({ message: 'Error updating review.' });
  }
};

export const deleteReviewAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Delete Review Error:', error);
    res.status(500).json({ message: 'Error deleting review.' });
  }
};
