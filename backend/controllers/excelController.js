// const fs = require('fs');
// const Excel = require('xlsx');
// const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
// const ExcelRecord = require('../models/ExcelRecord');

// // Corrected for memoryStorage
// exports.uploadExcelFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const newExcel = new ExcelRecord({
//       metadata: {
//         originalName: req.file.originalname,
//         fileType: req.file.mimetype,
//         fileSize: req.file.size,
//         userId: req.user._id,
//       },
//       data: req.file.buffer  // <-- use .buffer
//     });

//     await newExcel.save();
//     res.status(201).json({ message: 'File uploaded successfully', fileId: newExcel._id });

//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ error: 'Failed to upload file' });
//   }
// };


// // Get all uploads (paginated - admin only)
// exports.getUploadHistory = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 100;
//     const skip = (page - 1) * limit;

//     const files = await ExcelRecord.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await ExcelRecord.countDocuments();

//     res.json({
//       uploads: files,
//       page,
//       totalPages: Math.ceil(total / limit),
//       total
//     });

//   } catch (err) {
//     console.error('getUploadHistory error:', err);
//     res.status(500).json({ message: 'Failed to fetch uploads', error: err.message });
//   }
// };

// // Get only current user's uploads
// exports.getUserUploads = async (req, res) => {
//   try {
//     const files = await ExcelRecord.find({ 'metadata.userId': req.user._id })
//       .sort({ createdAt: -1 });

//     res.json({ uploads: files });

//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch uploads', error: error.message });
//   }
// };

// // Download Excel File
// exports.downloadExcelFile = async (req, res) => {
//   try {
//     const file = await ExcelRecord.findOne({
//       _id: req.params.id,
//       'metadata.userId': req.user._id
//     });

//     if (!file) {
//       return res.status(404).json({ error: 'File not found' });
//     }

//     res.set({
//       'Content-Type': file.metadata.fileType,
//       'Content-Disposition': `attachment; filename="${file.metadata.originalName}"`,
//     });

//     res.send(file.data);

//   } catch (error) {
//     console.error('Download error:', error);
//     res.status(500).json({ error: 'Failed to download file' });
//   }
// };

// // Search Excel Files
// exports.searchExcelFiles = async (req, res) => {
//   try {
//     const { q } = req.query;
//     if (!q) return res.status(400).json({ error: 'Search query is required' });

//     const regex = new RegExp(q, 'i');
//     const files = await ExcelRecord.find({
//       'metadata.userId': req.user._id,
//       'metadata.originalName': regex
//     }, 'metadata createdAt');

//     res.json(files);

//   } catch (error) {
//     console.error('Search error:', error);
//     res.status(500).json({ error: 'Failed to search files' });
//   }
// };

// // Chart Generator
// exports.generateChart = async (req, res) => {
//   try {
//     const file = await ExcelRecord.findById(req.params.id);
//     if (!file) return res.status(404).json({ error: 'File not found' });

//     const workbook = Excel.read(file.data, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const jsonArray = Excel.utils.sheet_to_json(worksheet, { header: 1 });

//     if (jsonArray.length < 2) {
//       return res.status(400).json({ error: 'Excel sheet must have headers and data rows' });
//     }

//     const headers = jsonArray[0];
//     const dataRows = jsonArray.slice(1);

//     let labelColIndex = 0;
//     let valueColIndex = 1;

//     for (let i = 0; i < headers.length; i++) {
//       if (typeof dataRows[0][i] === 'string') labelColIndex = i;
//       if (!isNaN(parseFloat(dataRows[0][i]))) valueColIndex = i;
//     }

//     const labels = dataRows.map(row => row[labelColIndex] || '');
//     const values = dataRows.map(row => parseFloat(row[valueColIndex]) || 0);

