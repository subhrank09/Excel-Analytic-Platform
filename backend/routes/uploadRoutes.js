// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/authController');
const chartController = require('../controllers/chartController');

// Correct imports of multer configs
const { profilePicUpload, excelUpload } = require('../middleware/upload');

// Profile picture upload
router.post('/profile/upload-pic', auth, profilePicUpload, controller.uploadProfilePic);

// Excel file upload
router.post('/upload', auth, excelUpload, controller.uploadExcel);

// Generate chart from Excel file
router.get('/files/:id/generate-chart', auth, chartController.generateChart);

// List files
router.get('/files', auth, controller.listExcelFiles);

// Download Excel file
router.get('/files/:id/download', auth, controller.downloadExcelFile);

// Search Excel files
router.get('/search', auth, controller.searchExcelFiles);

module.exports = router;
