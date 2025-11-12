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

    // Detect iOS immediately
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS|OPiOS/.test(navigator.userAgent);
    const isIOSDevice = isIOS && isSafari;

    // For iOS Safari, show prompt immediately (no waiting)
    if (isIOSDevice) {
      console.log('📱 iOS Safari detected - showing install instructions immediately');
      // Small delay to ensure page is loaded
      setTimeout(() => {
        setShowFallback(true);
      }, 1000);
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
      // Hide fallback if it was shown
      setShowFallback(false);
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

    // Fallback for non-iOS browsers: wait a bit to see if beforeinstallprompt fires
    let fallbackTimer: NodeJS.Timeout | null = null;
    if (!isIOSDevice) {
      fallbackTimer = setTimeout(() => {
        setShowPrompt((prevShow) => {
          if (!deferredPrompt && !isInstalled && !prevShow) {
            console.log('📱 Showing install prompt (native prompt may be available)');
            return true;
          }
          return prevShow;
        });
      }, 3000); // Wait 3 seconds for beforeinstallprompt
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
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
  const isIPad = /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">📱</div>
        <div className="pwa-install-text">
          <h3>Install Tijaniyah Muslim Pro</h3>
          {showFallback && !deferredPrompt ? (
            <div className="pwa-install-instructions">
              {isIOS ? (
                <div>
                  <p style={{ marginBottom: '12px', fontWeight: 600 }}>Follow these steps:</p>
                  <ol style={{ textAlign: 'left', paddingLeft: '20px', margin: 0, fontSize: '13px', lineHeight: '1.8' }}>
                    <li>Tap the <strong>Share</strong> button <span style={{ fontSize: '18px', verticalAlign: 'middle' }}>⎋</span> at the bottom of your screen</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                    <li>Tap <strong>"Add"</strong> in the top right corner</li>
                  </ol>
                  {isIPad && (
                    <p style={{ marginTop: '12px', fontSize: '12px', fontStyle: 'italic' }}>
                      On iPad, the Share button is at the top of the screen
                    </p>
                  )}
                </div>
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
            // Manual instructions - show "Got It" button
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

