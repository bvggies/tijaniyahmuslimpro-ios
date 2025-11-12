import React, { useState, useEffect } from 'react';
import './NotificationSettingsScreen.css';

interface NotificationSettings {
  prayerNotifications: boolean;
  reminderNotifications: boolean;
  reminderTime: string;
  reminderTypes: {
    quranReading: boolean;
    dhikr: boolean;
    dua: boolean;
    fasting: boolean;
  };
}

const NotificationSettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notification_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          prayerNotifications: true,
          reminderNotifications: true,
          reminderTime: '08:00',
          reminderTypes: {
            quranReading: true,
            dhikr: true,
            dua: true,
            fasting: false,
          },
        };
      }
    }
    return {
      prayerNotifications: true,
      reminderNotifications: true,
      reminderTime: '08:00',
      reminderTypes: {
        quranReading: true,
        dhikr: true,
        dua: true,
        fasting: false,
      },
    };
  });

  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionsGranted(Notification.permission === 'granted');
    }
  }, []);

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notification_settings', JSON.stringify(newSettings));
  };

  const updateReminderType = (type: keyof NotificationSettings['reminderTypes'], value: boolean) => {
    const newSettings = {
      ...settings,
      reminderTypes: {
        ...settings.reminderTypes,
        [type]: value,
      },
    };
    setSettings(newSettings);
    localStorage.setItem('notification_settings', JSON.stringify(newSettings));
  };

  const requestPermissions = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionsGranted(permission === 'granted');
      if (permission !== 'granted') {
        alert('Permission Required\nPlease grant notification permissions in your browser settings.');
      }
    } else {
      alert('Not Supported\nNotifications are not supported in this browser.');
    }
  };

  const sendTestNotification = () => {
    if (permissionsGranted && 'Notification' in window) {
      new Notification('Test Notification', {
        body: 'This is a test notification from Tijaniyah Muslim Pro',
        icon: '/assets/images/appicon.png',
      });
    }
  };

  const handleTestNotification = () => {
    if (!permissionsGranted) {
      window.alert('Permissions Required\nPlease grant notification permissions to test notifications.');
      requestPermissions();
      return;
    }
    sendTestNotification();
  };

  const ToggleRow: React.FC<{
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    icon: string;
  }> = ({ title, subtitle, value, onValueChange, icon }) => (
    <div className="notification-toggle-row">
      <div className="notification-toggle-left">
        <span className="notification-toggle-icon">{icon}</span>
        <div className="notification-toggle-text">
          <p className="notification-toggle-title">{title}</p>
          {subtitle && <p className="notification-toggle-subtitle">{subtitle}</p>}
        </div>
      </div>
      <label className="notification-switch">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onValueChange(e.target.checked)}
        />
        <span className="notification-slider"></span>
      </label>
    </div>
  );

  return (
    <div className="notification-settings-container">
      <div className="notification-settings-header">
        <h1 className="notification-settings-header-title">Notification Settings</h1>
        <p className="notification-settings-header-subtitle">
          Customize your Islamic reminders and prayer notifications
        </p>
      </div>

      {/* Permissions Status */}
      <div className="notification-setting-card">
        <h2 className="notification-card-title">Permissions</h2>
        <div className="notification-permission-status">
          <span className="notification-permission-icon">
            {permissionsGranted ? '✓' : '✗'}
          </span>
          <span className={`notification-permission-text ${permissionsGranted ? 'notification-permission-granted' : 'notification-permission-denied'}`}>
            {permissionsGranted ? 'Notifications Enabled' : 'Notifications Disabled'}
          </span>
        </div>
        {!permissionsGranted && (
          <button className="notification-permission-button" onClick={requestPermissions}>
            Enable Notifications
          </button>
        )}
      </div>

      {/* Prayer Notifications */}
      <div className="notification-setting-card">
        <h2 className="notification-card-title">Prayer Notifications</h2>
        <ToggleRow
          title="Prayer Time Alerts"
          subtitle="Get notified when it's time for prayer"
          value={settings.prayerNotifications}
          onValueChange={(value) => updateSetting('prayerNotifications', value)}
          icon="🕐"
        />
      </div>

      {/* Daily Reminders */}
      <div className="notification-setting-card">
        <h2 className="notification-card-title">Daily Reminders</h2>
        <ToggleRow
          title="Daily Islamic Reminders"
          subtitle="Receive daily reminders for spiritual practices"
          value={settings.reminderNotifications}
          onValueChange={(value) => updateSetting('reminderNotifications', value)}
          icon="🔔"
        />

        {settings.reminderNotifications && (
          <>
            <div className="notification-time-picker">
              <label className="notification-time-label">Reminder Time</label>
              <input
                type="time"
                className="notification-time-input"
                value={settings.reminderTime}
                onChange={(e) => updateSetting('reminderTime', e.target.value)}
              />
            </div>

            <div className="notification-reminder-types">
              <p className="notification-reminder-types-title">Reminder Types</p>
              
              <ToggleRow
                title="Quran Reading"
                subtitle="Daily reminder to read the Holy Quran"
                value={settings.reminderTypes.quranReading}
                onValueChange={(value) => updateReminderType('quranReading', value)}
                icon="📖"
              />

              <ToggleRow
                title="Dhikr"
                subtitle="Reminder for remembrance of Allah"
                value={settings.reminderTypes.dhikr}
                onValueChange={(value) => updateReminderType('dhikr', value)}
                icon="❤️"
              />

              <ToggleRow
                title="Dua"
                subtitle="Reminder for supplications"
                value={settings.reminderTypes.dua}
                onValueChange={(value) => updateReminderType('dua', value)}
                icon="🤲"
              />

              <ToggleRow
                title="Fasting"
                subtitle="Reminder for voluntary fasting"
                value={settings.reminderTypes.fasting}
                onValueChange={(value) => updateReminderType('fasting', value)}
                icon="🌙"
              />
            </div>
          </>
        )}
      </div>

      {/* Test Notification */}
      <div className="notification-setting-card">
        <h2 className="notification-card-title">Test Notifications</h2>
        <button className="notification-test-button" onClick={handleTestNotification}>
          Send Test Notification
        </button>
      </div>
    </div>
  );
};

export default NotificationSettingsScreen;

