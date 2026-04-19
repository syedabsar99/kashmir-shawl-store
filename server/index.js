require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow cross-origin images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' })); // 10mb for base64 image uploads

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rate limiting disabled by user request (Infinite max)
// const limiter = rateLimit({ ... });
// app.use('/api/', limiter);

// Routes
if (process.env.MOCK_DB === 'true') {
  console.log('⚠️  RUNNING IN MOCK MODE (In-memory storage)');
  const mock = require('./mockStore');
  
  app.get('/api/categories', (req, res) => res.json({ categories: mock.categories }));
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === mock.mockUser.email && password === mock.mockUser.password) {
      return res.json({
        user: mock.mockUser,
        token: 'mock-jwt-token-12345'
      });
    }
    res.status(401).json({ message: 'Invalid mock credentials' });
  });

  app.put('/api/auth/profile', (req, res) => {
    const updated = mock.updateMockUser(req.body);
    res.json({ user: updated, message: 'Profile updated in mock mode!' });
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (email === mock.mockUser.email) {
      const token = Math.random().toString(36).substring(7);
      mock.mockResetTokens[token] = email;
      console.log(`\x1b[33m[Mock Server] Password reset link generated: http://localhost:5173/reset-password/${token}\x1b[0m`);
      return res.json({ message: 'Password reset link sent to registered email (Mock: Check console)' });
    }
    res.status(404).json({ message: 'Email not found' });
  });

  app.post('/api/auth/reset-password', (req, res) => {
    const { token, password } = req.body;
    const email = mock.mockResetTokens[token];
    if (email && email === mock.mockUser.email) {
      mock.updateMockUser({ password });
      delete mock.mockResetTokens[token];
      return res.json({ message: 'Password reset successful!' });
    }
    res.status(400).json({ message: 'Invalid or expired token' });
  });

  app.post('/api/categories', (req, res) => {
    const cat = mock.addCategory(req.body);
    res.status(201).json({ category: cat });
  });
  app.put('/api/categories/:id', (req, res) => {
    const cat = mock.updateCategory(req.params.id, req.body);
    res.json({ category: cat });
  });
  app.delete('/api/categories/:id', (req, res) => {
    mock.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted' });
  });

  app.get('/api/products', (req, res) => {
    let filtered = [...mock.products];
    if (req.query.category) {
      filtered = filtered.filter(p => p.category._id === req.query.category);
    }
    res.json({ products: filtered, total: filtered.length, pages: 1 });
  });
  app.get('/api/products/featured', (req, res) => {
    res.json({ products: mock.products.filter(p => p.isFeatured) });
  });
  app.get('/api/products/:slug', (req, res) => {
    const product = mock.products.find(p => p.slug === req.params.slug);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  });
  app.post('/api/products/upload-image', (req, res) => {
    res.json({ url: 'https://placehold.co/800x1000/3D2B1F/C4972A?text=Uploaded+Image', publicId: 'mock_id' });
  });
  app.post('/api/products', (req, res) => {
    const prod = mock.addProduct(req.body);
    res.status(201).json({ product: prod });
  });
  app.put('/api/products/:id', (req, res) => {
    const prod = mock.updateProduct(req.params.id, req.body);
    res.json({ product: prod });
  });
  app.delete('/api/products/:id', (req, res) => {
    mock.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted' });
  });

  app.get('/api/admin/stats', (req, res) => res.json({
    revenue: 12500, totalOrders: mock.orders.length, totalProducts: mock.products.length, totalUsers: 1,
    recentOrders: mock.orders.slice(-5).reverse()
  }));

  // Shipping Zones
  app.get('/api/admin/shipping-zones', (req, res) => res.json({ zones: mock.shippingZones }));
  app.post('/api/admin/shipping-zones', (req, res) => {
    const zone = mock.addShippingZone(req.body);
    res.status(201).json({ zone });
  });
  app.put('/api/admin/shipping-zones/:id', (req, res) => {
    const zone = mock.updateShippingZone(req.params.id, req.body);
    res.json({ zone });
  });
  app.delete('/api/admin/shipping-zones/:id', (req, res) => {
    mock.deleteShippingZone(req.params.id);
    res.json({ message: 'Zone deleted' });
  });

  // Orders & Shipping Rates
  app.post('/api/orders/shipping-rate', (req, res) => {
    const { pincode } = req.body;
    const zone = mock.shippingZones.find(z => 
      z.pincodes.some(p => pincode.startsWith(p))
    ) || { name: 'Standard Shipping', rate: 150, estimatedDays: '5-9 business days' };
    res.json(zone);
  });

  app.post('/api/orders/create', (req, res) => {
    const payload = { ...req.body };
    payload.totalAmount = (payload.itemsTotal || 0) + (payload.shippingCost || 0);
    const order = mock.addOrder(payload);
    res.status(201).json({ 
      order, 
      key: 'rzp_test_mock', 
      razorpayOrderId: `order_mock_${Date.now()}` 
    });
  });

  app.post('/api/orders/verify', (req, res) => res.json({ status: 'success' }));
  
  app.get('/api/orders/mine', (req, res) => res.json({ orders: mock.orders }));
  app.get('/api/orders/:id', (req, res) => {
    const order = mock.orders.find(o => o._id === req.params.id);
    res.json({ order });
  });

  app.get('/api/admin/orders', (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    let filtered = [...mock.orders].reverse();
    if (status) filtered = filtered.filter(o => o.status === status);
    
    const start = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(start, start + Number(limit));
    
    res.json({ 
      orders: paginated, 
      total: filtered.length, 
      pages: Math.ceil(filtered.length / Number(limit)) 
    });
  });

  app.get('/api/admin/stats', (req, res) => {
    const revenue = mock.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    res.json({
      revenue,
      totalOrders: mock.orders.length,
      recentOrders: [...mock.orders].reverse().slice(0, 5),
      totalProducts: mock.products.length,
      totalUsers: 14 // Mock constant for now
    });
  });

  app.put('/api/admin/orders/:id', (req, res) => {
    const order = mock.updateOrder(req.params.id, req.body);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  });

  // Messages Mock
  app.get('/api/messages', (req, res) => res.json({ messages: mock.messages }));
  app.post('/api/messages', (req, res) => {
    const msg = mock.addMessage(req.body);
    res.status(201).json({ message: 'Message sent successfully.', msg });
  });
  app.put('/api/messages/:id/read', (req, res) => {
    const msg = mock.updateMessageRead(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  });
  app.delete('/api/messages/:id', (req, res) => {
    mock.deleteMessage(req.params.id);
    res.json({ message: 'Message deleted' });
  });
}

// Global Routes (handle both Mock & Real)
app.use('/api/settings', require('./routes/settings'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/messages', require('./routes/messages'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect DB & start server
const PORT = process.env.PORT || 5000;

if (process.env.MOCK_DB === 'true') {
  app.listen(PORT, () => console.log(`🚀 Mock Server running on port ${PORT}`));
} else {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('⚠️  Server running WITHOUT database connection.');
    });

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
