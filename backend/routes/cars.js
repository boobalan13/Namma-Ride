const express = require('express');
const router = express.Router();
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');

// Get all cars and Create car
router.route('/')
  .get(getCars)
  .post(createCar);

// Get single car, Update car and Delete car
router.route('/:id')
  .get(getCar)
  .put(updateCar)
  .delete(deleteCar);

module.exports = router; 