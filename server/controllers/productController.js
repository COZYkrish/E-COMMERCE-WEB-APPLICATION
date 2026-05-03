const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get all products (search, filter, paginate)
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };

  if (search) query.title = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { rating: -1 },
  };
  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortBy).skip(skip).limit(Number(limit));

  res.json({
    success: true,
    count: products.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    products,
  });
});

// @desc  Get single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
  res.json({ success: true, product });
});

// @desc  Create product
// @route POST /api/products
// @access Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, message: 'Product created', product });
});

// @desc  Update product
// @route PUT /api/products/:id
// @access Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, message: 'Product updated', product });
});

// @desc  Delete product (soft delete)
// @route DELETE /api/products/:id
// @access Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, message: 'Product deleted' });
});

// @desc  Get all products for admin (including inactive)
// @route GET /api/products/admin/all
// @access Admin
const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json({ success: true, count: products.length, products });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getAdminProducts };
