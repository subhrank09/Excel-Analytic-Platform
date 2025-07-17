// middleware/upload.js
const multer = require('multer');
const path = require('path');

// === Profile Picture Upload Config ===
const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/profile-pics/'),
  filename: (req, file, cb) => cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`)
});

const profilePicFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png'].includes(ext)) cb(null, true);
  else cb(new Error('Only JPG, JPEG, PNG files are allowed'), false);
};

const profilePicUpload = multer({
  storage: profilePicStorage,
  fileFilter: profilePicFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single('image');


// === Excel File Upload Config ===
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/excel-sheets/'),
  filename: (req, file, cb) => cb(null, `excel-${Date.now()}${path.extname(file.originalname)}`)
});

const excelFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.xlsx', '.xls', '.csv'].includes(ext)) cb(null, true);
  else cb(new Error('Only Excel files are allowed (.xlsx, .xls, .csv)'), false);
};

const excelUpload = multer({
  storage: excelStorage,
  fileFilter: excelFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('file');

module.exports = { profilePicUpload, excelUpload };
