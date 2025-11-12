import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../utils/theme';
import './UpgradePrompt.css';

interface UpgradePromptProps {
  visible: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onSignIn: () => void;
  feature: string;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ visible, onClose, onSignUp, onSignIn, feature }) => {
  if (!visible) return null;

  return (
    <div className="upgrade-prompt-overlay" onClick={onClose}>
      <div className="upgrade-prompt-container" onClick={(e) => e.stopPropagation()}>
        <div className="upgrade-prompt-header">
          <div className="upgrade-prompt-icon-container">
            <img src="/assets/images/appicon.png" alt="App Icon" className="upgrade-prompt-logo" />
            <div className="upgrade-prompt-lock-overlay">
              <span>🔒</span>
            </div>
          </div>
          <h2 className="upgrade-prompt-title">Upgrade Required</h2>
          <p className="upgrade-prompt-subtitle">
            {feature} requires a free account to access
          </p>
        </div>

        <div className="upgrade-prompt-benefits">
          <h3 className="upgrade-prompt-benefits-title">Unlock with a free account:</h3>
          <div className="upgrade-prompt-benefit-item">
            <span>✓</span>
            <span>Personal Islamic Journal</span>
          </div>
          <div className="upgrade-prompt-benefit-item">
            <span>✓</span>
            <span>Community Features</span>
          </div>
          <div className="upgrade-prompt-benefit-item">
            <span>✓</span>
            <span>AI Noor Assistant</span>
          </div>
          <div className="upgrade-prompt-benefit-item">
            <span>✓</span>
            <span>Makkah Live Streams</span>
          </div>
          <div className="upgrade-prompt-benefit-item">
            <span>✓</span>
            <span>Progress Tracking</span>
          </div>
        </div>

        <div className="upgrade-prompt-actions">
          <button className="upgrade-prompt-signup-button" onClick={onSignUp}>
            <span>👤</span>
            <span>Create Free Account</span>
          </button>

          <button className="upgrade-prompt-signin-button" onClick={onSignIn}>
            Already have an account? <strong>Sign In</strong>
          </button>

          <button className="upgrade-prompt-cancel-button" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;

