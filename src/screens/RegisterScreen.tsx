import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    setIsLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone.trim() || undefined,
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
    <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '40px' }}>
        <h2 style={{ color: '#E7F5F1', textAlign: 'center', marginBottom: '30px' }}>Create Account</h2>
        <p style={{ color: '#BBE1D5', textAlign: 'center', marginBottom: '30px' }}>Join the Tijaniyah community</p>
        
        {authState.error && (
          <div style={{ padding: '12px', background: 'rgba(244, 67, 54, 0.2)', borderRadius: '8px', marginBottom: '20px', color: '#F44336' }}>
            {authState.error}
            <button onClick={clearError} style={{ float: 'right', background: 'none', border: 'none', color: '#F44336', cursor: 'pointer' }}>×</button>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="tel"
            placeholder="Phone (Optional)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password *"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="City (Optional)"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Country (Optional)"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="input-field"
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '20px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#BBE1D5' }}>
          Already have an account? <Link to="/login" style={{ color: '#11C48D', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;

