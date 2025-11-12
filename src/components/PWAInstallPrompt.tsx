import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PWAInstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Hide on login/register pages
  const hideNavPaths = ['/login', '/register'];
  const shouldHide = hideNavPaths.includes(location.pathname);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode (PWA installed)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }

      // Check if running from home screen on iOS
      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return true;
      }

      return false;
    };

    if (checkIfInstalled()) {
      return;
    }

    // Check if user dismissed in the last 24 hours
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    if (dismissedTime) {
      const hoursSinceDismissal = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
      if (hoursSinceDismissal < 24) {
        return;
      }
    }

    // Listen for the beforeinstallprompt event (Chrome, Edge, Opera, Samsung Internet)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('📱 beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show our custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was just installed
    window.addEventListener('appinstalled', () => {
      console.log('📱 App installed');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      setShowFallback(false);
    });

    // Fallback: Show prompt after a delay if beforeinstallprompt doesn't fire
    // This helps with browsers that don't support the event (Safari, Firefox)
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        // Check if we're on a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // Check if we're on iOS (Safari)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        // Check if we're on Android Chrome
        const isAndroidChrome = /Android/.test(navigator.userAgent) && /Chrome/.test(navigator.userAgent);
        
        // Show fallback for mobile devices or if beforeinstallprompt hasn't fired
        if (isMobile || isIOS || isAndroidChrome) {
          console.log('📱 Showing fallback install prompt');
          setShowFallback(true);
        }
      }
    }, 3000); // Wait 3 seconds before showing fallback

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(fallbackTimer);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Use the native install prompt (Chrome, Edge, etc.)
      try {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          setIsInstalled(true);
          setShowPrompt(false);
          setShowFallback(false);
        } else {
          // User dismissed the prompt
          setShowPrompt(false);
          setShowFallback(false);
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Error showing install prompt:', error);
        // Fallback to manual instructions
        setShowFallback(true);
        setShowPrompt(false);
      }
    } else {
      // Fallback: Show manual installation instructions
      setShowFallback(true);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowFallback(false);
    // Store dismissal in localStorage to avoid showing again for this session
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or on login/register pages
  if (isInstalled || shouldHide) {
    return null;
  }

  // Check if user dismissed in the last 24 hours
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime) {
    const hoursSinceDismissal = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
    if (hoursSinceDismissal < 24) {
      return null;
    }
  }

  // Show prompt if we have deferredPrompt or fallback
  if (!showPrompt && !showFallback) {
    return null;
  }

  // Detect device type for instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">📱</div>
        <div className="pwa-install-text">
          <h3>Install Tijaniyah Muslim Pro</h3>
          {showFallback && !deferredPrompt ? (
            <div style={{ fontSize: '12px', marginTop: '8px', color: '#BBE1D5' }}>
              {isIOS ? (
                <p>Tap the Share button <span style={{ fontSize: '16px' }}>⎋</span> and select "Add to Home Screen"</p>
              ) : isAndroid ? (
                <p>Tap the menu <span style={{ fontSize: '16px' }}>⋮</span> and select "Install app" or "Add to Home screen"</p>
              ) : (
                <p>Use your browser's menu to install this app</p>
              )}
            </div>
          ) : (
            <p>Add to your home screen for a better experience</p>
          )}
        </div>
        <div className="pwa-install-buttons">
          {deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              className="pwa-install-button install"
            >
              Install
            </button>
          ) : (
            <button
              onClick={handleDismiss}
              className="pwa-install-button install"
              style={{ width: '100%' }}
            >
              Got It
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="pwa-install-button dismiss"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

