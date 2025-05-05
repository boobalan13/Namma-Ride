import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCars } from '../services/api';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState({});
  const [filters, setFilters] = useState({
    type: '',
    transmission: '',
    fuelType: '',
    minPrice: '',
    maxPrice: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await getCars();
        setCars(res.data.data);
      } catch (err) {
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleImageError = (carId) => {
    setImageError(prev => ({
      ...prev,
      [carId]: true
    }));
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filters.type || car.type === filters.type) &&
      (!filters.transmission || car.transmission === filters.transmission) &&
      (!filters.fuelType || car.fuelType === filters.fuelType) &&
      (!filters.minPrice || car.pricePerDay >= Number(filters.minPrice)) &&
      (!filters.maxPrice || car.pricePerDay <= Number(filters.maxPrice));

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="cars-page">
      <div className="container">
        <div className="page-header">
          <h1>Available Cars</h1>
          <p>Find your perfect ride from our selection of quality vehicles</p>
        </div>

        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by make or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-groups">
            <div className="filter-group">
              <label>Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Transmission</label>
              <select name="transmission" value={filters.transmission} onChange={handleFilterChange}>
                <option value="">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Fuel Type</label>
              <select name="fuelType" value={filters.fuelType} onChange={handleFilterChange}>
                <option value="">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="filter-group price-range">
              <label>Price Range (per day)</label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <span>to</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="cars-grid">
            {[1, 2, 3, 4, 5, 6].map((skeleton) => (
              <div key={skeleton} className="car-card skeleton">
                <div className="car-image-skeleton"></div>
                <div className="car-info-skeleton">
                  <div className="title-skeleton"></div>
                  <div className="details-skeleton"></div>
                  <div className="price-skeleton"></div>
                  <div className="button-skeleton"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="cars-grid">
            {filteredCars.map((car) => (
              <div key={car._id} className="car-card">
                <div className="car-image-container">
                  {!imageError[car._id] ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.make} ${car.model}`}
                      className="car-image"
                      loading="lazy"
                      onError={() => handleImageError(car._id)}
                    />
                  ) : (
                    <div className="car-image-fallback">
                      <span className="fallback-text">{car.make} {car.model}</span>
                    </div>
                  )}
                  {car.images.length > 1 && (
                    <div className="image-count">+{car.images.length - 1}</div>
                  )}
                </div>
                <div className="car-info">
                  <h3>{car.make} {car.model}</h3>
                  <div className="car-details">
                    <span>{car.type}</span>
                    <span>{car.transmission}</span>
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="car-features">
                    <span>{car.seats} Seats</span>
                    <span>{car.bags} Bags</span>
                    <span>{car.doors} Doors</span>
                  </div>
                  <div className="car-price">
                    <span className="amount">${car.pricePerDay}</span>
                    <span className="period">per day</span>
                  </div>
                  <Link to={`/cars/${car._id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-cars">
            <h2>No cars found</h2>
            <p>Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars; 