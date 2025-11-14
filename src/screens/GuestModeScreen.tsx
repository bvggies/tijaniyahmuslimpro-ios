import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../utils/theme';
import './GuestModeScreen.css';

export default function GuestModeScreen() {
  const { continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleContinueAsGuest = () => {
    continueAsGuest();
    navigate('/');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const limitedFeatures = [
    {
      title: 'Prayer Times',
      description: 'View basic prayer times',
      icon: '⏰',
      available: true,
    },
    {
      title: 'Qibla Compass',
      description: 'Find direction to Kaaba',
      icon: '🧭',
      available: true,
    },
    {
      title: 'Duas & Supplications',
      description: 'Read Islamic prayers',
      icon: '📖',
      available: true,
    },
    {
      title: 'Quran Reader',
      description: 'Read Holy Quran',
      icon: '📚',
      available: true,
    },
    {
      title: 'Digital Tasbih',
      description: 'Count dhikr',
      icon: '📿',
      available: true,
    },
    {
      title: 'Islamic Journal',
      description: 'Personal reflections',
      icon: '📝',
      available: false,
      reason: 'Requires account',
    },
    {
      title: 'Community',
      description: 'Connect with Muslims',
      icon: '👥',
      available: false,
      reason: 'Requires account',
    },
    {
      title: 'AI Noor',
      description: 'AI Islamic assistant',
      icon: '🤖',
      available: false,
      reason: 'Requires account',
    },
    {
      title: 'Makkah Live',
      description: 'Live streams from Kaaba',
      icon: '📹',
      available: false,
      reason: 'Requires account',
    },
  ];

  return (
    <div className="guest-mode-container">
      <div className="guest-mode-gradient">
        <div className="guest-mode-scroll-content">
          {/* Header */}
          <div className="guest-mode-header">
            <div className="guest-mode-logo-container">
              <div className="guest-mode-logo">🕌</div>
            </div>
            <h1 className="guest-mode-title">Welcome to Tijaniyah Muslim Pro</h1>
            <p className="guest-mode-subtitle">Explore Islamic features as a guest</p>
          </div>

          {/* Guest Benefits */}
          <div className="guest-mode-benefits-card">
            <h2 className="guest-mode-benefits-title">What you can access as a guest:</h2>
            <div className="guest-mode-benefits-list">
              <div className="guest-mode-benefit-item">
                <span className="guest-mode-check-icon">✓</span>
                <span className="guest-mode-benefit-text">Prayer times and Qibla direction</span>
              </div>
              <div className="guest-mode-benefit-item">
                <span className="guest-mode-check-icon">✓</span>
                <span className="guest-mode-benefit-text">Read Duas and Quran</span>
              </div>
              <div className="guest-mode-benefit-item">
                <span className="guest-mode-check-icon">✓</span>
                <span className="guest-mode-benefit-text">Use Digital Tasbih</span>
              </div>
              <div className="guest-mode-benefit-item">
                <span className="guest-mode-check-icon">✓</span>
                <span className="guest-mode-benefit-text">Basic Islamic resources</span>
              </div>
            </div>
          </div>

          {/* Limited Features Preview */}
          <div className="guest-mode-features-section">
            <h2 className="guest-mode-section-title">Available Features</h2>
            {limitedFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`guest-mode-feature-card ${!feature.available ? 'guest-mode-feature-card-disabled' : ''}`}
              >
                <div className="guest-mode-feature-icon">{feature.icon}</div>
                <div className="guest-mode-feature-content">
                  <h3 className={`guest-mode-feature-title ${!feature.available ? 'guest-mode-feature-title-disabled' : ''}`}>
                    {feature.title}
                  </h3>
                  <p className={`guest-mode-feature-description ${!feature.available ? 'guest-mode-feature-description-disabled' : ''}`}>
                    {feature.description}
                  </p>
                  {!feature.available && (
                    <p className="guest-mode-feature-reason">{feature.reason}</p>
                  )}
                </div>
                {feature.available ? (
                  <span className="guest-mode-check-icon">✓</span>
                ) : (
                  <span className="guest-mode-lock-icon">🔒</span>
                )}
              </div>
            ))}
          </div>

          {/* Upgrade Benefits */}
          <div className="guest-mode-upgrade-card">
            <h2 className="guest-mode-upgrade-title">Unlock Full Features</h2>
            <p className="guest-mode-upgrade-subtitle">Create a free account to access:</p>
            <div className="guest-mode-upgrade-list">
              <div className="guest-mode-upgrade-item">
                <span className="guest-mode-star-icon">⭐</span>
                <span className="guest-mode-upgrade-text">Personal Islamic Journal</span>
              </div>
              <div className="guest-mode-upgrade-item">
                <span className="guest-mode-star-icon">⭐</span>
                <span className="guest-mode-upgrade-text">Community Features</span>
              </div>
              <div className="guest-mode-upgrade-item">
                <span className="guest-mode-star-icon">⭐</span>
                <span className="guest-mode-upgrade-text">AI Noor Assistant</span>
              </div>
              <div className="guest-mode-upgrade-item">
                <span className="guest-mode-star-icon">⭐</span>
                <span className="guest-mode-upgrade-text">Makkah Live Streams</span>
              </div>
              <div className="guest-mode-upgrade-item">
                <span className="guest-mode-star-icon">⭐</span>
                <span className="guest-mode-upgrade-text">Personalized Settings</span>
              </div>
              <div className="guest-mode-upgrade-item">
                <span className="guest-mode-star-icon">⭐</span>
                <span className="guest-mode-upgrade-text">Progress Tracking</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="guest-mode-action-buttons">
            <button className="guest-mode-guest-button" onClick={handleContinueAsGuest}>
              <span className="guest-mode-button-icon">👁️</span>
              <span className="guest-mode-button-text">Continue as Guest</span>
            </button>

            <button className="guest-mode-sign-up-button" onClick={handleSignUp}>
              <span className="guest-mode-button-icon">➕</span>
              <span className="guest-mode-button-text">Create Free Account</span>
            </button>

            <button className="guest-mode-sign-in-button" onClick={handleSignIn}>
              Already have an account? <span className="guest-mode-sign-in-text-bold">Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

