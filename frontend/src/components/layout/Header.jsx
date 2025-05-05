import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import logoImg from '../../assets/namma-ride-logo.png';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const showBackButton = location.pathname !== '/' && 
    location.pathname !== '/cars' && 
    location.pathname !== '/login' && 
    location.pathname !== '/register';

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {showBackButton && (
            <button onClick={handleBack} className="back-button">
              <i className="fas fa-arrow-left"></i> Back
            </button>
          )}
          <div className="logo">
            <Link to="/" className="logo-link">
              <img src={logoImg} alt="Namma Ride Logo" className="logo-img rounded-logo" />
              <span className="logo-text">Namma Ride!</span>
            </Link>
          </div>
          <nav className="nav">
            <ul>
              <li>
                <Link to="/" className={isActive('/')}>Home</Link>
              </li>
              <li>
                <Link to="/cars" className={isActive('/cars')}>Cars</Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link to="/bookings" className={isActive('/bookings')}>My Bookings</Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link to="/admin" className={isActive('/admin')}>Admin Dashboard</Link>
                    </li>
                  )}
                  <li className="user-menu">
                    <button className="user-menu-button">
                      <span className="user-icon">👤</span>
                      {user.name}
                    </button>
                    <div className="dropdown">
                      <Link to="/profile" className="dropdown-item">Profile</Link>
                      <button onClick={handleLogout} className="dropdown-item">Logout</button>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="btn btn-secondary">Login</Link>
                  </li>
                  <li>
                    <Link to="/register" className="btn btn-primary">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 