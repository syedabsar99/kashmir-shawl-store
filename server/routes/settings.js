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
    let finalLegacyImage = otherData.legacyImage;

    // Allowed image types (allowlist)
    const ALLOWED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'svg+xml'];
    const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

    // Helper to upload base64 image to Cloudinary (works on Vercel's read-only FS)
    const uploadBase64ToCloudinary = async (base64Data, folder) => {
      const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) return null;

      const ext = matches[1].toLowerCase();
      if (!ALLOWED_IMAGE_TYPES.includes(ext)) {
        throw new Error(`File type '${ext}' is not allowed. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
      }

      // Validate size
      const rawBase64 = matches[2];
      const estimatedSize = Math.ceil(rawBase64.length * 3 / 4);
      if (estimatedSize > MAX_IMAGE_SIZE_BYTES) {
        throw new Error('Image exceeds maximum allowed size of 10MB');
      }

      const result = await cloudinary.uploader.upload(base64Data, {
        folder: `saadat-shawl/${folder}`,
        resource_type: 'image'
      });
      return result.secure_url;
    };

    // Create an array to hold all upload promises
    const uploadTasks = [];

    // Helper to add an upload task and assign the result back
    const queueUpload = (base64Data, folder, callback) => {
      if (base64Data && base64Data.startsWith('data:image')) {
        const task = uploadBase64ToCloudinary(base64Data, folder).then(cloudUrl => {
          if (cloudUrl) callback(cloudUrl);
        });
        uploadTasks.push(task);
      }
    };

    queueUpload(finalLogoUrl, 'logos', url => finalLogoUrl = url);
    queueUpload(finalFaviconUrl, 'favicons', url => finalFaviconUrl = url);
    queueUpload(finalLegacyImage, 'legacy', url => finalLegacyImage = url);

    // About Page Images
    if (otherData.aboutPage) {
      queueUpload(otherData.aboutPage.heroImage, 'about', url => otherData.aboutPage.heroImage = url);
      queueUpload(otherData.aboutPage.chapterImage, 'about', url => otherData.aboutPage.chapterImage = url);
    }

    // Handle banners uploads
    if (otherData.banners && Array.isArray(otherData.banners)) {
      for (const banner of otherData.banners) {
        queueUpload(banner.image, 'banners', url => banner.image = url);
        queueUpload(banner.mobileImage, 'banners', url => banner.mobileImage = url);
      }
    }

    // Wait for all uploads to complete concurrently
    await Promise.all(uploadTasks);

    if (process.env.MOCK_DB === 'true') {
      const mock = require('../mockStore');
      const updated = mock.updateSettings({ ...otherData, logoUrl: finalLogoUrl, faviconUrl: finalFaviconUrl, legacyImage: finalLegacyImage });
      return res.json(normalizeSettings(updated, req));
    }

    const settings = await Settings.findOne() || new Settings();
    Object.assign(settings, { ...otherData, logoUrl: finalLogoUrl, faviconUrl: finalFaviconUrl, legacyImage: finalLegacyImage });
    await settings.save();
    
    res.json(normalizeSettings(settings, req));
  } catch (err) {
    console.error('🚨 SERVER ERROR (Settings):', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
