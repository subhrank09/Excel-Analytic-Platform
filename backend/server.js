//BACKEND MAIN FILE
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS - MUST BE FIRST!
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// 2. Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('trust proxy', 1);

// 3. Ensure upload directories exist
['uploads/profile-pics', 'uploads/excel-sheets'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 4. MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// 5. Static files
app.use('/uploads', express.static('uploads'));

// 6. Sessions and passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

// 7. Routes (AFTER middleware)
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const excelRoutes = require('./routes/excelRoutes');

app.use('/admin', adminRoutes);
app.use('/api/excel', excelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
  res.send('Balle Balle Te Shaba Shaba');
});

// 8. 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 9. Global error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

