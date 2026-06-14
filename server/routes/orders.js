/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

const express = require('express');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ShippingZone = require('../models/ShippingZone');
const protect = require('../middleware/auth');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// POST /api/orders/shipping-rate — get shipping cost for pincode
router.post('/shipping-rate', async (req, res) => {
  try {
    const { pincode } = req.body;
    const zones = await ShippingZone.find();
    const matched = zones.find(z => z.pincodes.some(p => pincode.startsWith(p)));
    if (!matched) {
      return res.json({ rate: 150, zone: 'Standard Delivery', estimatedDays: '7-10 business days' });
    }
    res.json({ rate: matched.isFree ? 0 : matched.rate, zone: matched.name, estimatedDays: matched.estimatedDays });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders/create
router.post('/create', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, shippingCost, itemsTotal } = req.body;

    // Validate product IDs and check existence
    for (const item of items) {
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({
          message: 'Your cart contains invalid or outdated products. Please clear your cart and add the items again.'
        });
      }
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(400).json({
          message: `Product "${item.name || 'Unknown Item'}" is no longer available in the store. Please remove it from your cart.`
        });
      }
    }

    const totalAmount = itemsTotal + shippingCost;

    const orderData = {
      user: req.user._id,
      items,
      shippingAddress,
      itemsTotal,
      shippingCost,
      totalAmount,
      paymentMethod
    };

    if (paymentMethod === 'razorpay') {
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // paise
        currency: 'INR',
        receipt: `km_${Date.now()}`
      });
      orderData.razorpayOrderId = rzpOrder.id;
      const order = await Order.create(orderData);
      return res.status(201).json({
        order,
        razorpayOrderId: rzpOrder.id,
        key: process.env.RAZORPAY_KEY_ID
      });
    }

    // COD
    orderData.paymentStatus = 'pending';
    orderData.status = 'confirmed';
    const order = await Order.create(orderData);
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders/verify — Razorpay payment verification
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSig !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId },
      { razorpayPaymentId, paymentStatus: 'paid', status: 'confirmed' },
      { new: true }
    );

    res.json({ order, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/mine
router.get('/mine', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images slug');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
