import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginScreen.css';

const LoginScreen: React.FC = () => {
  const { login, authState, clearError, isAdmin, isModerator } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle admin redirect after successful login
  useEffect(() => {
    if (authState.isAuthenticated && authState.user && (isAdmin() || isModerator())) {
      console.log('🔄 Admin user logged in, redirecting to admin panel...');
      navigate('/admin');
    } else if (authState.isAuthenticated) {
      navigate('/');
    }
  }, [authState.isAuthenticated, authState.user, isAdmin, isModerator, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      // Navigation will be handled by the auth state change
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      alert('Email Required: Please enter your email address first');
      return;
    }
    alert(`A password reset link has been sent to ${email}`);
  };

  return (
    <div className="login-container">
      <div className="login-gradient">
        <div className="login-scroll-content">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo-container">
              <img src="/assets/images/appicon.png" alt="App Icon" className="login-logo" />
            </div>
            <h1 className="login-title">Tijaniyah Muslim Pro</h1>
            <p className="login-subtitle">Welcome back to your spiritual journey</p>
          </div>

          {/* Login Form */}
          <div className="login-form-container">
            <h2 className="login-form-title">Sign In</h2>
            
            {authState.error && (
              <div className="login-error-container">
                <span className="login-error-icon">⚠️</span>
                <span className="login-error-text">{authState.error}</span>
                <button onClick={clearError} className="login-error-close">×</button>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="login-input-container">
                <span className="login-input-icon">✉️</span>
                <input
                  type="email"
                  className="login-input"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>

              <div className="login-input-container">
                <span className="login-input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>

              <button
                type="button"
                className="login-forgot-password"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>

              <button
                type="submit"
                className={`login-button ${isLoading ? 'login-button-disabled' : ''}`}
                disabled={isLoading}
              >
                <div className="login-button-gradient">
                  {isLoading ? (
                    <span className="login-button-text">Signing In...</span>
                  ) : (
                    <>
                      <span>🔑</span>
                      <span className="login-button-text">Sign In</span>
                    </>
                  )}
                </div>
              </button>

              <div className="login-divider">
                <div className="login-divider-line"></div>
                <span className="login-divider-text">or</span>
                <div className="login-divider-line"></div>
              </div>

              <Link to="/register" className="login-register-button">
                <span className="login-register-text">
                  Don't have an account? <span className="login-register-text-bold">Sign Up</span>
                </span>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
