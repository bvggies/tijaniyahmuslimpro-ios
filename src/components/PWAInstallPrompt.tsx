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

    // Fallback: Only show manual instructions for iOS Safari (which doesn't support beforeinstallprompt)
    // For other browsers, wait longer to see if beforeinstallprompt fires
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        // Check if we're on iOS (Safari) - the only major browser that doesn't support beforeinstallprompt
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        // Only show fallback for iOS Safari (which doesn't support native install prompt)
        if (isIOS && isSafari) {
          console.log('📱 iOS Safari detected - showing manual install instructions');
          setShowFallback(true);
        } else {
          // For other browsers, show the prompt anyway (they might support it)
          // The button will trigger native prompt if available
          console.log('📱 Showing install prompt (native prompt may be available)');
          setShowPrompt(true);
        }
      }
    }, 5000); // Wait 5 seconds before showing fallback (give more time for beforeinstallprompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(fallbackTimer);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Use the native install prompt (Chrome, Edge, Opera, Samsung Internet, etc.)
      try {
        console.log('📱 Triggering native install prompt');
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        console.log('📱 User choice:', outcome);

        if (outcome === 'accepted') {
          console.log('📱 User accepted installation');
          setIsInstalled(true);
          setShowPrompt(false);
          setShowFallback(false);
        } else {
          // User dismissed the prompt
          console.log('📱 User dismissed installation');
          setShowPrompt(false);
          setShowFallback(false);
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Error showing install prompt:', error);
        // If native prompt fails, check if we're on iOS Safari
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        if (isIOS && isSafari) {
          // Show manual instructions for iOS Safari
          setShowFallback(true);
          setShowPrompt(false);
        } else {
          // For other browsers, just dismiss (they should have native prompt)
          setShowPrompt(false);
          setShowFallback(false);
        }
      }
    } else {
      // No deferredPrompt available - check if we're on iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      if (isIOS && isSafari) {
        // Show manual instructions for iOS Safari
        setShowFallback(true);
        setShowPrompt(false);
      } else {
        // For other browsers, the native prompt should be available
        // Try to trigger browser's native install UI
        console.log('📱 No deferredPrompt, but showing prompt anyway (browser may have native UI)');
        // The browser might show its own install UI when user clicks
        setShowPrompt(true);
      }
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
          {showFallback && !deferredPrompt ? (
            // Manual instructions - just show "Got It" button
            <button
              onClick={handleDismiss}
              className="pwa-install-button install"
              style={{ width: '100%' }}
            >
              Got It
            </button>
          ) : (
            // Native install button - always show "Install" button
            <>
              <button
                onClick={handleInstallClick}
                className="pwa-install-button install"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="pwa-install-button dismiss"
              >
                Not Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