//     const canvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
//     const configuration = {
//       type: 'bar',
//       data: {
//         labels,
//         datasets: [{
//           label: headers[valueColIndex] || 'Values',
//           data: values,
//           backgroundColor: 'rgba(54, 162, 235, 0.6)',
//           borderColor: 'rgba(54, 162, 235, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         scales: {
//           y: { beginAtZero: true },
//           x: { title: { display: true, text: headers[labelColIndex] || 'Categories' } }
//         },
//         plugins: {
//           title: {
//             display: true,
//             text: 'Data Chart'
//           }
//         }
//       }
//     };

//     const image = await canvas.renderToBuffer(configuration);
//     res.set('Content-Type', 'image/png');
//     res.send(image);

//   } catch (error) {
//     console.error('Chart error:', error);
//     res.status(500).json({ error: 'Chart generation failed', details: error.message });
//   }
// };

// // AI Insight Generator
// exports.generateAIInsight = async (req, res) => {
//   try {
//     const file = await ExcelRecord.findById(req.params.id);
//     if (!file) return res.status(404).json({ error: 'File not found' });

//     const workbook = Excel.read(file.data, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const jsonArray = Excel.utils.sheet_to_json(worksheet, { header: 1 });

//     if (jsonArray.length < 2) {
//       return res.status(400).json({ error: 'Insufficient data for insight' });
//     }

//     const headers = jsonArray[0];
//     const dataRows = jsonArray.slice(1);
//     const insights = await generateDataInsights(headers, dataRows, file.metadata.originalName);

//     res.json({
//       success: true,
//       insights,
//       fileName: file.metadata.originalName,
//       dataPoints: dataRows.length,
//       columns: headers.length
//     });

//   } catch (error) {
//     console.error('AI Insight error:', error);
//     res.status(500).json({ error: 'Failed to generate AI insight' });
//   }
// };

// // Insight Generator Logic
// async function generateDataInsights(headers, dataRows, fileName) {
//   const insights = {
//     summary: '',
//     keyFindings: [],
//     statisticalOverview: {},
//     recommendations: []
//   };

//   const numericColumns = [];
//   const textColumns = [];

//   headers.forEach((header, i) => {
//     const samples = dataRows.map(row => row[i]).filter(val => val !== undefined);
//     const numericCount = samples.filter(val => !isNaN(parseFloat(val))).length;
//     if (numericCount > samples.length * 0.7) {
//       numericColumns.push({ name: header, index: i });
//     } else {
//       textColumns.push({ name: header, index: i });
//     }
//   });

//   insights.summary = `Analysis of ${fileName}: ${dataRows.length} rows, ${headers.length} columns. ${numericColumns.length} numeric columns, ${textColumns.length} text columns.`;

//   for (const col of numericColumns) {
//     const values = dataRows.map(row => parseFloat(row[col.index])).filter(val => !isNaN(val));
//     const avg = values.reduce((a, b) => a + b, 0) / values.length;
//     insights.keyFindings.push(`${col.name}: Avg=${avg.toFixed(2)}, Min=${Math.min(...values)}, Max=${Math.max(...values)}`);
//     insights.statisticalOverview[col.name] = {
//       average: avg.toFixed(2),
//       minimum: Math.min(...values),
//       maximum: Math.max(...values),
//       total: values.reduce((a, b) => a + b, 0).toFixed(2)
//     };
//   }

//   for (const col of textColumns) {
//     const values = dataRows.map(row => row[col.index]);
//     const unique = new Set(values).size;
//     insights.keyFindings.push(`${col.name}: ${unique} unique values`);
//   }

//   insights.recommendations.push(
//     'Use charts to visualize trends.',
//     'Explore correlation between numeric fields.',
//     'Segment data for deeper insights.'
//   );

//   return insights;
// }

// // Delete all user files
// exports.clearUserFiles = async (req, res) => {
//   try {
//     await ExcelRecord.deleteMany({ 'metadata.userId': req.user._id });
//     res.json({ message: 'Upload history cleared' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to clear upload history' });
//   }
// };

// // Delete a specific file
// exports.deleteExcelFile = async (req, res) => {
//   try {
//     const result = await ExcelRecord.deleteOne({
//       _id: req.params.id,
//       'metadata.userId': req.user._id
//     });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ error: 'File not found or unauthorized' });
//     }

