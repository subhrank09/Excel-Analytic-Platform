// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const excelController = require('../controllers/excelController');
// const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Example routes for Excel file operations
// router.post('/upload', auth, upload.single('file'), excelController.uploadExcelFile);
// router.get('/files', auth, excelController.listExcelFiles);
// router.get('/files/:id/download', auth, excelController.downloadExcelFile);
// router.get('/files/:id/chart', auth, excelController.generateChart);
// // Add this route to your existing routes
// router.get('/files/:id/insights', auth, excelController.generateAIInsight);

// module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const excelController = require('../controllers/excelController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', auth, upload.single('file'), excelController.uploadExcelFile);
router.get('/files', auth, excelController.listExcelFiles);
// User upload history
router.get('/files', auth, excelController.getUserUploads);
router.get('/files/:id/download', auth, excelController.downloadExcelFile);
router.get('/files/:id/chart', auth, excelController.generateChart);
router.get('/files/:id/insights', auth, excelController.generateAIInsight);
router.get('/files/search', auth, excelController.searchExcelFiles);

// NEW routes for history management:
router.delete('/files/clear', auth, excelController.clearUserFiles); // Clear all history for user
router.delete('/files/:id', auth, excelController.deleteExcelFile);  // Delete one file for user

module.exports = router;
