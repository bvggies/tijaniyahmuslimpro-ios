import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash for 3 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade out animation to complete
      setTimeout(() => {
        onFinish();
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`splash-screen ${fadeOut ? 'splash-fade-out' : ''}`}>
      <div className="splash-container">
        <div className="splash-logo-container">
          <img 
            src="/assets/images/appicon.png" 
            alt="Tijaniyah Muslim Pro" 
            className="splash-logo"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="splash-logo-fallback">🕌</div>';
              }
            }}
          />
        </div>
        <h1 className="splash-app-name">Tijaniyah Muslim Pro</h1>
        <div className="splash-loader">
          <div className="splash-spinner"></div>
        </div>
        <p className="splash-loading-text">Loading your spiritual journey...</p>
      </div>
    </div>
  );
};

export default SplashScreen;

