import React, { useState, useEffect, useRef } from 'react';
import { getQiblaDirection } from '../services/prayerService';
import LocationService, { LocationData } from '../services/locationService';
import '../App.css';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

interface QiblaData {
  direction: number;
  distance: number;
}

const QiblaScreen: React.FC = () => {
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'compass' | 'info'>('compass');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const compassRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeLocation();
    startCompass();

    return () => {
      // Cleanup compass listener if needed
    };
  }, []);

  useEffect(() => {
    if (location) {
      calculateQiblaData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (qiblaData && deviceHeading !== null) {
      updateCompassRotation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qiblaData, deviceHeading]);

  const initializeLocation = async () => {
    try {
      setIsLoading(true);
      
      const locationService = LocationService.getInstance();
      const userLocation = await locationService.getUserLocation();
      
      if (!userLocation) {
        alert('Location permission is required to find the Qibla direction.');
        setIsLoading(false);
        return;
      }

      setLocation(userLocation);
    } catch (error) {
      console.error('Location error:', error);
      alert('Unable to get your location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startCompass = () => {
    // Check if device orientation API is available
    if (window.DeviceOrientationEvent) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
          setDeviceHeading(event.alpha);
        }
      };
      
      window.addEventListener('deviceorientation', handleOrientation);
      
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    } else {
      // Fallback: Use a mock heading for desktop
      console.log('Device orientation not available, using mock heading');
      setDeviceHeading(0);
    }
  };

  const calculateQiblaData = () => {
    if (!location) return;

    const direction = getQiblaDirection(location.latitude, location.longitude);
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      KAABA_LAT,
      KAABA_LNG
    );

    setQiblaData({
      direction,
      distance,
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const updateCompassRotation = () => {
    if (!qiblaData || !compassRef.current || !needleRef.current) return;

    const targetRotation = -deviceHeading;
    const needleTargetRotation = qiblaData.direction - deviceHeading;

    if (compassRef.current) {
      compassRef.current.style.transform = `rotate(${targetRotation}deg)`;
    }
    
    if (needleRef.current) {
      needleRef.current.style.transform = `rotate(${needleTargetRotation}deg)`;
    }
  };

  const formatDistance = (distance: number): string => {
    if (distanceUnit === 'mi') {
      return `${(distance * 0.621371).toFixed(1)} mi`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  if (isLoading) {
    return (
      <div className="App">
        <div className="flex-center" style={{ minHeight: '100vh' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: '#BBE1D5' }}>Finding your location...</p>
        </div>
      </div>
    );
  }

  const compassSize = Math.min(window.innerWidth, window.innerHeight) * 0.5;

  return (
    <div className="App">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #00BFA5 0%, #11C48D 100%)',
        paddingTop: '40px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF' }}>
            Qibla Direction
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowGuide(!showGuide)}
              style={{
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                color: '#FFFFFF',
                fontSize: '20px',
              }}
            >
              ❓
            </button>
            <button
              onClick={initializeLocation}
              style={{
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                color: '#FFFFFF',
                fontSize: '20px',
              }}
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div style={{
        display: 'flex',
        margin: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '4px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        {['compass', 'info'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as 'compass' | 'info')}
            style={{
              flex: 1,
              padding: '12px 8px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === mode ? '#00BFA5' : 'transparent',
              color: viewMode === mode ? '#FFFFFF' : '#BBE1D5',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {mode === 'compass' ? '🧭' : 'ℹ️'}
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {viewMode === 'compass' && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Compass */}
          <div style={{
            position: 'relative',
            width: `${compassSize}px`,
            height: `${compassSize}px`,
            marginBottom: '30px',
          }}>
            <div
              ref={compassRef}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '4px solid #00BFA5',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'transform 0.3s ease',
              }}
            >
              {/* Direction Markers */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => (
                <div
                  key={angle}
                  style={{
                    position: 'absolute',
                    width: '2px',
                    height: '20px',
                    background: '#114C45',
                    top: '10px',
                    transformOrigin: '50% 50%',
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '-25px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#052F2A',
                    }}
                  >
                    {['N', '', '', 'E', '', '', 'S', '', '', 'W', '', ''][index]}
                  </span>
                </div>
              ))}

              {/* Qibla Needle */}
              {qiblaData && (
                <div
                  ref={needleRef}
                  style={{
                    position: 'absolute',
                    width: '4px',
                    height: `${compassSize * 0.4}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'transform 0.3s ease',
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderBottom: '20px solid #FF4444',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '15px solid #CCCCCC',
                    }}
                  />
                </div>
              )}

              {/* Kaaba Icon */}
              {qiblaData && (
                <div
                  style={{
                    position: 'absolute',
                    top: '30px',
                    right: '30px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '25px',
                    padding: '10px',
                    border: '3px solid #8B4513',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '50px',
                    zIndex: 20,
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🕋</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#8B4513',
                    marginTop: '3px',
                  }}>
                    Kaaba
                  </span>
                </div>
              )}

              {/* Center Dot */}
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#00BFA5',
                border: '2px solid #FFFFFF',
                zIndex: 15,
              }} />
            </div>
          </div>

          {/* Qibla Direction Text */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#E7F5F1',
            }}>
              {qiblaData ? `${qiblaData.direction.toFixed(1)}°` : '--'}
            </p>
            <p style={{
              fontSize: '16px',
              color: '#BBE1D5',
              marginTop: '4px',
            }}>
              Qibla Direction
            </p>
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}>
            <button
              onClick={() => setDistanceUnit(distanceUnit === 'km' ? 'mi' : 'km')}
              style={{
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                color: '#BBE1D5',
                fontSize: '12px',
                fontWeight: '500',
              }}
            >
              🔄 Units
            </button>
          </div>
        </div>
      )}

      {viewMode === 'info' && (
        <div style={{ padding: '20px' }}>
          {/* Location Info */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#E7F5F1',
              marginBottom: '16px',
            }}>
              Location Information
            </h3>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>📍</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: '#BBE1D5', marginBottom: '2px' }}>Your Location</p>
                <p style={{ fontSize: '16px', color: '#E7F5F1', fontWeight: '500' }}>
                  {location ? 
                    `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 
                    'Not available'
                  }
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>🏴</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: '#BBE1D5', marginBottom: '2px' }}>Distance to Kaaba</p>
                <p style={{ fontSize: '16px', color: '#E7F5F1', fontWeight: '500' }}>
                  {qiblaData ? formatDistance(qiblaData.distance) : 'Calculating...'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🕐</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: '#BBE1D5', marginBottom: '2px' }}>Current Time</p>
                <p style={{ fontSize: '16px', color: '#E7F5F1', fontWeight: '500' }}>
                  {formatTime(new Date())}
                </p>
              </div>
            </div>
          </div>

          {/* Kaaba Info */}
          <div className="card">
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#E7F5F1',
              marginBottom: '16px',
            }}>
              Kaaba Information
            </h3>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '30px',
                background: '#E8F5E8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
              }}>
                🕋
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#E7F5F1',
                  marginBottom: '4px',
                }}>
                  Sacred Kaaba
                </p>
                <p style={{
                  fontSize: '16px',
                  color: '#BBE1D5',
                  marginBottom: '2px',
                }}>
                  Mecca, Saudi Arabia
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#BBE1D5',
                }}>
                  {KAABA_LAT}°N, {KAABA_LNG}°E
                </p>
              </div>
            </div>

            <div>
              <p style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#E7F5F1',
                marginBottom: '8px',
              }}>
                Quick Facts
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}>
                <li style={{
                  fontSize: '14px',
                  color: '#BBE1D5',
                  marginBottom: '4px',
                  lineHeight: '20px',
                }}>• Built by Prophet Ibrahim (AS)</li>
                <li style={{
                  fontSize: '14px',
                  color: '#BBE1D5',
                  marginBottom: '4px',
                  lineHeight: '20px',
                }}>• Direction of prayer for all Muslims</li>
                <li style={{
                  fontSize: '14px',
                  color: '#BBE1D5',
                  marginBottom: '4px',
                  lineHeight: '20px',
                }}>• Circumambulated during Hajj and Umrah</li>
                <li style={{
                  fontSize: '14px',
                  color: '#BBE1D5',
                  lineHeight: '20px',
                }}>• Covered with the Kiswah (black cloth)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {showGuide && (
        <div className="card" style={{ margin: '20px', marginTop: '0' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '16px',
          }}>
            How the Qibla Compass Works
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <p style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#E7F5F1',
              marginBottom: '8px',
            }}>
              What is Qibla?
            </p>
            <p style={{
              fontSize: '14px',
              color: '#BBE1D5',
              lineHeight: '20px',
            }}>
              Qibla is the direction that Muslims face during prayer, pointing toward the Kaaba in Mecca, Saudi Arabia. 
              The Kaaba is the most sacred site in Islam and serves as the spiritual center for all Muslims worldwide.
            </p>
          </div>

          <div>
            <p style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#E7F5F1',
              marginBottom: '8px',
            }}>
              How to Use
            </p>
            <ol style={{
              paddingLeft: '20px',
              margin: 0,
            }}>
              <li style={{
                fontSize: '14px',
                color: '#BBE1D5',
                marginBottom: '8px',
                lineHeight: '20px',
              }}>Enable location services for accurate Qibla calculation</li>
              <li style={{
                fontSize: '14px',
                color: '#BBE1D5',
                marginBottom: '8px',
                lineHeight: '20px',
              }}>Hold your device flat and level for accurate compass readings</li>
              <li style={{
                fontSize: '14px',
                color: '#BBE1D5',
                marginBottom: '8px',
                lineHeight: '20px',
              }}>Follow the red needle and Kaaba icon pointing to the exact Qibla direction</li>
              <li style={{
                fontSize: '14px',
                color: '#BBE1D5',
                lineHeight: '20px',
              }}>Turn your body to face the direction indicated by the needle</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default QiblaScreen;

