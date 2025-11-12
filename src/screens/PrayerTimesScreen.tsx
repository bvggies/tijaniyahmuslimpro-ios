import React, { useState, useEffect } from 'react';
import { getPrayerTimes, updatePrayerCountdowns, PrayerTime } from '../services/prayerService';
import LocationService, { LocationData } from '../services/locationService';
import '../App.css';

const PrayerTimesScreen: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timezone, setTimezone] = useState<string>('');
  const [timeFormat] = useState<'12h' | '24h'>('12h');

  useEffect(() => {
    loadPrayerTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        return '#11C48D';
    }
  };

  const getNextPrayer = (): PrayerTime | null => {
    return prayerTimes.find(p => p.isNext) || null;
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
      <div className="App">
        <div className="flex-center" style={{ minHeight: '100vh' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: '#BBE1D5' }}>Loading prayer times...</p>
        </div>
      </div>
    );
  }

  const nextPrayer = getNextPrayer();

  return (
    <div className="App">
      <div style={{ 
        background: 'linear-gradient(135deg, #0B3F39 0%, #052F2A 100%)',
        paddingTop: '40px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '4px' }}>
              Prayer Times
            </h1>
            <p style={{ fontSize: '16px', color: '#BBE1D5' }}>
              {currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : 'Loading...'}
            </p>
            <p style={{ fontSize: '14px', color: '#BBE1D5', marginTop: '4px', opacity: 0.8 }}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            style={{
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#FFFFFF',
              fontSize: '20px',
            }}
          >
            🔄
          </button>
        </div>

        {nextPrayer && (
          <div style={{
            background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
            borderRadius: '16px',
            padding: '20px',
            marginTop: '16px',
            color: '#FFFFFF',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '30px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}>
                {getPrayerIcon(nextPrayer.name)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '2px' }}>Next Prayer</p>
                <p style={{ fontSize: '12px', opacity: 0.8, textAlign: 'right', marginBottom: '8px' }}>الصلاة القادمة</p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '2px' }}>{nextPrayer.name}</h2>
                <p style={{ fontSize: '18px', textAlign: 'right', marginBottom: '8px' }}>{getPrayerNameArabic(nextPrayer.name)}</p>
                <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{nextPrayer.time}</p>
                {nextPrayer.countdown && (
                  <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    in {nextPrayer.countdown}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        {prayerTimes.map((prayer) => {
          const prayerColor = getPrayerColor(prayer.name);
          const isCurrent = prayer.isCurrent;
          
          return (
            <div
              key={prayer.name}
              style={{
                background: isCurrent 
                  ? `linear-gradient(135deg, ${prayerColor} 0%, ${prayerColor}CC 100%)`
                  : '#0B3F39',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: isCurrent ? `2px solid ${prayerColor}` : '1px solid #114C45',
                boxShadow: isCurrent ? `0 4px 12px ${prayerColor}40` : '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '18px',
                background: isCurrent ? 'rgba(255,255,255,0.2)' : `${prayerColor}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>
                {getPrayerIcon(prayer.name)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '2px' }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isCurrent ? '#FFFFFF' : '#E7F5F1',
                    marginBottom: '1px',
                  }}>
                    {prayer.name}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: isCurrent ? '#FFFFFF' : '#BBE1D5',
                    textAlign: 'right',
                  }}>
                    {getPrayerNameArabic(prayer.name)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: isCurrent ? '#FFFFFF' : '#E7F5F1',
                  }}>
                    {prayer.timeWithSeconds || prayer.time}
                  </p>
                  {prayer.isNext && prayer.countdown && (
                    <p style={{
                      fontSize: '12px',
                      color: '#11C48D',
                      fontWeight: '600',
                      marginTop: '2px',
                    }}>
                      {prayer.countdown}
                    </p>
                  )}
                </div>
              </div>

              {isCurrent && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '22px' }}>✓</span>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: '#FFFFFF' }}>Now</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: '20px', paddingTop: '0' }}>
        {currentLocation && (
          <div className="card" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>📍</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#E7F5F1', marginBottom: '3px' }}>
                  Your Location
                </p>
                <p style={{ fontSize: '12px', color: '#BBE1D5', lineHeight: '16px' }}>
                  {currentLocation.city}, {currentLocation.country}
                </p>
                <p style={{ fontSize: '12px', color: '#BBE1D5', lineHeight: '16px' }}>
                  Coords: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)} • TZ: {timezone}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>ℹ️</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#E7F5F1', marginBottom: '3px' }}>
                Prayer Times Calculation
              </p>
              <p style={{ fontSize: '12px', color: '#BBE1D5', lineHeight: '16px' }}>
                Times are calculated based on your current location using the Muslim World League method.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesScreen;