//     res.json({ message: 'File deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete file' });
//   }
// };

// exports.getExcelColumns = async (req, res) => {
//   try {
//     const file = await ExcelRecord.findById(req.params.id);
//     if (!file) {
//       return res.status(404).json({ error: 'File not found' });
//     }

//     const workbook = require('xlsx').read(file.data, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const jsonArray = require('xlsx').utils.sheet_to_json(worksheet, { header: 1 });

//     if (jsonArray.length === 0) {
//       return res.status(400).json({ error: 'Empty Excel sheet' });
//     }

//     const headers = jsonArray[0];
//     res.json({ columns: headers });
//   } catch (error) {
//     console.error('Error fetching columns:', error);
//     res.status(500).json({ error: 'Failed to get columns' });
//   }
// };

// // Alias for getUserUploads
// exports.listExcelFiles = exports.getUserUploads;

const fs = require('fs');
const Excel = require('xlsx');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ExcelRecord = require('../models/ExcelRecord');

// Upload Excel File
// exports.uploadExcelFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const newExcel = new ExcelRecord({
//       metadata: {
//         originalName: req.file.originalname,
//         fileType: req.file.mimetype,
//         fileSize: req.file.size,
//         userId: req.user._id,
//       },
//       data: req.file.buffer
//     });

//     await newExcel.save();
//     res.status(201).json({ message: 'File uploaded successfully', fileId: newExcel._id });
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ error: 'Failed to upload file' });
//   }
// };

// Upload Excel File
exports.uploadExcelFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const newExcel = new ExcelRecord({
      metadata: {
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        userId: req.user._id,
      },
      data: req.file.buffer
    });

    await newExcel.save();

    // ✅ Immediately extract column + row data
    const workbook = Excel.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonArray = Excel.utils.sheet_to_json(worksheet);

    if (!jsonArray.length) {
      return res.status(400).json({ error: 'No data found in Excel file' });
    }

    const columns = Object.keys(jsonArray[0]);
    const rows = jsonArray;

    res.status(201).json({
      message: 'File uploaded successfully',
      fileId: newExcel._id,
      columns,
      rows,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

// Get full Excel content (columns + rows)
exports.getExcelFileData = async (req, res) => {
  try {
    const file = await ExcelRecord.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const workbook = Excel.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonArray = Excel.utils.sheet_to_json(worksheet);

    if (jsonArray.length === 0) {
      return res.status(400).json({ error: 'No data in Excel sheet' });
    }

    const columns = Object.keys(jsonArray[0]);
    res.json({ columns, rows: jsonArray });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch file data' });
  }
};

// Chart image generator
exports.generateChart = async (req, res) => {
  try {
    const file = await ExcelRecord.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    const workbook = Excel.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonArray = Excel.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonArray.length < 2) {
      return res.status(400).json({ error: 'Excel sheet must have headers and data rows' });
    }

    const headers = jsonArray[0];
    const dataRows = jsonArray.slice(1);

    let labelColIndex = 0;
    let valueColIndex = 1;

    for (let i = 0; i < headers.length; i++) {
      if (typeof dataRows[0][i] === 'string') labelColIndex = i;
      if (!isNaN(parseFloat(dataRows[0][i]))) valueColIndex = i;
    }

    const labels = dataRows.map(row => row[labelColIndex] || '');
    const values = dataRows.map(row => parseFloat(row[valueColIndex]) || 0);

    const canvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
    const configuration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: headers[valueColIndex] || 'Values',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true },
          x: { title: { display: true, text: headers[labelColIndex] || 'Categories' } }
        },
        plugins: {
          title: {
            display: true,
            text: 'Data Chart'
          }
        }
      }
    };

    const image = await canvas.renderToBuffer(configuration);
    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    console.error('Chart error:', error);
    res.status(500).json({ error: 'Chart generation failed', details: error.message });
  }
};


