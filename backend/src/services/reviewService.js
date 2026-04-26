const Review = require('../models/Review');
const { updateProductRating } = require('./productService');

const addReview = async (data) => {
  const review = await Review.create(data);
  return review;
};

const approveReview = async (reviewId) => {
  const review = await Review.findByIdAndUpdate(reviewId, { approved: true }, { new: true });
  if (!review) throw new Error('Review not found');
  await updateProductRating(review.product);
  return review;
};

const getProductReviews = async (productId) => {
  return await Review.find({ product: productId, approved: true }).sort({ createdAt: -1 });
};

const getPendingReviews = async () => {
  return await Review.find({ approved: false }).populate('product', 'name');
};

const deleteReview = async (reviewId) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (review) await updateProductRating(review.product);
};

module.exports = { addReview, approveReview, getProductReviews, getPendingReviews, deleteReview };
