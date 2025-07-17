const mongoose = require('mongoose');

const excelFileSchema = new mongoose.Schema({
  metadata: {
    originalName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  data: { type: Buffer, required: true }
}, {
  timestamps: true, // <-- this adds createdAt and updatedAt automatically!
  versionKey: '__v'
});
// Add the index for efficient sorting by createdAt
excelFileSchema.index({ createdAt: -1 });

// Use a single model name everywhere, e.g., 'ExcelRecord'
module.exports = mongoose.model('ExcelRecord', excelFileSchema);
