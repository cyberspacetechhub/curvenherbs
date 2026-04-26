const { createProduct, getAllProducts, getProductBySlug, getProductById, updateProduct, deleteProduct } = require('../services/productService');
const { uploadImage, deleteImage } = require('../services/uploadService');

const handleGetAllProducts = async (req, res) => {
  const products = await getAllProducts(req.query);
  res.json({ success: true, data: products });
};

const handleGetProduct = async (req, res) => {
  const product = await getProductBySlug(req.params.slug);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
};

const handleCreateProduct = async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    const { url, publicId } = await uploadImage(req.file.path, 'curvenherbs/products');
    data.images = [{ url, alt: data.name, isMain: true, publicId }];
  }

  const product = await createProduct(data);
  res.status(201).json({ success: true, data: product });
};

const handleUpdateProduct = async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    const { url, publicId } = await uploadImage(req.file.path, 'curvenherbs/products');
    data.images = [{ url, alt: data.name, isMain: true, publicId }];
  }

  const product = await updateProduct(req.params.id, data);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
};

const handleDeleteProduct = async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  if (product.images?.length) {
    await Promise.all(product.images.map(img => img.publicId && deleteImage(img.publicId)));
  }

  await deleteProduct(req.params.id);
  res.json({ success: true, message: 'Product deleted' });
};

module.exports = { handleGetAllProducts, handleGetProduct, handleCreateProduct, handleUpdateProduct, handleDeleteProduct };
