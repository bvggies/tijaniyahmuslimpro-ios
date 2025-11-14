import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';
import './ProfileScreen.css';

const ProfileScreen: React.FC = () => {
  const { authState, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: authState.user?.name || '',
    phone: authState.user?.phone || '',
    bio: '',
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        ...authState.user,
        ...formData,
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3F39 0%, #052F2A 100%)',
        paddingTop: '40px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '8px' }}>
          Profile
        </h1>
        <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
          Manage your account settings
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Profile Header */}
        <div className="card" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #11C48D 0%, #00BFA5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '40px',
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}>
            {authState.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '4px',
          }}>
            {authState.user?.name || 'User'}
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#BBE1D5',
            marginBottom: '16px',
          }}>
            {authState.user?.email || ''}
          </p>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Information */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '16px',
          }}>
            Personal Information
          </h3>

          {isEditing ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#BBE1D5',
                  marginBottom: '8px',
                }}>
                  Name
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#BBE1D5',
                  marginBottom: '8px',
                }}>
                  Phone
                </label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#BBE1D5',
                  marginBottom: '8px',
                }}>
                  Bio
                </label>
                <textarea
                  className="input"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  style={{
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: authState.user?.name || '',
                      phone: authState.user?.phone || '',
                      bio: '',
                    });
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#9E9E9E',
                  marginBottom: '4px',
                }}>
                  Name
                </p>
                <p style={{
                  fontSize: '16px',
                  color: '#E7F5F1',
                  fontWeight: '500',
                }}>
                  {authState.user?.name || 'Not set'}
                </p>
              </div>

              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#9E9E9E',
                  marginBottom: '4px',
                }}>
                  Email
                </p>
                <p style={{
                  fontSize: '16px',
                  color: '#E7F5F1',
                  fontWeight: '500',
                }}>
                  {authState.user?.email || 'Not set'}
                </p>
              </div>

              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#9E9E9E',
                  marginBottom: '4px',
                }}>
                  Phone
                </p>
                <p style={{
                  fontSize: '16px',
                  color: '#E7F5F1',
                  fontWeight: '500',
                }}>
                  {authState.user?.phone || 'Not set'}
                </p>
              </div>

              {authState.user?.location && (
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#9E9E9E',
                    marginBottom: '4px',
                  }}>
                    Location
                  </p>
                  <p style={{
                    fontSize: '16px',
                    color: '#E7F5F1',
                    fontWeight: '500',
                  }}>
                    {typeof authState.user.location === 'object'
                      ? `${authState.user.location.city}, ${authState.user.location.country}`
                      : authState.user.location}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '16px',
          }}>
            Account Settings
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            <button
              onClick={() => navigate('/settings')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                borderRadius: '8px',
                color: '#E7F5F1',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              <span>⚙️ Settings</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card" style={{
          border: '1px solid rgba(244, 67, 54, 0.3)',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#F44336',
            marginBottom: '16px',
          }}>
            Danger Zone
          </h3>

          <button
            onClick={handleLogout}
            className="btn"
            style={{
              background: 'rgba(244, 67, 54, 0.2)',
              color: '#F44336',
              border: '1px solid rgba(244, 67, 54, 0.5)',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

