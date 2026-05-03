const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getAdminProducts } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin/all', protect, adminOnly, getAdminProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
