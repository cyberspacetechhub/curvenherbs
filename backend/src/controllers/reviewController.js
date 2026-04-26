const { addReview, approveReview, getProductReviews, getPendingReviews, deleteReview } = require('../services/reviewService');

const handleAddReview = async (req, res) => {
  const review = await addReview({ ...req.body, product: req.params.productId });
  res.status(201).json({ success: true, data: review });
};

const handleGetProductReviews = async (req, res) => {
  const reviews = await getProductReviews(req.params.productId);
  res.json({ success: true, data: reviews });
};

const handleGetPendingReviews = async (req, res) => {
  const reviews = await getPendingReviews();
  res.json({ success: true, data: reviews });
};

const handleApproveReview = async (req, res) => {
  const review = await approveReview(req.params.id);
  res.json({ success: true, data: review });
};

const handleDeleteReview = async (req, res) => {
  await deleteReview(req.params.id);
  res.json({ success: true, message: 'Review deleted' });
};

module.exports = { handleAddReview, handleGetProductReviews, handleGetPendingReviews, handleApproveReview, handleDeleteReview };
