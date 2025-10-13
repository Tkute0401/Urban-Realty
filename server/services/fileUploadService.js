const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
const documentsDir = path.join(uploadsDir, 'documents');
const imagesDir = path.join(uploadsDir, 'images');
const videosDir = path.join(uploadsDir, 'videos');

[uploadsDir, documentsDir, imagesDir, videosDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper function to generate unique filename
const generateUniqueFilename = (originalname) => {
  const ext = path.extname(originalname);
  const name = path.basename(originalname, ext);
  const hash = crypto.randomBytes(16).toString('hex');
  return `${name}-${hash}${ext}`;
};

// Helper function to get file URL for Railway
const getFileUrl = (filename, subfolder = '') => {
  const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN || process.env.BASE_URL || 'http://localhost:5000';
  const folder = subfolder ? `/${subfolder}` : '';
  return `${baseUrl}/uploads${folder}/${filename}`;
};

// Upload images to Cloudinary
const uploadImages = async (files, folder = 'images') => {
  const uploadedImages = [];
  
  for (const file of files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        access_mode: 'public',
        transformation: [
          { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
          { format: 'auto' }
        ]
      });
      
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
        name: file.originalname,
        type: file.mimetype
      });
      
      // Delete local file
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      // Delete local file even if upload failed
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
  
  return uploadedImages;
};

// Upload videos to Cloudinary
const uploadVideos = async (files, folder = 'videos') => {
  const uploadedVideos = [];
  
  for (const file of files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'video',
        access_mode: 'public',
        transformation: [
          { width: 1280, height: 720, crop: 'fill', quality: 'auto' }
        ]
      });
      
      uploadedVideos.push({
        url: result.secure_url,
        publicId: result.public_id,
        name: file.originalname,
        type: file.mimetype,
        thumbnail: result.secure_url.replace('.mp4', '.jpg')
      });
      
      // Delete local file
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error('Error uploading video to Cloudinary:', error);
      // Delete local file even if upload failed
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
  
  return uploadedVideos;
};

// Upload documents (PDFs, DOC, etc.) to Railway's local storage
const uploadDocuments = async (files, subfolder = 'documents') => {
  const uploadedDocuments = [];
  const targetDir = path.join(uploadsDir, subfolder);
  
  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  for (const file of files) {
    try {
      const filename = generateUniqueFilename(file.originalname);
      const filepath = path.join(targetDir, filename);
      
      // Copy file to target directory
      fs.copyFileSync(file.path, filepath);
      
      // Get file stats
      const stats = fs.statSync(filepath);
      
      uploadedDocuments.push({
        url: getFileUrl(filename, subfolder),
        filename: filename,
        name: file.originalname,
        type: file.mimetype,
        size: stats.size,
        path: filepath
      });
      
      // Delete original temp file
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error('Error uploading document to local storage:', error);
      // Delete local file even if upload failed
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
  
  return uploadedDocuments;
};

// Upload files with automatic type detection
const uploadFiles = async (files, folder = 'documents') => {
  const imageFiles = [];
  const videoFiles = [];
  const documentFiles = [];
  
  // Categorize files by type
  files.forEach(file => {
    if (file.mimetype.startsWith('image/')) {
      imageFiles.push(file);
    } else if (file.mimetype.startsWith('video/')) {
      videoFiles.push(file);
    } else {
      documentFiles.push(file);
    }
  });
  
  const results = {
    images: [],
    videos: [],
    documents: []
  };
  
  // Upload images to Cloudinary
  if (imageFiles.length > 0) {
    results.images = await uploadImages(imageFiles, `${folder}/images`);
  }
  
  // Upload videos to Cloudinary
  if (videoFiles.length > 0) {
    results.videos = await uploadVideos(videoFiles, `${folder}/videos`);
  }
  
  // Upload documents to local storage
  if (documentFiles.length > 0) {
    results.documents = await uploadDocuments(documentFiles, folder);
  }
  
  return results;
};

// Delete files from Cloudinary
const deleteCloudinaryFiles = async (files) => {
  for (const file of files) {
    if (file.publicId) {
      try {
        await cloudinary.uploader.destroy(file.publicId);
      } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
      }
    }
  }
};

// Delete files from local storage
const deleteLocalFiles = async (files) => {
  for (const file of files) {
    if (file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error('Error deleting local file:', error);
      }
    }
  }
};

// Delete files (handles both Cloudinary and local storage)
const deleteFiles = async (files) => {
  const cloudinaryFiles = files.filter(file => file.publicId);
  const localFiles = files.filter(file => file.path);
  
  if (cloudinaryFiles.length > 0) {
    await deleteCloudinaryFiles(cloudinaryFiles);
  }
  
  if (localFiles.length > 0) {
    await deleteLocalFiles(localFiles);
  }
};

// Serve static files (for Railway)
const serveStaticFiles = (app) => {
  app.use('/uploads', (req, res, next) => {
    // Set appropriate headers for different file types
    const filePath = path.join(uploadsDir, req.path);
    
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      
      // Set content type based on file extension
      const contentTypes = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.mov': 'video/quicktime'
      };
      
      const contentType = contentTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      
      // Set cache headers
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
      
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    
    next();
  });
  
  app.use('/uploads', require('express').static(uploadsDir));
};

module.exports = {
  uploadImages,
  uploadVideos,
  uploadDocuments,
  uploadFiles,
  deleteFiles,
  deleteCloudinaryFiles,
  deleteLocalFiles,
  serveStaticFiles,
  getFileUrl
};
