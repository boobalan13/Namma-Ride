import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { getCars } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState({});
  const { user, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await getCars();
        // Get the first 3 cars with images
        const carsWithImages = response.data.data
          .filter(car => car.images && car.images.length > 0)
          .slice(0, 3);
        setFeaturedCars(carsWithImages);
      } catch (error) {
        console.error('Error fetching featured cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  const handleImageError = (carId) => {
    setImageError(prev => ({
      ...prev,
      [carId]: true
    }));
  };

  const features = [
    {
      icon: '🚗',
      title: 'Wide Selection',
      description: 'Choose from our diverse fleet of vehicles for any occasion'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Competitive rates and transparent pricing with no hidden fees'
    },
    {
      icon: '🔒',
      title: 'Safe & Reliable',
      description: 'Well-maintained vehicles with comprehensive insurance coverage'
    },
    {
      icon: '🎯',
      title: '24/7 Support',
      description: 'Round-the-clock customer service for peace of mind'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Choose Your Car',
      description: 'Browse our selection and pick your perfect vehicle'
    },
    {
      number: 2,
      title: 'Make Reservation',
      description: 'Select your dates and complete the booking'
    },
    {
      number: 3,
      title: 'Enjoy Your Ride',
      description: 'Pick up your car and start your journey'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Ride</h1>
          <p>Experience luxury and comfort with our premium Namma Ride service</p>
          <Link to="/cars" className="btn btn-primary">Browse Cars</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Us</h2>
            <p>We offer the best ride experience with premium services</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="featured-cars">
        <div className="container">
          <div className="section-title">
            <h2>Featured Cars</h2>
            <p>Explore our top-rated vehicles available for rent</p>
          </div>
          {loading ? (
            <div className="car-grid">
              {[1, 2, 3].map((skeleton) => (
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
          ) : featuredCars.length > 0 ? (
            <>
              <div className="car-grid">
                {featuredCars.map((car) => (
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
                      <div className="car-price">
                        <span className="amount">${car.pricePerDay}</span>
                        <span className="period">per day</span>
                      </div>
                      <Link to={`/cars/${car._id}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="view-all">
                <Link to="/cars" className="btn btn-secondary">View All Cars</Link>
              </div>
            </>
          ) : (
            <div className="no-cars">
              <p>No featured cars available at the moment.</p>
              <Link to="/cars" className="btn btn-primary">Browse All Cars</Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-title">
            <h2>How It Works</h2>
            <p>Rent a car in 3 simple steps</p>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      { !user && !authLoading && (
        <section className="cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of satisfied customers who trust our service</p>
              <Link to="/register" className="btn btn-primary">Sign Up Now</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home; 