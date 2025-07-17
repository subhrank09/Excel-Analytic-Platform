const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const ExcelRecord = require('../models/ExcelRecord');
const mongoose = require('mongoose');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');


// REGISTER FUNCTION
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  
  // Get admin emails from environment variable
  const adminEmails = process.env.ADMIN_EMAILS 
    ? process.env.ADMIN_EMAILS.split(',') 
    : [];
  
  // Trim and lowercase all emails for case-insensitive matching
  const normalizedAdminEmails = adminEmails.map(e => e.trim().toLowerCase());
  const normalizedEmail = email.trim().toLowerCase();
  
  // Check if user should be admin
  const isAdmin = normalizedAdminEmails.includes(normalizedEmail);
  const role = isAdmin ? 'admin' : 'user';

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({ 
      name, 
      email: normalizedEmail, 
      password, 
      role  // Set role based on email check
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      role,
      isAdmin
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//EMAIL VERIFICATION
// exports.verifyEmail = async (req, res) => {
//   try {
//     const token = req.params.token;
//     if (!token) {
//       return res.status(400).json({ error: 'Missing token' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(400).json({ error: 'Invalid or expired token' });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ error: 'Email already verified' });
//     }

//     user.isVerified = true;
//     await user.save();

//     res.json({ message: 'Email verified successfully' });
//   } catch (err) {
//     console.error('❌ Email verification error:', err.message);
//     return res.status(400).json({ error: 'Invalid or expired verification link' });
//   }
// };

//LOGIN FUNCTION
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(400).json({ error: 'Invalid Credentials' });
    }
    // if (!user.isVerified) {
    //   return res.status(403).json({ error: 'Please verify your email before logging in' });
    // }
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    console.log('✅ Found user:', user.email);
    console.log('🔐 Stored hashed password:', user.password);
    console.log('🔑 Entered password:', password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔍 Password match result:', isMatch);

    if (!isMatch) return res.status(400).json({ error: 'Invalid Password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token, role: user.role, name: user.name, email: user.email });
  } catch (err) {
    console.error('🔥 Login error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// FORGOT PASSWORD FUNCTION
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `http://localhost:3000/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ error: "Error sending email", details: err.message });
  }
};

//RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ error: 'User not found' });

    // const hashedPassword = await bcrypt.hash(password, 8); // ✅ hash the new password
    // user.password = hashedPassword;
    // await user.save();

    // ✅ Do this instead
user.password = password; // Set plain text password
await user.save(); // Let model's pre-save hook handle hashing

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};

// Upload Excel file
exports.uploadExcel = async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const newFile = new ExcelFile({
      originalName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      data: file.buffer,
    });

    await newFile.save();
    res.status(201).json({ message: 'File uploaded successfully', fileId: newFile._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while uploading file' });
  }
};


// Get Excel file by ID
exports.getExcelFile = async (req, res) => {
  try {
    const file = await ExcelFile.findById(req.params.id);

    if (!file) return res.status(404).json({ error: 'File not found' });

    res.set({
      'Content-Type': file.fileType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
    });

    res.send(file.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching file' });
  }
};

//LISTING OF FILES
exports.listExcelFiles = async (req, res) => {
  try {
    const files = await ExcelRecord.find({ user: req.user.id })
      .select('filename createdAt')
      .sort({ createdAt: -1 });

    res.json({ files });
  } catch (err) {
    console.error('List Error:', err);
    res.status(500).json({ error: 'Server error while fetching files' });
  }
};


//Download Excel File by ID
exports.downloadExcelFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    const fileRecord = await ExcelRecord.findById(id);
    if (!fileRecord || fileRecord.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    const ws = xlsx.utils.json_to_sheet(fileRecord.data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    const tempPath = `temp_${Date.now()}.xlsx`;
    xlsx.writeFile(wb, tempPath);

    res.download(tempPath, fileRecord.filename, (err) => {
      fs.unlinkSync(tempPath); // cleanup
      if (err) console.error('Download error:', err);
    });
  } catch (err) {
    console.error('Download Error:', err);
    res.status(500).json({ error: 'Server error while downloading the file' });
  }
};

// Filter/Search Excel Files by Filename or Date
exports.searchExcelFiles = async (req, res) => {
  const { filename, startDate, endDate } = req.query;
  const query = { user: req.user.id };

  if (filename) {
    query.filename = { $regex: filename, $options: 'i' }; // case-insensitive partial match
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  try {
    const results = await ExcelRecord.find(query)
      .select('filename createdAt')
      .sort({ createdAt: -1 });

    res.json({ results });
  } catch (err) {
    console.error('Search Error:', err);
    res.status(500).json({ error: 'Server error during search' });
  }
};
// Delete user by ID (admin or user themselves)
exports.deleteUserByEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is local (has password)
    if (user.provider && user.provider !== 'local') {
      return res.status(400).json({ error: 'Cannot delete social login user with password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Delete user
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
//2-FACTOR AUTHENTICATION
exports.generate2FASecret = async (req, res) => {
  try {
    const user = req.user; // assuming user is authenticated and attached to req

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `YourAppName (${user.email})`
    });

    // Save secret temporarily or permanently to user profile (but not enable 2FA yet)
    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate QR code data URL
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({
      message: '2FA secret generated',
      qrCodeUrl,
      secret: secret.base32 // optionally send secret for manual entry
    });
  } catch (error) {
    console.error('2FA secret generation error:', error);
    res.status(500).json({ error: 'Failed to generate 2FA secret' });
  }
};

//VERIFY 2-FACTOR AUTHENTICATION
exports.verify2FAToken = async (req, res) => {
  try {
    const user = req.user;
    const { token } = req.body;

    if (!user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA secret not set up' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1 // allow 1 step before and after
    });

    if (!verified) {
      return res.status(400).json({ error: 'Invalid 2FA token' });
    }

    // Enable 2FA for user
    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Failed to verify 2FA token' });
  }
};

//uploading Profile Picture
exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = req.user; // Assuming auth middleware sets req.user
    user.profilePic = req.file.filename; // Save filename to user profile
    await user.save();

    res.json({ message: 'Profile picture uploaded successfully', profilePic: req.file.filename });
  } catch (error) {
    console.error('Upload profile pic error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};
//ADMIN LOGIN
// In adminController.js - adminLogin function
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Admin login attempt for:', email); // Debug log
    
    // First, check if user exists (any role)
    const userExists = await User.findOne({ email: email.toLowerCase() });
    console.log('User exists:', userExists ? 'Yes' : 'No'); // Debug log
    
    if (userExists) {
      console.log('User role:', userExists.role); // Debug log
    }
    
    // Check admin user with role
    const admin = await User.findOne({ 
      email: email.toLowerCase(), 
      role: 'admin' 
    }).select('+password');
    
    console.log('Admin found:', admin ? 'Yes' : 'No'); // Debug log
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    console.log('Password match:', isMatch); // Debug log
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error); // Debug log
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// //NEW ONES
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

// // Configure your SMTP transporter
// const transporter = nodemailer.createTransport({
//   // Use your SMTP credentials here
//   service: 'gmail',
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // Helper: Send email
// async function sendMail(to, subject, html) {
//   await transporter.sendMail({
//     from: process.env.SMTP_EMAIL,
//     to,
//     subject,
//     html,
//   });
// }

// // REGISTER
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user exists
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ error: 'Email already registered' });

//     // Create user (password will be hashed by pre-save hook)
//     const user = new User({ name, email, password });
//     await user.save();

//     // Generate verification token
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '15m' }
//     );

//     // Send verification email
//     const link = `http://localhost:5000/api/auth/verify-email/${token}`;
//     await sendMail(
//       user.email,
//       'Verify your email',
//       `<p>Click <a href="${link}">here</a> to verify your email.</p>`
//     );

//     res.json({ message: 'Registration successful. Check your email to verify your account.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // VERIFY EMAIL
// exports.verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(400).json({ error: 'Invalid token' });

//     if (user.isVerified) return res.json({ message: 'Email already verified.' });

//     user.isVerified = true;
//     await user.save();

//     res.json({ message: 'Email verified successfully. You can now log in.' });
//   } catch (err) {
//     res.status(400).json({ error: 'Invalid or expired token' });
//   }
// };

// // LOGIN
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // Always select password explicitly
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) return res.status(400).json({ error: 'Invalid Credentials' });
//     if (!user.isVerified) return res.status(403).json({ error: 'Please verify your email before logging in' });

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid Password' });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET
//     );

//     res.json({ token, role: user.role, name: user.name, email: user.email });
//   } catch (err) {
//     res.status(500).json({ error: 'Server Error' });
//   }
// };

// // FORGOT PASSWORD
// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: 'User not found' });

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '15m' }
//     );

//     const link = `http://localhost:5000/api/auth/reset-password/${token}`;
//     await sendMail(
//       user.email,
//       'Reset your password',
//       `<p>Click <a href="${link}">here</a> to reset your password.</p>`
//     );

//     res.json({ message: 'Password reset link sent to your email.' });
//   } catch (err) {
//     res.status(500).json({ error: 'Server Error' });
//   }
// };

// // RESET PASSWORD
// exports.resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(400).json({ error: 'User not found' });

//     // Set plain password, pre-save hook will hash it
//     user.password = password;
//     await user.save();

//     res.json({ message: 'Password reset successful' });
//   } catch (err) {
//     res.status(400).json({ error: 'Invalid or expired token' });
//   }
// };
