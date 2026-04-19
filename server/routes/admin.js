/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ShippingZone = require('../models/ShippingZone');
const protect = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// GET /api/admin/stats
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const [totalOrders, totalRevenue, totalProducts, totalUsers, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ isAdmin: false }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email')
    ]);

    res.json({
      totalOrders,
      revenue: totalRevenue[0]?.total || 0,
      totalProducts,
      totalUsers,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders
router.get('/orders', protect, isAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);

    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/orders/:id
router.put('/orders/:id', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/shipping-zones
router.get('/shipping-zones', protect, isAdmin, async (req, res) => {
  try {
    const zones = await ShippingZone.find().sort({ name: 1 });
    res.json({ zones });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/shipping-zones
router.post('/shipping-zones', protect, isAdmin, async (req, res) => {
  try {
    const zone = await ShippingZone.create(req.body);
    res.status(201).json({ zone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/shipping-zones/:id
router.put('/shipping-zones/:id', protect, isAdmin, async (req, res) => {
  try {
    const zone = await ShippingZone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ zone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/shipping-zones/:id
router.delete('/shipping-zones/:id', protect, isAdmin, async (req, res) => {
  try {
    await ShippingZone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Zone deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
