/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const isAdmin = require('../middleware/isAdmin');
const protect = require('../middleware/auth');

// POST /api/messages - Public endpoint for submitting the contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages - Admin endpoint to fetch all inbox messages
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/messages/:id/read - Admin endpoint to mark complete
router.put('/:id/read', protect, isAdmin, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    msg.isRead = !msg.isRead;
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/messages/:id - Admin endpoint to delete message
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
