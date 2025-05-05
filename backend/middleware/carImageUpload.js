const multer = require('multer');
const path = require('path');

// Configure storage for car images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/cars/');
    },
    filename: function (req, file, cb) {
        cb(null, 'car-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

// File filter for car images
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const filetypes = /jpeg|jpg|png/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Only JPEG, JPG, and PNG images are allowed!'));
    }
};

// Initialize upload for car images
const carImageUpload = multer({
    storage: storage,
    limits: { 
        fileSize: 5000000, // 5MB max file size
        files: 5 // Maximum 5 images per upload
    },
    fileFilter: fileFilter
});

module.exports = carImageUpload; 