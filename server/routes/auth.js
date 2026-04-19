/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');
const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    res.status(201).json({ user, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ user, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Saadat Shawl House'} <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  await transporter.sendMail(message);
};

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    // Generate 6-digit OTP
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store simple hash or just the token since it's short lived
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save({ validateBeforeSave: false });

    try {
      const htmlMsg = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #eaeaea; padding: 40px; border-radius: 12px; background: #fff;">
          <h2 style="color: #8B1A1A; text-align: center; font-size: 24px; margin-bottom: 20px;">Saadat Shawl House</h2>
          <h3 style="color: #222; text-align: center; margin-bottom: 30px;">Your Password Reset OTP</h3>
          <p style="color: #555; text-align: center; line-height: 1.6; font-size: 15px;">Use the following 6-digit code to reset your password. This code will expire in 10 minutes.</p>
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; background-color: #f8f9fa; border: 2px dashed #8B1A1A; color: #8B1A1A; padding: 16px 32px; font-size: 32px; font-weight: 800; letter-spacing: 8px; border-radius: 8px;">
              ${resetToken}
            </div>
          </div>
          <p style="font-size: 13px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">If you didn't request a password reset, please ignore this email.</p>
        </div>
      `;
      
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await sendEmail({ email: user.email, subject: 'Your Verification Code - Saadat Shawl House', html: htmlMsg });
        res.json({ message: 'OTP sent to your email' });
      } else {
        console.log(`\x1b[33m[SERVER] OTP for ${user.email} is: ${resetToken}\x1b[0m`);
        res.json({ message: 'OTP printed to terminal.' });
      }
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email could not be sent. Check your SMTP setup.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { password, token } = req.body;
    
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({ 
      resetPasswordToken, 
      resetPasswordExpire: { $gt: Date.now() } 
    });
    
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });
    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    res.json({ message: 'Password reset completely successful!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
