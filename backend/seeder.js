const mongoose = require('mongoose');
const Car = require('./models/Car');
const cars = require('./data/cars');

// Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/namma-ride');

// Import data
const importData = async () => {
    try {
        await Car.deleteMany();
        await Car.insertMany(cars);
        console.log('Data imported successfully');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await Car.deleteMany();
        console.log('Data deleted successfully');
        process.exit();
    } catch (error) {
        console.error('Error deleting data:', error);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} 