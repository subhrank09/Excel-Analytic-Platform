// // backend/controllers/adminController.js
// const User = require('../models/User');
// const Analytics = require('../models/Analytics');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const ExcelRecord = require('../models/ExcelRecord')

// // --- Admin Authentication ---
// exports.adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Both email and password are required' });
//     }
//     const normalizedEmail = email.toLowerCase().trim();
//     const admin = await User.findOne({ email: normalizedEmail, role: 'admin' }).select('+password');
//     if (!admin) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign(
//       { id: admin._id, role: admin.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );
//     res.status(200).json({
//       token,
//       user: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         role: admin.role
//       }
//     });
//   } catch (error) {
//     console.error('[Admin Login Error]', error);
//     res.status(500).json({ message: 'Login failed', error: error.message || 'Internal server error' });
//   }
// };

// // --- Admin Dashboard Statistics ---
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const activeUsers = await User.countDocuments({ status: 'active' });
//     const analyticsData = await Analytics.find().sort({ createdAt: -1 }).limit(10);
//     res.status(200).json({
//       totalUsers,
//       activeUsers,
//       recentActivity: analyticsData
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // --- User Management ---
// exports.getAllUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const users = await User.find()
//       .select('-password')
//       .skip(skip)
//       .limit(limit);
//     const totalUsers = await User.countDocuments();
//     res.status(200).json({
//       users,
//       currentPage: page,
//       totalPages: Math.ceil(totalUsers / limit),
//       totalUsers
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch users', error: error.message });
//   }
// };

// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// exports.updateUser = async (req, res) => {
//   try {
//     const { name, email, role, status } = req.body;
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     if (req.user.id === user.id && role === 'user' && user.role === 'admin') {
//       return res.status(400).json({ message: 'Cannot demote yourself from admin to user.' });
//     }
//     user.name = name || user.name;
//     user.email = email || user.email;
//     user.role = role || user.role;
//     user.status = status || user.status;
//     const updatedUser = await user.save();
//     res.status(200).json({
//       message: 'User updated successfully',
//       user: {
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         role: updatedUser.role,
//         status: updatedUser.status
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Update failed', error: error.message });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     if (req.user.id === user.id) {
//       return res.status(400).json({ message: 'Cannot delete your own account.' });
//     }
//     if (user.role === 'admin') {
//       const adminCount = await User.countDocuments({ role: 'admin' });
//       if (adminCount <= 1) {
//         return res.status(400).json({ message: 'Cannot delete the only remaining admin.' });
//       }
//     }
//     await user.deleteOne();
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Deletion failed', error: error.message });
//   }
// };

// // --- Analytics Management ---
// exports.getPlatformAnalytics = async (req, res) => {
//   try {
//     const analytics = await Analytics.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalUploads: { $sum: '$fileCount' },
//           totalUsers: { $addToSet: '$userId' }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           totalUploads: 1,
//           activeUsers: { $size: '$totalUsers' }
//         }
//       }
//     ]);
//     res.status(200).json(analytics[0] || { totalUploads: 0, activeUsers: 0 });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to get analytics', error: error.message });
//   }
// };

// // --- Uploads (Unified to ExcelFile/ExcelRecord) ---

// // Upload a file (admin or user)
// // exports.uploadExcelFile = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: 'No file uploaded' });
// //     }
// //     const newFile = new ExcelFile({
// //       metadata: {
// //         originalName: req.file.originalname,
// //         fileType: req.file.mimetype,
// //         fileSize: req.file.size,
// //         userId: req.user._id,
// //         userEmail: req.user.email
// //       },
// //       data: req.file.buffer,
// //     });
// //     await newFile.save();
// //     res.status(201).json({ message: 'File uploaded successfully', fileId: newFile._id });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Upload failed', error: error.message });
// //   }
// // };

// // For admin: get all uploads
// // exports.getUploadHistory = async (req, res) => {
// //   try {
// //     const files = await ExcelFile.find().sort({ createdAt: -1 });
// //     res.json({ uploads: files });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Failed to fetch uploads', error: error.message });
// //   }
// // };
// exports.getUploadHistory = async (req, res) => {
//   try {
//     const files = await ExcelRecord.find().sort({ uploadDate: -1 }).allowDiskUse(true);
//     res.json({ uploads: files });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch uploads', error: err.message });
//   }
// };

// // For user: get only their uploads
// // exports.getUserUploads = async (req, res) => {
// //   try {
// //     const files = await ExcelFile.find({ 'metadata.userId': req.user._id }).sort({ createdAt: -1 });
// //     res.json({ uploads: files });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Failed to fetch uploads', error: error.message });
// //   }
// // };
// exports.getUserUploads = async (req, res) => {
//   try {
//     const files = await ExcelRecord.find({ 'metadata.userId': req.user._id }).sort({ uploadDate: -1 });
//     res.json({ uploads: files });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch uploads', error: err.message });
//   }
// };

// // --- Insights ---
// exports.getInsights = async (req, res) => {
//   res.json({
//     insights: [
//       { title: "Trend", description: "Revenue peaked in Q2 and dropped slightly in Q4." },
//       { title: "Risk Alert", description: "Customer churn increased by 12% over 3 months." },
//       { title: "Opportunity", description: 'Products in category "X" have higher margins.' }
//     ]
//   });
// };

const User = require('../models/User');
const Analytics = require('../models/Analytics');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ExcelRecord = require('../models/ExcelRecord');

// --- Admin Authentication ---
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Both email and password are required' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const admin = await User.findOne({ email: normalizedEmail, role: 'admin' }).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('[Admin Login Error]', error);
    res.status(500).json({ message: 'Login failed', error: error.message || 'Internal server error' });
  }
};

