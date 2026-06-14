/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

const express = require('express');
const cloudinary = require('cloudinary').v2;
const Settings = require('../models/Settings');
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

const normalizeSettings = (settings, req) => {
  if (!settings) return settings;
  const doc = settings.toObject ? settings.toObject() : JSON.parse(JSON.stringify(settings));
  
  if (doc.logoUrl) doc.logoUrl = normalizeUrl(doc.logoUrl, req);
  if (doc.faviconUrl) doc.faviconUrl = normalizeUrl(doc.faviconUrl, req);
  
  if (doc.banners && Array.isArray(doc.banners)) {
    doc.banners = doc.banners.map(banner => ({
      ...banner,
      image: normalizeUrl(banner.image, req),
      mobileImage: normalizeUrl(banner.mobileImage, req)
    }));
  }
  return doc;
};

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    if (process.env.MOCK_DB === 'true') {
      const mock = require('../mockStore');
      return res.json(normalizeSettings(mock.storeSettings, req));
    }
    const settings = await Settings.findOne() || await Settings.create({});
    res.json(normalizeSettings(settings, req));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/settings - Update settings
router.put('/', protect, isAdmin, async (req, res) => {
  try {
    const { logoUrlMask, ...otherData } = req.body;
    let finalLogoUrl = otherData.logoUrl;
    let finalFaviconUrl = otherData.faviconUrl;

    const fs = require('fs');
    const path = require('path');

    // Helper to process base64
    const processBase64 = (base64Data, prefix) => {
      const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) return null;
      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const imageBuffer = Buffer.from(matches[2], 'base64');
      const filename = `${prefix}_${Date.now()}_${Math.floor(Math.random()*1000)}.${ext}`;
      fs.writeFileSync(path.join(__dirname, '../uploads', filename), imageBuffer);
      return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    };

    // Handle new Logo upload
    if (finalLogoUrl && finalLogoUrl.startsWith('data:image')) {
      const localUrl = processBase64(finalLogoUrl, 'logo');
      if (localUrl) finalLogoUrl = localUrl;
    }

    // Handle new Favicon upload
    if (finalFaviconUrl && finalFaviconUrl.startsWith('data:image')) {
      const localUrl = processBase64(finalFaviconUrl, 'favicon');
      if (localUrl) finalFaviconUrl = localUrl;
    }

    // Handle banners uploads
    if (otherData.banners && Array.isArray(otherData.banners)) {
      for (const banner of otherData.banners) {
        if (banner.image && banner.image.startsWith('data:image')) {
          const localUrl = processBase64(banner.image, 'banner');
          if (localUrl) banner.image = localUrl;
        }
        if (banner.mobileImage && banner.mobileImage.startsWith('data:image')) {
          const localUrl = processBase64(banner.mobileImage, 'banner_m');
          if (localUrl) banner.mobileImage = localUrl;
        }
      }
    }

    if (process.env.MOCK_DB === 'true') {
      const mock = require('../mockStore');
      const updated = mock.updateSettings({ ...otherData, logoUrl: finalLogoUrl, faviconUrl: finalFaviconUrl });
      return res.json(normalizeSettings(updated, req));
    }

    const settings = await Settings.findOne() || new Settings();
    Object.assign(settings, { ...otherData, logoUrl: finalLogoUrl, faviconUrl: finalFaviconUrl });
    await settings.save();
    
    res.json(normalizeSettings(settings, req));
  } catch (err) {
    console.error('🚨 SERVER ERROR (Settings):', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
