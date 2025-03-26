const multer = require('multer');
const path = require('path');

// Define storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination directory
    cb(null, 'uploads'); // Files are saved in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for each file
    const uniqueSuffix = `${Date.now() }-${ path.extname(file.originalname)}`;
    cb(null, uniqueSuffix); // Save with a unique name
  }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage });

module.exports = upload;
