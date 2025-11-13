import React, { useState, useEffect } from 'react';
import { getPrayerTimes, updatePrayerCountdowns, PrayerTime } from '../services/prayerService';
import LocationService, { LocationData } from '../services/locationService';
import { getCurrentIslamicDate } from '../services/islamicCalendarService';
import { useTimeFormat } from '../contexts/TimeFormatContext';
import IslamicBackground from '../components/IslamicBackground';
import { colors } from '../utils/theme';
import './PrayerTimesScreen.css';

const PrayerTimesScreen: React.FC = () => {
  const { timeFormat } = useTimeFormat();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timezone, setTimezone] = useState<string>('');
  const [hijriDisplay, setHijriDisplay] = useState<string>('');

  useEffect(() => {
    loadPrayerTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFormat]);

  // Real-time countdown updates
  useEffect(() => {
    if (prayerTimes.length === 0) return;
    
    const interval = setInterval(() => {
      setPrayerTimes(prevPrayerTimes => {
        if (prevPrayerTimes.length > 0) {
          return updatePrayerCountdowns(prevPrayerTimes, timeFormat);
        }
        return prevPrayerTimes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes.length, timeFormat]);

  const loadPrayerTimes = async () => {
    try {
      setLoading(true);
      
      const locationService = LocationService.getInstance();
      const userLocation = await locationService.getUserLocation();
      
      if (!userLocation) {
        // Fallback to Makkah coordinates
        const fallbackLocation: LocationData = {
          latitude: 21.3891,
          longitude: 39.8579,
          city: 'Makkah',
          country: 'Saudi Arabia',
        };
        setCurrentLocation(fallbackLocation);
        setTimezone('Asia/Riyadh');
        
        const times = await getPrayerTimes(fallbackLocation.latitude, fallbackLocation.longitude, timeFormat);
        setPrayerTimes(times);
        return;
      }

      setCurrentLocation({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        city: userLocation.city,
        country: userLocation.country,
      });
      setTimezone(userLocation.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);

      const times = await getPrayerTimes(userLocation.latitude, userLocation.longitude, timeFormat);
      setPrayerTimes(times);

      // Get Islamic date
      const islamic = getCurrentIslamicDate(userLocation.latitude, userLocation.longitude);
      setHijriDisplay(islamic.hijriDate);
    } catch (error) {
      console.error('Error loading prayer times:', error);
      
      // Try fallback to Makkah
      try {
        const fallbackLocation: LocationData = {
          latitude: 21.3891,
          longitude: 39.8579,
          city: 'Makkah',
          country: 'Saudi Arabia',
        };
        setCurrentLocation(fallbackLocation);
        setTimezone('Asia/Riyadh');
        
        const times = await getPrayerTimes(fallbackLocation.latitude, fallbackLocation.longitude, timeFormat);
        setPrayerTimes(times);
        
        const islamic = getCurrentIslamicDate(fallbackLocation.latitude, fallbackLocation.longitude);
        setHijriDisplay(islamic.hijriDate);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        alert('Failed to load prayer times. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrayerTimes();
    setRefreshing(false);
  };

  const getTimeUntilNextPrayer = (prayerTime: string): string => {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    
    if (prayerDate <= now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }
    
    const diff = prayerDate.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m`;
    } else {
      return `${minutesLeft}m`;
    }
  };

  const getNextPrayerSummary = () => {
    const next = prayerTimes.find(p => p.isNext);
    if (!next) return null;
    return { name: next.name, time: next.time, until: getTimeUntilNextPrayer(next.time) };
  };

  const getPrayerIcon = (prayerName: string): string => {
    switch (prayerName.toLowerCase()) {
      case 'fajr':
      case 'dhuhr':
        return '☀️';
      case 'asr':
      case 'maghrib':
        return '🌅';
      case 'isha':
        return '🌙';
      default:
        return '🕐';
    }
  };

  const getPrayerColor = (prayerName: string): string => {
    switch (prayerName.toLowerCase()) {
      case 'fajr':
        return '#FF6B35';
      case 'dhuhr':
        return '#FFD23F';
      case 'asr':
        return '#06FFA5';
      case 'maghrib':
        return '#3A86FF';
      case 'isha':
        return '#7209B7';
      default:
        return colors.accentTeal;
    }
  };

  const getNextPrayer = (): PrayerTime | null => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const prayer of prayerTimes) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      
      if (prayerTime > currentTime) {
        return prayer;
      }
    }
    
    // If no prayer found for today, return the first prayer of tomorrow (Fajr)
    return prayerTimes[0] || null;
  };

  const getPrayerNameArabic = (name: string): string => {
    switch (name) {
      case 'Fajr':
        return 'الفجر';
      case 'Dhuhr':
        return 'الظهر';
      case 'Asr':
        return 'العصر';
      case 'Maghrib':
        return 'المغرب';
      case 'Isha':
        return 'العشاء';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <IslamicBackground>
        <div className="prayer-times-loading">
          <div className="spinner"></div>
          <p>Loading prayer times...</p>
        </div>
      </IslamicBackground>
    );
  }

  const nextPrayer = getNextPrayer();
  const nextPrayerSummary = getNextPrayerSummary();

  return (
    <IslamicBackground>
      <div className="prayer-times-container">
        {/* Header */}
        <div className="prayer-times-header">
          <div className="prayer-times-header-content">
            <div>
              <h1 className="prayer-times-title">Prayer Times</h1>
              <p className="prayer-times-subtitle">
                {currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : 'Loading...'}
              </p>
              {hijriDisplay && (
                <div className="prayer-times-date-container">
                  <p className="prayer-times-date-subtle">{hijriDisplay}</p>
                  <p className="prayer-times-date-subtle">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}
            </div>
            <button
              className="prayer-times-refresh-button"
              onClick={onRefresh}
              disabled={refreshing}
            >
              🔄
            </button>
          </div>

          {/* Next Prayer Summary */}
          {nextPrayerSummary && (
            <div className="prayer-times-next-summary">
              <span className="prayer-times-next-summary-icon">🕐</span>
              <div className="prayer-times-next-summary-content">
                <p className="prayer-times-next-summary-title">
                  Next Prayer: {nextPrayerSummary.name}
                </p>
                <p className="prayer-times-next-summary-details">
                  {nextPrayerSummary.time} • in {nextPrayerSummary.until}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Next Prayer Display */}
        {nextPrayer && (
          <div className="prayer-times-next-prayer-card">
            <div className="prayer-times-next-prayer-content">
              <div className="prayer-times-next-prayer-icon">
                {getPrayerIcon(nextPrayer.name)}
              </div>
              <div className="prayer-times-next-prayer-info">
                <p className="prayer-times-next-prayer-label">Next Prayer</p>
                <p className="prayer-times-next-prayer-label-arabic">الصلاة القادمة</p>
                <h2 className="prayer-times-next-prayer-name">{nextPrayer.name}</h2>
                <p className="prayer-times-next-prayer-name-arabic">
                  {getPrayerNameArabic(nextPrayer.name)}
                </p>
                <p className="prayer-times-next-prayer-time">{nextPrayer.time}</p>
                {nextPrayer.countdown && (
                  <p className="prayer-times-next-prayer-countdown">
                    <span className="prayer-times-countdown-label">in </span>
                    <span className="prayer-times-countdown-time">{getTimeUntilNextPrayer(nextPrayer.time)}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Prayer Times List */}
        <div className="prayer-times-list">
          {prayerTimes.map((prayer) => {
            const prayerColor = getPrayerColor(prayer.name);
            const isCurrent = prayer.isCurrent;
            
            return (
              <div
                key={prayer.name}
                className={`prayer-times-card ${isCurrent ? 'prayer-times-card-current' : ''}`}
                style={{
                  background: isCurrent 
                    ? `linear-gradient(135deg, ${prayerColor} 0%, ${prayerColor}CC 100%)`
                    : undefined,
                }}
              >
                <div className="prayer-times-card-content">
                  <div 
                    className="prayer-times-icon-container"
                    style={{
                      backgroundColor: isCurrent ? 'rgba(255,255,255,0.2)' : `${prayerColor}33`,
                    }}
                  >
                    {getPrayerIcon(prayer.name)}
                  </div>

                  <div className="prayer-times-info">
                    <div className="prayer-times-name-container">
                      <p className={`prayer-times-name ${isCurrent ? 'prayer-times-name-current' : ''}`}>
                        {prayer.name}
                      </p>
                      <p className={`prayer-times-name-arabic ${isCurrent ? 'prayer-times-name-arabic-current' : ''}`}>
                        {getPrayerNameArabic(prayer.name)}
                      </p>
                    </div>
                    <div className="prayer-times-time-container">
                      <p className={`prayer-times-time ${isCurrent ? 'prayer-times-time-current' : ''}`}>
                        {prayer.timeWithSeconds || prayer.time}
                      </p>
                      {prayer.isNext && prayer.countdown && (
                        <p className="prayer-times-countdown">{prayer.countdown}</p>
                      )}
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="prayer-times-current-indicator">
                      <span className="prayer-times-current-icon">✓</span>
                      <span className="prayer-times-current-text">Now</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="prayer-times-info-container">
          {currentLocation && (
            <div className="prayer-times-info-card">
              <span className="prayer-times-info-icon">📍</span>
              <div className="prayer-times-info-content">
                <p className="prayer-times-info-title">Your Location</p>
                <p className="prayer-times-info-text">
                  {currentLocation.city}, {currentLocation.country}
                </p>
                <p className="prayer-times-info-text">
                  Coords: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)} • TZ: {timezone}
                </p>
              </div>
            </div>
          )}

          <div className="prayer-times-info-card">
            <span className="prayer-times-info-icon">ℹ️</span>
            <div className="prayer-times-info-content">
              <p className="prayer-times-info-title">Prayer Times Calculation</p>
              <p className="prayer-times-info-text">
                Times are calculated based on your current location using the Muslim World League method.
              </p>
            </div>
          </div>

          <div className="prayer-times-info-card">
            <span className="prayer-times-info-icon">💡</span>
            <div className="prayer-times-info-content">
              <p className="prayer-times-info-title">Tip</p>
              <p className="prayer-times-info-text">
                Ensure your device time and timezone are correct for accurate prayer times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </IslamicBackground>
  );
};

export default PrayerTimesScreen;
