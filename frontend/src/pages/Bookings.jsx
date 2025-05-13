import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getBookings, cancelBooking, updateBooking } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState({});
  const { user } = useContext(AuthContext);

  // Redirect admin users to the admin dashboard
  if (user && user.role === 'admin') {
    window.location.href = '/admin';
    return null;
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getBookings();
        console.log('Bookings response:', res.data);
        setBookings(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await cancelBooking(bookingId, 'User cancelled');
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handlePayNow = async (bookingId) => {
    // Simulate payment and update paymentStatus
    try {
      await updateBooking(bookingId, { paymentStatus: 'Paid' });
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, paymentStatus: 'Paid' } : b));
      alert('Payment successful!');
    } catch (err) {
      alert('Payment failed.');
    }
  };

  const handleImageError = (carId) => {
    setImageError(prev => ({
      ...prev,
      [carId]: true
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <ProtectedRoute>
      <div className="bookings-page">
        <div className="container">
          <div className="page-header">
            <h1>My Bookings</h1>
            <p>Manage your Namma Ride bookings</p>
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {loading ? (
            <div className="bookings-list">
              {[1, 2, 3].map((skeleton) => (
                <div key={skeleton} className="booking-card skeleton">
                  <div className="car-image-skeleton"></div>
                  <div className="booking-info-skeleton">
                    <div className="title-skeleton"></div>
                    <div className="details-skeleton"></div>
                    <div className="price-skeleton"></div>
                    <div className="buttons-skeleton">
                      <div className="button-skeleton"></div>
                      <div className="button-skeleton"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="no-bookings">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <i className="fas fa-calendar-times"></i>
                </div>
                <h2>No Bookings Found</h2>
                <p>You haven't made any car reservations yet. Start exploring our collection of vehicles and book your perfect ride!</p>
                <div className="empty-state-actions">
                  <Link to="/cars" className="btn btn-primary">
                    <i className="fas fa-car"></i> Browse Available Cars
                  </Link>
                  <Link to="/profile" className="btn btn-secondary">
                    <i className="fas fa-user"></i> View Profile
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-car-image">
                    {!imageError[booking.car?._id] && booking.car && booking.car.images && booking.car.images[0] ? (
                      <img
                        src={booking.car.images[0]}
                        alt={`${booking.car.make} ${booking.car.model}`}
                        loading="lazy"
                        onError={() => handleImageError(booking.car._id)}
                      />
                    ) : (
                      <div className="car-image-fallback">
                        <span className="fallback-text">
                          {booking.car ? `${booking.car.make} ${booking.car.model}` : 'Car'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="booking-info">
                    <div className="booking-header">
                      <h3>{booking.car.make} {booking.car.model}</h3>
                      <span className={`status ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="booking-details">
                      <div className="booking-dates">
                        <div className="date-group">
                          <label>Pickup Date</label>
                          <p>{formatDate(booking.startDate)}</p>
                        </div>
                        <div className="date-group">
                          <label>Return Date</label>
                          <p>{formatDate(booking.endDate)}</p>
                        </div>
                        <div className="duration">
                          <label>Duration</label>
                          <p>{calculateDuration(booking.startDate, booking.endDate)} days</p>
                        </div>
                      </div>

                      <div className="booking-locations">
                        <div className="location-group">
                          <label>Pickup Location</label>
                          <p>{booking.pickupLocation}</p>
                        </div>
                        <div className="location-group">
                          <label>Dropoff Location</label>
                          <p>{booking.dropoffLocation}</p>
                        </div>
                      </div>

                      <div className="booking-price">
                        <div className="price-details">
                          <label>Total Price</label>
                          <p className="total-price">${booking.totalPrice}</p>
                        </div>
                      </div>
                    </div>

                    <div className="booking-actions">
                      {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                      {booking.status === 'Confirmed' && booking.paymentStatus === 'Pending' && (
                        <button
                          className="btn btn-success"
                          onClick={() => handlePayNow(booking._id)}
                        >
                          Pay Now
                        </button>
                      )}
                      <Link
                        to={`/cars/${booking.car?._id}`}
                        className="btn btn-secondary"
                      >
                        View Car Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Bookings; 