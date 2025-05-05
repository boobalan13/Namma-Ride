import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateDetails, updatePassword } from '../services/api';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [detailsForm, setDetailsForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetailsForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateDetails(detailsForm);
      setUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile'
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update password'
      });
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>Profile Settings</h1>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-sections">
          {/* Personal Details Section */}
          <section className="profile-section">
            <h2>Personal Details</h2>
            <form onSubmit={handleDetailsSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={detailsForm.name}
                  onChange={handleDetailsChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={detailsForm.email}
                  onChange={handleDetailsChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={detailsForm.phone}
                  onChange={handleDetailsChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Update Details
              </button>
            </form>
          </section>

          {/* Change Password Section */}
          <section className="profile-section">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile; 