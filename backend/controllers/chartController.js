const Excel = require('xlsx');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ExcelRecord = require('../models/ExcelRecord'); // Adjust path/model name as needed

const width = 800;  // chart image width
const height = 600; // chart image height
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// Helper: parse Excel buffer to extract labels and values (assuming first two columns)
function parseExcelData(buffer) {
  const workbook = Excel.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = Excel.utils.sheet_to_json(worksheet);

  if (jsonData.length === 0) {
    throw new Error('Excel sheet is empty');
  }

  const labels = jsonData.map(row => Object.values(row)[0]);
  const values = jsonData.map(row => Object.values(row)[1]);

  return { labels, values };
}

exports.generateChart = async (req, res) => {
  try {
    const fileId = req.params.id;

    // Fetch Excel file record from DB
    const fileRecord = await ExcelRecord.findById(fileId);
    if (!fileRecord) {
      return res.status(404).json({ error: 'Excel file not found' });
    }

    // Parse Excel data
    const { labels, values } = parseExcelData(fileRecord.data);

    // Chart configuration (bar chart example)
    const configuration = {
      type: 'bar',  // You can change to 'line', 'pie', etc.
      data: {
        labels: labels,
        datasets: [{
          label: 'Values',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    // Render chart to image buffer
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    // Send image buffer as PNG
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);

  } catch (error) {
    console.error('Error generating chart:', error);
    res.status(500).json({ error: error.message || 'Failed to generate chart' });
  }
};
