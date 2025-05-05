const Car = require('../models/Car');
const path = require('path');
const fs = require('fs');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
exports.getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.json({
            success: true,
            count: cars.length,
            data: cars
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
exports.getCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({
                success: false,
                error: 'Car not found'
            });
        }
        res.json({
            success: true,
            data: car
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create new car
// @route   POST /api/cars
// @access  Private/Admin
exports.createCar = async (req, res) => {
    try {
        const car = await Car.create(req.body);
        res.status(201).json({
            success: true,
            data: car
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private/Admin
exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!car) {
            return res.status(404).json({
                success: false,
                error: 'Car not found'
            });
        }
        res.json({
            success: true,
            data: car
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) {
            return res.status(404).json({
                success: false,
                error: 'Car not found'
            });
        }
        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Upload car images
// @route   PUT /api/cars/:id/images
// @access  Private/Admin
exports.uploadCarImages = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: 'Please upload files'
            });
        }

        const files = req.files;
        const images = [];

        files.forEach(file => {
            images.push(file.filename);
        });

        car.images = [...car.images, ...images];
        await car.save();

        res.status(200).json({
            success: true,
            data: car
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete car image
// @route   DELETE /api/cars/:id/images/:imageName
// @access  Private/Admin
exports.deleteCarImage = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        const imageIndex = car.images.indexOf(req.params.imageName);
        if (imageIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Delete image from uploads folder
        const imagePath = path.join(__dirname, '../uploads/cars', req.params.imageName);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        car.images.splice(imageIndex, 1);
        await car.save();

        res.status(200).json({
            success: true,
            data: car
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 