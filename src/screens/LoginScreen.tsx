import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, authState, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) {
      if (isAdmin() || isModerator()) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [authState.isAuthenticated, isAdmin, isModerator, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#11C48D' }}>
            Login
          </h2>

          {authState.error && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#F44336', 
              borderRadius: '8px', 
              marginBottom: '16px',
              color: '#FFFFFF'
            }}>
              {authState.error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#BBE1D5' }}>
                Email
              </label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#BBE1D5' }}>
                Password
              </label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '16px' }}
              disabled={authState.isLoading}
            >
              {authState.isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ color: '#BBE1D5', marginBottom: '8px' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#11C48D' }}>
                Register
              </Link>
            </p>
            <Link to="/guest" style={{ color: '#11C48D' }}>
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

