const Product = require('../models/Products');
const slugify = require('slugify');

const createProduct = async (data) => {
  data.slug = slugify(data.name, { lower: true, strict: true });
  return await Product.create(data);
};

const getAllProducts = async (filters = {}) => {
  const query = {};
  if (filters.category) query.category = filters.category;
  if (filters.inStock) query.isInStock = true;
  if (filters.tag) query.tags = filters.tag;

  return await Product.find(query).sort({ createdAt: -1 });
};

const getProductBySlug = async (slug) => {
  return await Product.findOne({ slug });
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const updateProduct = async (id, data) => {
  if (data.name) data.slug = slugify(data.name, { lower: true, strict: true });
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

const updateProductRating = async (productId) => {
  const Review = require('../models/Review');
  const result = await Review.aggregate([
    { $match: { product: productId, approved: true } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  if (result.length === 0) return;
  const { avgRating, count } = result[0];
  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: count
  });
};

module.exports = { createProduct, getAllProducts, getProductBySlug, getProductById, updateProduct, deleteProduct, updateProductRating };
