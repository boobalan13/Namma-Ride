const express = require('express');
const router = express.Router();
const {
    getCars,
    getCar,
    createCar,
    updateCar,
    deleteCar,
    uploadCarImages,
    deleteCarImage
} = require('../controllers/carController');
const { protect, authorize } = require('../middleware/auth');
const carImageUpload = require('../middleware/carImageUpload');

router.route('/')
    .get(getCars)
    .post(protect, authorize('admin'), createCar);

router.route('/:id')
    .get(getCar)
    .put(protect, authorize('admin'), updateCar)
    .delete(protect, authorize('admin'), deleteCar);

router.route('/:id/images')
    .put(protect, authorize('admin'), carImageUpload.array('images', 5), uploadCarImages);

router.route('/:id/images/:imageName')
    .delete(protect, authorize('admin'), deleteCarImage);

module.exports = router; 