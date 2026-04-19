/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  color: { type: String, trim: true },
  size: { type: String, trim: true },   // e.g. Small, Medium, Large, XL
  material: { type: String, trim: true } // e.g. Pashmina, Wool, Silk, Cotton
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, min: 0 }, // original MRP for showing discount
  images: [{ type: String }], // Cloudinary URLs
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  variants: [variantSchema],
  stock: { type: Number, required: true, default: 0, min: 0 },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  weight: { type: Number, default: 0 }, // grams — for shipping calc
  tags: [{ type: String }]
}, { timestamps: true });

// Text search index
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
