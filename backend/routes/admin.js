const express = require('express');
const router = express.Router();
const User = require('../models/User');
const adminController = require('../controllers/adminController');
const excelController = require('../controllers/excelController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const multer = require('multer');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/excel-sheets');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });


// Debug login route
router.post('/debug-login', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  res.json({
    exists: !!user,
    role: user?.role,
    isAdmin: user?.role === 'admin',
    envAdmins: process.env.ADMIN_EMAILS
  });
});

// Admin authentication
router.post('/login', adminController.adminLogin);

// === Uploads ===

// Upload file (user + admin)
router.post('/uploads', auth, upload.single('file'), excelController.uploadExcelFile);

// Admin: get full upload history
router.get('/uploads', auth, isAdmin, excelController.getUploadHistory);

// User: get own uploads
router.get('/user/uploads', auth, excelController.getUserUploads);

// Protect remaining routes with auth + admin
router.use(auth, isAdmin);

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Analytics
router.get('/analytics', adminController.getPlatformAnalytics);

// Insights
router.get('/insights', adminController.getInsights);

module.exports = router;
