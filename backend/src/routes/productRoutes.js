const express = require('express');
const router = express.Router();
const { handleGetAllProducts, handleGetProduct, handleCreateProduct, handleUpdateProduct, handleDeleteProduct } = require('../controllers/productController');
const verifyJwt = require('../middlewares/verifyJwt');
const verifyRoles = require('../middlewares/verifyRoles');

// Public
router.get('/', handleGetAllProducts);
router.get('/:slug', handleGetProduct);

// Admin only
router.use(verifyJwt, verifyRoles('Admin', 'superadmin', 'manager'));
router.post('/', handleCreateProduct);
router.put('/:id', handleUpdateProduct);
router.delete('/:id', handleDeleteProduct);

module.exports = router;
