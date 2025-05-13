import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCars, getBookings, createCar, deleteCar, updateCar, updateBooking } from '../services/api';
import { uploadMultipleImages } from '../services/cloudinary';
import ProtectedRoute from '../components/ProtectedRoute';

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cars');
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    type: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: '',
    bags: '',
    doors: '',
    pricePerDay: '',
    images: [],
    features: ['']
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, bookingsRes] = await Promise.all([
          getCars(),
          getBookings(),
        ]);
        setCars(carsRes.data.data);
        setBookings(bookingsRes.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      const uploadedUrls = await uploadMultipleImages(files, (progress) => {
        setUploadProgress(progress);
      });

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (err) {
      setError(err.message || 'Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (e, index) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = e.target.value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    try {
      setUploading(true);
      await createCar(formData);
      fetchCars();
      setFormData({
        make: '',
        model: '',
        year: '',
        type: 'Sedan',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seats: '',
        bags: '',
        doors: '',
        pricePerDay: '',
        images: [],
        features: ['']
      });
    } catch (err) {
      setError('Error creating car');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteCar(id);
        fetchCars();
      } catch (err) {
        setError('Error deleting car');
      }
    }
  };

  const fetchCars = async () => {
    try {
      const response = await getCars();
      setCars(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching cars');
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await updateBooking(bookingId, { status: 'Confirmed' });
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'Confirmed' } : b));
    } catch (err) {
      alert('Failed to accept booking.');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await updateBooking(bookingId, { status: 'Rejected' });
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'Rejected' } : b));
    } catch (err) {
      alert('Failed to reject booking.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <ProtectedRoute adminOnly>
      <div className="admin-dashboard">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'cars' ? 'active' : ''}`}
              onClick={() => setActiveTab('cars')}
            >
              Cars
            </button>
            <button
              className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
          </div>

          {activeTab === 'cars' && (
            <div className="admin-section">
              <h2>Add New Car</h2>
              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="car-form">
                <div className="form-group">
                  <label>Make</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleInputChange}>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Fuel Type</label>
                  <select name="fuelType" value={formData.fuelType} onChange={handleInputChange}>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Seats</label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Bags</label>
                  <input
                    type="number"
                    name="bags"
                    value={formData.bags}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Doors</label>
                  <input
                    type="number"
                    name="doors"
                    value={formData.doors}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price Per Day</label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Images</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      disabled={uploading}
                      className="image-upload-input"
                    />
                    {uploading && (
                      <div className="upload-progress">
                        <div className="uploading-spinner">Uploading...</div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <div className="progress-text">{uploadProgress}%</div>
                      </div>
                    )}
                  </div>
                  <div className="image-preview-grid">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={imageUrl} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                          disabled={uploading}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Features</label>
                  {formData.features.map((feature, index) => (
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(e, index)}
                      placeholder="Feature"
                      required
                    />
                  ))}
                  <button type="button" onClick={addFeatureField} className="btn btn-secondary">
                    Add Feature
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading || formData.images.length === 0}
                >
                  {uploading ? 'Adding Car...' : 'Add Car'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'cars' && (
            <div className="admin-section">
              <h2>Manage Cars</h2>
              <div className="cars-grid">
                {cars.map(car => (
                  <div key={car._id} className="car-card">
                    <img src={car.images[0]} alt={car.model} />
                    <div className="car-info">
                      <h3>{car.make} {car.model}</h3>
                      <p className="price">${car.pricePerDay}/day</p>
                      <div className="car-actions">
                        <button
                          onClick={() => handleDelete(car._id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="admin-section">
              <h2>All Bookings</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Car</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.user?.name || booking.user}</td>
                      <td>{booking.car?.make} {booking.car?.model}</td>
                      <td>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</td>
                      <td>{booking.status}</td>
                      <td>{booking.paymentStatus}</td>
                      <td>
                        {booking.status === 'Pending' && (
                          <>
                            <button className="btn btn-success" onClick={() => handleAcceptBooking(booking._id)}>Accept</button>
                            <button className="btn btn-danger" onClick={() => handleRejectBooking(booking._id)}>Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard; 