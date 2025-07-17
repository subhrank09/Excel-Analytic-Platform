// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: { 
//     type: String, 
//     unique: true, 
//     required: true,
//     lowercase: true,
//     trim: true,
//     match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
//   },
//   password: {
//     type: String,
//     minlength: [8, 'Password must be at least 8 characters long'],
//     select: false
//   },
//   role: { 
//     type: String, 
//     enum: ['user', 'admin'], 
//     default: 'user' 
//   },
//   // isVerified: {
//   //   type: Boolean,
//   //   default: false,
//   // },
//   // verifyTokenExpires: {
//   //   type: Date,
//   // },
//   // New fields for social login
//   provider: {
//     type: String, // e.g., 'google', 'facebook', 'local'
//     default: 'local'
//   },
//   providerId: {
//     type: String, // OAuth provider user ID
//     default: null
//   },
//   profilePic: {
//     type: String, // URL of user's profile picture from provider
//     default: null
//   },
// }, {
//   timestamps: true
// });

// // Hash password before save only if password is modified and provider is 'local'
// userSchema.pre('save', async function (next) {
//   console.log('Pre-save hook triggered');
//   console.log('Password modified:', this.isModified('password'));
//   if (this.provider !== 'local') return next(); // Skip hashing for social users
//   if (!this.isModified('password')) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Instance method to compare password for local users
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   if (this.provider !== 'local') {
//     throw new Error('Password comparison not supported for social login users');
//   }
//   return bcrypt.compare(candidatePassword, this.password);
// };

// const User = mongoose.model('User', userSchema);
// module.exports = User; // ✅ Correct export


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    index: true
  },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
    required: function() { return this.provider === 'local'; }
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  provider: {
    type: String, // e.g., 'google', 'facebook', 'local'
    default: 'local'
  },
  providerId: {
    type: String, // OAuth provider user ID
    default: null
  },
  profilePic: {
    type: String, // URL of user's profile picture from provider
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before save only if password is modified and provider is 'local'
userSchema.pre('save', async function (next) {
  if (this.provider !== 'local') return next(); // Skip hashing for social users
  if (!this.isModified('password')) return next();
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password for local users
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (this.provider !== 'local') return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
