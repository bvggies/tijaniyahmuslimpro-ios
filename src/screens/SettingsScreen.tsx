import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';
import './SettingsScreen.css';

interface Settings {
  notifications: boolean;
  prayerNotifications: boolean;
  darkMode: boolean;
  timeFormat: '12h' | '24h';
  language: string;
  locationServices: boolean;
  autoLocation: boolean;
}

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    prayerNotifications: true,
    darkMode: false,
    timeFormat: '12h',
    language: 'en',
    locationServices: true,
    autoLocation: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = (newSettings: Settings) => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const updateSetting = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const clearCache = () => {
    if (window.confirm('This will clear all cached data. Continue?')) {
      // Clear specific cache items
      localStorage.removeItem('journal_entries_v2');
      localStorage.removeItem('prayer_times_cache');
      alert('Cache cleared successfully!');
    }
  };

  const resetSettings = () => {
    if (window.confirm('This will reset all settings to default. Continue?')) {
      const defaultSettings: Settings = {
        notifications: true,
        prayerNotifications: true,
        darkMode: false,
        timeFormat: '12h',
        language: 'en',
        locationServices: true,
        autoLocation: true,
      };
      saveSettings(defaultSettings);
      alert('Settings reset to default!');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3F39 0%, #052F2A 100%)',
        paddingTop: '40px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '8px' }}>
          ⚙️ Settings
        </h1>
        <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
          Manage your app preferences
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Notifications Section */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '16px',
          }}>
            🔔 Notifications
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <div>
              <p style={{ fontSize: '16px', color: '#E7F5F1', marginBottom: '4px' }}>
                Push Notifications
              </p>
              <p style={{ fontSize: '12px', color: '#BBE1D5' }}>
                Receive general app notifications
              </p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSetting('notifications', e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: settings.notifications ? '#00BFA5' : '#9E9E9E',
                borderRadius: '26px',
                transition: '0.3s',
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '20px',
                  width: '20px',
                  left: '3px',
                  bottom: '3px',
                  background: '#FFFFFF',
                  borderRadius: '50%',
                  transition: '0.3s',
                  transform: settings.notifications ? 'translateX(24px)' : 'translateX(0)',
                }} />
              </span>
            </label>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <p style={{ fontSize: '16px', color: '#E7F5F1', marginBottom: '4px' }}>
                Prayer Time Alerts
              </p>
              <p style={{ fontSize: '12px', color: '#BBE1D5' }}>
                Get notified when prayer times arrive
              </p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
              <input
                type="checkbox"
                checked={settings.prayerNotifications}
                onChange={(e) => updateSetting('prayerNotifications', e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: settings.prayerNotifications ? '#00BFA5' : '#9E9E9E',
                borderRadius: '26px',
                transition: '0.3s',
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '20px',
                  width: '20px',
                  left: '3px',
                  bottom: '3px',
                  background: '#FFFFFF',
                  borderRadius: '50%',
                  transition: '0.3s',
                  transform: settings.prayerNotifications ? 'translateX(24px)' : 'translateX(0)',
                }} />
              </span>
            </label>
          </div>
        </div>

        {/* Display & Language Section */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '16px',
          }}>
            🎨 Display & Language
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: '#BBE1D5', marginBottom: '8px' }}>
              Time Format
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => updateSetting('timeFormat', '12h')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: settings.timeFormat === '12h' ? '#00BFA5' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: settings.timeFormat === '12h' ? 'bold' : 'normal',
                }}
              >
                12h
              </button>
              <button
                onClick={() => updateSetting('timeFormat', '24h')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: settings.timeFormat === '24h' ? '#00BFA5' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: settings.timeFormat === '24h' ? 'bold' : 'normal',
                }}
              >
                24h
              </button>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '14px', color: '#BBE1D5', marginBottom: '8px' }}>
              Language
            </p>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="input-field"
            >
              <option value="en">English</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="fr">Français (French)</option>
              <option value="ha">Hausa</option>
            </select>
          </div>
        </div>

        {/* Location Services Section */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '16px',
          }}>
            📍 Location Services
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <div>
              <p style={{ fontSize: '16px', color: '#E7F5F1', marginBottom: '4px' }}>
                Location Services
              </p>
              <p style={{ fontSize: '12px', color: '#BBE1D5' }}>
                Allow app to access your location
              </p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
              <input
                type="checkbox"
                checked={settings.locationServices}
                onChange={(e) => updateSetting('locationServices', e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: settings.locationServices ? '#00BFA5' : '#9E9E9E',
                borderRadius: '26px',
                transition: '0.3s',
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '20px',
                  width: '20px',
                  left: '3px',
                  bottom: '3px',
                  background: '#FFFFFF',
                  borderRadius: '50%',
                  transition: '0.3s',
                  transform: settings.locationServices ? 'translateX(24px)' : 'translateX(0)',
                }} />
              </span>
            </label>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <p style={{ fontSize: '16px', color: '#E7F5F1', marginBottom: '4px' }}>
                Auto Location
              </p>
              <p style={{ fontSize: '12px', color: '#BBE1D5' }}>
                Automatically update location for prayer times
              </p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
              <input
                type="checkbox"
                checked={settings.autoLocation}
                onChange={(e) => updateSetting('autoLocation', e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: settings.autoLocation ? '#00BFA5' : '#9E9E9E',
                borderRadius: '26px',
                transition: '0.3s',
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '20px',
                  width: '20px',
                  left: '3px',
                  bottom: '3px',
                  background: '#FFFFFF',
                  borderRadius: '50%',
                  transition: '0.3s',
                  transform: settings.autoLocation ? 'translateX(24px)' : 'translateX(0)',
                }} />
              </span>
            </label>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '16px',
          }}>
            💾 Data Management
          </h2>

          <button
            onClick={clearCache}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#E7F5F1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>🗑️ Clear Cache</span>
            <span>→</span>
          </button>

          <button
            onClick={resetSettings}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#E7F5F1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>🔄 Reset to Default</span>
            <span>→</span>
          </button>
        </div>

        {/* App Information Section */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '16px',
          }}>
            ℹ️ App Information
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <span style={{ fontSize: '14px', color: '#BBE1D5' }}>Version</span>
            <span style={{ fontSize: '14px', color: '#E7F5F1', fontWeight: '500' }}>1.0.0</span>
          </div>

          <button
            onClick={() => window.open('https://tijaniyah.org', '_blank')}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#E7F5F1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>❓ Help & Support</span>
            <span>→</span>
          </button>

          <button
            onClick={() => window.open('/privacy', '_blank')}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#E7F5F1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>🔒 Privacy Policy</span>
            <span>→</span>
          </button>

          <button
            onClick={() => window.open('/terms', '_blank')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#E7F5F1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>📄 Terms of Service</span>
            <span>→</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(244, 67, 54, 0.2)',
            border: '2px solid #F44336',
            color: '#F44336',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '20px',
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;

