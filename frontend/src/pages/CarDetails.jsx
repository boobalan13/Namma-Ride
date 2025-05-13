import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCar, createBooking } from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    driverLicense: '',
    paymentMethod: 'credit_card', // Default payment method
  });

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await getCar(id);
        setCar(res.data.data);
      } catch (err) {
        console.error('Error fetching car:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!bookingData.startDate || !bookingData.endDate || !bookingData.pickupLocation || !bookingData.dropoffLocation || !bookingData.driverLicense) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const booking = {
        ...bookingData,
        car: id,
      };
      console.log('Booking payload:', booking); // Log the payload
      await createBooking(booking);
      navigate('/bookings');
    } catch (err) {
      console.error('Error creating booking:', err);
      alert(
        err.response?.data?.message ||
        'Failed to create booking. Please try again.'
      );
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!car) {
    return <div className="error">Car not found</div>;
  }

  return (
    <div className="car-details">
      <div className="container">
        <div className="car-gallery">
          {car.images.map((image, index) => (
            <img key={index} src={image} alt={`${car.make} ${car.model}`} />
          ))}
        </div>

        <div className="car-info">
          <h1>{car.make} {car.model}</h1>
          <p className="price">${car.pricePerDay}/day</p>
          
          <div className="car-specs">
            <div className="spec">
              <span>Type:</span>
              <span>{car.type}</span>
            </div>
            <div className="spec">
              <span>Transmission:</span>
              <span>{car.transmission}</span>
            </div>
            <div className="spec">
              <span>Fuel Type:</span>
              <span>{car.fuelType}</span>
            </div>
            <div className="spec">
              <span>Seats:</span>
              <span>{car.seats}</span>
            </div>
            <div className="spec">
              <span>Year:</span>
              <span>{car.year}</span>
            </div>
          </div>

          <div className="car-description">
            <h2>Description</h2>
            <p>{car.description}</p>
          </div>

          <div className="booking-form">
            <h2>Book This Car</h2>
            {car.availability ? (
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={bookingData.startDate}
                    onChange={handleBookingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={bookingData.endDate}
                    onChange={handleBookingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pickup Location</label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={bookingData.pickupLocation}
                    onChange={handleBookingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Dropoff Location</label>
                  <input
                    type="text"
                    name="dropoffLocation"
                    value={bookingData.dropoffLocation}
                    onChange={handleBookingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Driver's License Number</label>
                  <input
                    type="text"
                    name="driverLicense"
                    value={bookingData.driverLicense}
                    onChange={handleBookingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={bookingData.paymentMethod}
                    onChange={handleBookingChange}
                    required
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Book Now
                </button>
              </form>
            ) : (
              <div className="unavailable-message">
                <p>This car is currently unavailable for booking.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails; 