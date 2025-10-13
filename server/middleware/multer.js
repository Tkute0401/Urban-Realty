const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images, videos, and documents (PDF, DOC, DOCX)
  const allowedMimeTypes = [
    'image/',
    'video/',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const isAllowed = allowedMimeTypes.some(type => file.mimetype.startsWith(type));
  
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Only image, video, and document files (PDF, DOC, DOCX) are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { 
    fileSize: 1024 * 1024 * 100, // 100MB (for videos)
    files: 10 // Max 10 files
  }
});


// Helper function to get upload middleware based on media type
exports.getUploadMiddleware = (fieldName, maxCount = 10) => {
  return upload.array(fieldName, maxCount);
};


module.exports = upload;
