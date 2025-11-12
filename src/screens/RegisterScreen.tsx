import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileAvatar from '../components/ProfileAvatar';
import CountryPicker from '../components/CountryPicker';
import { colors } from '../utils/theme';
import './RegisterScreen.css';

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { register, authState, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    country: '',
  });
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = (imageUri: string) => {
    setProfilePicture(imageUri);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone.trim() || undefined,
        profilePicture: profilePicture,
        location: (formData.city.trim() || formData.country.trim()) ? {
          city: formData.city.trim(),
          country: formData.country.trim(),
        } : undefined,
      });
      navigate('/');
    } catch (error) {
      // Error handled by context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-gradient">
        <div className="register-scroll-content">
          {/* Header */}
          <div className="register-header">
            <button className="register-back-button" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="register-logo-container">
              <img src="/assets/images/appicon.png" alt="App Icon" className="register-logo" />
            </div>
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Join the Tijaniyah community</p>
          </div>

          {/* Registration Form */}
          <div className="register-form-container">
            <h2 className="register-form-title">Sign Up</h2>
            
            {/* Profile Picture */}
            <div className="register-profile-picture-container">
              <p className="register-profile-picture-label">Profile Picture (Optional)</p>
              <ProfileAvatar 
                profilePicture={profilePicture}
                name={formData.name}
                size={80}
                showBorder={true}
                editable={true}
                onImageChange={handleProfilePictureChange}
              />
            </div>
            
            {authState.error && (
              <div className="register-error-container">
                <span className="register-error-icon">⚠️</span>
                <span className="register-error-text">{authState.error}</span>
                <button onClick={clearError} className="register-error-close">×</button>
              </div>
            )}

            <form onSubmit={handleRegister}>
              {/* Name */}
              <div className="register-input-container">
                <span className="register-input-icon">👤</span>
                <input
                  type="text"
                  className="register-input"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  autoCapitalize="words"
                  autoCorrect="off"
                />
              </div>

              {/* Email */}
              <div className="register-input-container">
                <span className="register-input-icon">✉️</span>
                <input
                  type="email"
                  className="register-input"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>

              {/* Phone */}
              <div className="register-input-container">
                <span className="register-input-icon">📞</span>
                <input
                  type="tel"
                  className="register-input"
                  placeholder="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  autoCorrect="off"
                />
              </div>

              {/* Location */}
              <div className="register-location-row">
                <div className="register-input-container register-location-input">
                  <span className="register-input-icon">📍</span>
                  <input
                    type="text"
                    className="register-input"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    autoCapitalize="words"
                    autoCorrect="off"
                  />
                </div>
                <div className="register-input-container register-location-input">
                  <span className="register-input-icon">🌍</span>
                  <div style={{ flex: 1, padding: '16px 0' }}>
                    <CountryPicker
                      selectedCountry={formData.country}
                      onCountrySelect={(country) => updateField('country', country)}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="register-input-container">
                <span className="register-input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="register-input"
                  placeholder="Password *"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="register-input-container">
                <span className="register-input-icon">🔒</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="register-input"
                  placeholder="Confirm Password *"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>

              {/* Terms */}
              <div className="register-terms-container">
                <p className="register-terms-text">
                  By creating an account, you agree to our{' '}
                  <span className="register-terms-link">Terms of Service</span>
                  {' '}and{' '}
                  <span className="register-terms-link">Privacy Policy</span>
                </p>
              </div>

              <button
                type="submit"
                className={`register-button ${isLoading ? 'register-button-disabled' : ''}`}
                disabled={isLoading}
              >
                <div className="register-button-gradient">
                  {isLoading ? (
                    <span className="register-button-text">Creating Account...</span>
                  ) : (
                    <>
                      <span>➕</span>
                      <span className="register-button-text">Create Account</span>
                    </>
                  )}
                </div>
              </button>

              <div className="register-divider">
                <div className="register-divider-line"></div>
                <span className="register-divider-text">or</span>
                <div className="register-divider-line"></div>
              </div>

              <Link to="/login" className="register-login-button">
                <span className="register-login-text">
                  Already have an account? <span className="register-login-text-bold">Sign In</span>
                </span>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
