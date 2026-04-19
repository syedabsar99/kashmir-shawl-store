/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

const mongoose = require('mongoose');

const shippingZoneSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // e.g. "Kashmir Valley", "Metro Cities"
  pincodes: [{ type: String }],                        // array of pincode prefixes or full pincodes
  rate: { type: Number, required: true, default: 0 }, // shipping cost in INR
  estimatedDays: { type: String, default: '5-7 business days' },
  isFree: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ShippingZone', shippingZoneSchema);
