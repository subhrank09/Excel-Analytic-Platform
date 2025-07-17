const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Controllers
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  deleteUserByEmailAndPassword
} = require('../controllers/authController');

// Rate limiter: max 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

router.use(limiter);

// ======== OAuth ========

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: req.user });
    } catch (error) {
      console.error('JWT generation error:', error);
      res.status(500).json({ error: 'Failed to generate token' });
    }
  }
);

// Facebook OAuth login
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook OAuth callback
router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: req.user });
  }
);

// ======== Core Auth Routes ========

// Email verification
// router.get('/api/auth/verify-email/:token', verifyEmail);

// Registration route — ✅ FIXED HERE
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Pass control to register handler
  },
  register
);

// Login
router.post('/login', login);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

// Delete user by credentials
router.delete('/delete-by-credentials', deleteUserByEmailAndPassword);

module.exports = router;