// Generate AI Insight
exports.generateAIInsight = async (req, res) => {
  try {
    const file = await ExcelRecord.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    const workbook = Excel.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonArray = Excel.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonArray.length < 2) {
      return res.status(400).json({ error: 'Insufficient data for insight' });
    }

    const headers = jsonArray[0];
    const dataRows = jsonArray.slice(1);
    const insights = await generateDataInsights(headers, dataRows, file.metadata.originalName);

    res.json({
      success: true,
      insights,
      fileName: file.metadata.originalName,
      dataPoints: dataRows.length,
      columns: headers.length
    });
  } catch (error) {
    console.error('AI Insight error:', error);
    res.status(500).json({ error: 'Failed to generate AI insight' });
  }
};

async function generateDataInsights(headers, dataRows, fileName) {
  const insights = {
    summary: '',
    keyFindings: [],
    statisticalOverview: {},
    recommendations: []
  };

  const numericColumns = [];
  const textColumns = [];

  headers.forEach((header, i) => {
    const samples = dataRows.map(row => row[i]).filter(val => val !== undefined);
    const numericCount = samples.filter(val => !isNaN(parseFloat(val))).length;
    if (numericCount > samples.length * 0.7) {
      numericColumns.push({ name: header, index: i });
    } else {
      textColumns.push({ name: header, index: i });
    }
  });

  insights.summary = `Analysis of ${fileName}: ${dataRows.length} rows, ${headers.length} columns. ${numericColumns.length} numeric columns, ${textColumns.length} text columns.`;

  for (const col of numericColumns) {
    const values = dataRows.map(row => parseFloat(row[col.index])).filter(val => !isNaN(val));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    insights.keyFindings.push(`${col.name}: Avg=${avg.toFixed(2)}, Min=${Math.min(...values)}, Max=${Math.max(...values)}`);
    insights.statisticalOverview[col.name] = {
      average: avg.toFixed(2),
      minimum: Math.min(...values),
      maximum: Math.max(...values),
      total: values.reduce((a, b) => a + b, 0).toFixed(2)
    };
  }

  for (const col of textColumns) {
    const values = dataRows.map(row => row[col.index]);
    const unique = new Set(values).size;
    insights.keyFindings.push(`${col.name}: ${unique} unique values`);
  }

  insights.recommendations.push(
    'Use charts to visualize trends.',
    'Explore correlation between numeric fields.',
    'Segment data for deeper insights.'
  );

  return insights;
}

// Get current user's uploads
exports.getUserUploads = async (req, res) => {
  try {
    const files = await ExcelRecord.find({ 'metadata.userId': req.user._id }).sort({ createdAt: -1 });
    res.json({ uploads: files });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch uploads', error: error.message });
  }
};

// Download Excel File
exports.downloadExcelFile = async (req, res) => {
  try {
    const file = await ExcelRecord.findOne({
      _id: req.params.id,
      'metadata.userId': req.user._id
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.set({
      'Content-Type': file.metadata.fileType,
      'Content-Disposition': `attachment; filename="${file.metadata.originalName}"`,
    });

    res.send(file.data);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};

// Search Excel Files
exports.searchExcelFiles = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query is required' });

    const regex = new RegExp(q, 'i');
    const files = await ExcelRecord.find({
      'metadata.userId': req.user._id,
      'metadata.originalName': regex
    }, 'metadata createdAt');

    res.json(files);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search files' });
  }
};

// Admin view: Get all uploads
exports.getUploadHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const files = await ExcelRecord.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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

// Delete all user files
exports.clearUserFiles = async (req, res) => {
  try {
    await ExcelRecord.deleteMany({ 'metadata.userId': req.user._id });
    res.json({ message: 'Upload history cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear upload history' });
  }
};

// Delete a specific file
exports.deleteExcelFile = async (req, res) => {
  try {
    const result = await ExcelRecord.deleteOne({
      _id: req.params.id,
      'metadata.userId': req.user._id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

// Alias
exports.listExcelFiles = exports.getUserUploads;
