/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

const express = require('express');
const cloudinary = require('cloudinary').v2;
const Category = require('../models/Category');
const protect = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent', 'name')
      .sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper for Cloudinary upload
const uploadToCloudinary = async (image) => {
  if (image && image.startsWith('data:image')) {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'kashur-mart/categories',
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
    });
    return result.secure_url;
  }
  return image;
};

// POST /api/categories — admin
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    let { name, description, image, parent, showInNavbar } = req.body;
    
    // Handle image upload
    image = await uploadToCloudinary(image);

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const category = await Category.create({ 
      name, 
      slug, 
      description, 
      image,
      parent: parent || null,
      showInNavbar: showInNavbar !== undefined ? showInNavbar : true
    });
    res.status(201).json({ category });
  } catch (err) {
    console.error('🚨 Category Create Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/categories/:id — admin
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload
    if (updateData.image) {
      updateData.image = await uploadToCloudinary(updateData.image);
    }

    if (updateData.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('parent', 'name');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ category });
  } catch (err) {
    console.error('🚨 Category Update Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/categories/:id — admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
