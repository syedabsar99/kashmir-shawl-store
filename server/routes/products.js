/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

const express = require('express');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const protect = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

const normalizeUrl = (url, req) => {
  if (!url) return url;
  if (url.includes('/uploads/')) {
    const filename = url.split('/uploads/')[1];
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
  }
  return url;
};

const normalizeProduct = (product, req) => {
  if (!product) return product;
  const doc = product.toObject ? product.toObject() : JSON.parse(JSON.stringify(product));
  if (doc.images && Array.isArray(doc.images)) {
    doc.images = doc.images.map(img => normalizeUrl(img, req));
  }
  return doc;
};

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      featured: { featured: -1, createdAt: -1 }
    };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions[sort] || sortOptions.newest)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.json({ products: products.map(p => normalizeProduct(p, req)), total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, featured: true })
      .populate('category', 'name slug')
      .limit(8);
    res.json({ products: products.map(p => normalizeProduct(p, req)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product: normalizeProduct(product, req) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products — admin
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const product = await Product.create({ ...req.body, slug });
    res.status(201).json({ product: normalizeProduct(product, req) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id — admin
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product: normalizeProduct(product, req) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/products/:id — admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Soft delete
    product.isActive = false;
    await product.save();
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products/upload-image — admin
router.post('/upload-image', protect, isAdmin, async (req, res) => {
  try {
    const { data } = req.body; // base64 data URI
    
    // Extract format and raw base64 data
    const matches = data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ message: 'Invalid image format or corrupted base64' });
    }
    
    const ext = matches[1];
    const imageBuffer = Buffer.from(matches[2], 'base64');
    const filename = `km_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext === 'jpeg' ? 'jpg' : ext}`;
    
    const fs = require('fs');
    const path = require('path');
    const uploadPath = path.join(__dirname, '../uploads', filename);
    
    // Ensure the array of bytes is written securely to local disk
    fs.writeFileSync(uploadPath, imageBuffer);
    
    // Construct local URL string mapping directly to the DB
    const url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    
    res.json({ url, publicId: filename });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