// --- Admin Dashboard Statistics ---
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const analyticsData = await Analytics.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({
      totalUsers,
      activeUsers,
      recentActivity: analyticsData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- User Management ---
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit);
    const totalUsers = await User.countDocuments();
    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.user.id === user.id && role === 'user' && user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot demote yourself from admin to user.' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;
    const updatedUser = await user.save();
    res.status(200).json({
      message: 'User updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.user.id === user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account.' });
    }
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the only remaining admin.' });
      }
    }
    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
};

// --- Analytics Management ---
exports.getPlatformAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.aggregate([
      {
        $group: {
          _id: null,
          totalUploads: { $sum: '$fileCount' },
          totalUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          _id: 0,
          totalUploads: 1,
          activeUsers: { $size: '$totalUsers' }
        }
      }
    ]);
    res.status(200).json(analytics[0] || { totalUploads: 0, activeUsers: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get analytics', error: error.message });
  }
};

// --- Uploads (Unified to ExcelRecord) ---

// For admin: get all uploads (Upload History)
// exports.getUploadHistory = async (req, res) => {
//   try {
//     const files = await ExcelRecord.find()
//       .sort({ createdAt: -1 })
//       .allowDiskUse()
//       .toArray();
//     res.json({ uploads: files });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch uploads', error: err.message });
//   }
// };
//PAGINATION
exports.getUploadHistory = async (req, res) => {
  try {
    // Get page and limit from query, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // Fetch paginated results
    const files = await ExcelRecord.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const total = await ExcelRecord.countDocuments();

    res.json({
      uploads: files,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error('getUploadHistory error:', err);
    res.status(500).json({ message: 'Failed to fetch uploads', error: err.message });
  }
};

// For user: get only their uploads
exports.getUserUploads = async (req, res) => {
  try {
    const files = await ExcelRecord.find({ 'metadata.userId': req.user._id })
      .sort({ createdAt: -1 })
      .allowDiskUse(true);
    res.json({ uploads: files });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch uploads', error: err.message });
  }
};

// --- Insights ---
exports.getInsights = async (req, res) => {
  res.json({
    insights: [
      { title: "Trend", description: "Revenue peaked in Q2 and dropped slightly in Q4." },
      { title: "Risk Alert", description: "Customer churn increased by 12% over 3 months." },
      { title: "Opportunity", description: 'Products in category "X" have higher margins.' }
    ]
  });
};
