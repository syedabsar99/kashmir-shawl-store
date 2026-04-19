/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

const express = require('express');
const Page = require('../models/Page');
const protect = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// GET /api/pages (Public)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.showInFooter) filter.showInFooter = req.query.showInFooter === 'true';
    const pages = await Page.find(filter).sort({ title: 1 });
    res.json({ pages });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/pages/:slug (Public)
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json({ page });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/pages (Admin)
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    req.body.slug = req.body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const page = await Page.create(req.body);
    res.status(201).json({ page });
  } catch (err) { 
    if (err.code === 11000) return res.status(400).json({ message: 'A page with that title already exists! Please pick a different title.' });
    res.status(500).json({ message: err.message }); 
  }
});

// PUT /api/pages/:id (Admin)
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    if (req.body.title) {
       req.body.slug = req.body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json({ page });
  } catch (err) { 
    if (err.code === 11000) return res.status(400).json({ message: 'A page with that title already exists! Please pick a different title.' });
    res.status(500).json({ message: err.message }); 
  }
});

// DELETE /api/pages/:id (Admin)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json({ message: 'Page deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
