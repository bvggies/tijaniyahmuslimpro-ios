import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

interface AzanOption {
  id: string;
  name: string;
  muezzin: string;
  location: string;
  description: string;
  icon: string;
  color: string;
  audioUrl: string;
}

const AzanScreen: React.FC = () => {
  const [selectedAzan, setSelectedAzan] = useState<AzanOption | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const azanOptions: AzanOption[] = [
    {
      id: 'makkah',
      name: 'Makkah Al-Mukarramah',
      muezzin: 'Sheikh Abdul Rahman Al-Sudais',
      location: 'Masjid al-Haram, Makkah',
      description: 'The sacred call to prayer from the Grand Mosque in Makkah',
      icon: '🕋',
      color: '#2E7D32',
      audioUrl: '/assets/audio/azan/makkah.mp3',
    },
    {
      id: 'istanbul',
      name: 'Istanbul',
      muezzin: 'Sheikh Hafiz Mustafa Özcan',
      location: 'Sultan Ahmed Mosque, Istanbul',
      description: 'The magnificent call from the Blue Mosque in Istanbul',
      icon: '🕌',
      color: '#FF9800',
      audioUrl: '/assets/audio/azan/istanbul.mp3',
    },
    {
      id: 'madinah',
      name: 'Madinah Al-Munawwarah',
      muezzin: 'Sheikh Ali Al-Hudhaifi',
      location: 'Masjid an-Nabawi, Madinah',
      description: 'The blessed call to prayer from the Prophet\'s Mosque',
      icon: '🕋',
      color: '#00BFA5',
      audioUrl: '/assets/audio/azan/makkah.mp3', // Using Makkah audio as placeholder
    },
    {
      id: 'jerusalem',
      name: 'Al-Quds (Jerusalem)',
      muezzin: 'Sheikh Ekrima Sabri',
      location: 'Al-Aqsa Mosque, Jerusalem',
      description: 'The historic call to prayer from the third holiest mosque',
      icon: '🕌',
      color: '#11C48D',
      audioUrl: '/assets/audio/azan/istanbul.mp3', // Using Istanbul audio as placeholder
    },
    {
      id: 'cairo',
      name: 'Cairo',
      muezzin: 'Sheikh Mahmoud Al-Tablawi',
      location: 'Al-Azhar Mosque, Cairo',
      description: 'The scholarly call from the prestigious Al-Azhar Mosque',
      icon: '🕌',
      color: '#FFD54F',
      audioUrl: '/assets/audio/azan/makkah.mp3', // Using Makkah audio as placeholder
    },
    {
      id: 'baghdad',
      name: 'Baghdad',
      muezzin: 'Sheikh Ahmad Al-Kubaisi',
      location: 'Abu Hanifa Mosque, Baghdad',
      description: 'The traditional call from the historic Abu Hanifa Mosque',
      icon: '🕌',
      color: '#00BFA5',
      audioUrl: '/assets/audio/azan/istanbul.mp3', // Using Istanbul audio as placeholder
    },
  ];

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const loadAudio = (azan: AzanOption) => {
    try {
      setIsLoading(true);
      setError(null);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(azan.audioUrl);
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration * 1000);
        setIsLoading(false);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime * 1000);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setError('Failed to load audio. Please try again.');
        setIsLoading(false);
      });

      audio.volume = volume;
      audioRef.current = audio;
      setSelectedAzan(azan);
    } catch (error: any) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
      setError(`Failed to load audio: ${error.message}`);
    }
  };

  const playPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const seekTo = (position: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = position / 1000;
  };

  const setVolumeLevel = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '8px' }}>
          🔊 Azan
        </h1>
        <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
          Listen to beautiful Azan from famous mosques around the world
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Azan Options Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '30px',
        }}>
          {azanOptions.map((azan) => (
            <div
              key={azan.id}
              className="card"
              style={{
                cursor: 'pointer',
                border: selectedAzan?.id === azan.id ? `2px solid ${azan.color}` : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
              }}
              onClick={() => loadAudio(azan)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: `${azan.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '16px',
              }}>
                {azan.icon}
              </div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#E7F5F1',
                marginBottom: '8px',
              }}>
                {azan.name}
              </h3>

              <p style={{
                fontSize: '14px',
                color: '#BBE1D5',
                marginBottom: '4px',
              }}>
                {azan.muezzin}
              </p>

              <p style={{
                fontSize: '12px',
                color: '#9E9E9E',
                marginBottom: '8px',
              }}>
                {azan.location}
              </p>

              <p style={{
                fontSize: '13px',
                color: '#BBE1D5',
                lineHeight: '1.5',
              }}>
                {azan.description}
              </p>
            </div>
          ))}
        </div>

        {/* Audio Player */}
        {selectedAzan && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#E7F5F1',
              marginBottom: '20px',
            }}>
              Now Playing: {selectedAzan.name}
            </h3>

            {error && (
              <div style={{
                padding: '12px',
                background: 'rgba(244, 67, 54, 0.2)',
                borderRadius: '8px',
                marginBottom: '16px',
                color: '#F44336',
              }}>
                {error}
              </div>
            )}

            {/* Progress Bar */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seekTo(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: '#114C45',
                  outline: 'none',
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                fontSize: '12px',
                color: '#BBE1D5',
              }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
            }}>
              <button
                onClick={playPause}
                disabled={isLoading}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00BFA5 0%, #11C48D 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '24px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
              </button>

              <button
                onClick={stopAudio}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ⏹
              </button>

              {/* Volume Control */}
              <div style={{ flex: 1, marginLeft: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: '#BBE1D5',
                  marginBottom: '8px',
                }}>
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolumeLevel(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#114C45',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Azan Info */}
            <div style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}>
              <p style={{
                fontSize: '14px',
                color: '#BBE1D5',
                marginBottom: '8px',
              }}>
                <strong style={{ color: '#E7F5F1' }}>Muezzin:</strong> {selectedAzan.muezzin}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#BBE1D5',
                marginBottom: '8px',
              }}>
                <strong style={{ color: '#E7F5F1' }}>Location:</strong> {selectedAzan.location}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#BBE1D5',
              }}>
                <strong style={{ color: '#E7F5F1' }}>Description:</strong> {selectedAzan.description}
              </p>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="card">
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '12px',
          }}>
            About Azan
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#BBE1D5',
            lineHeight: '1.6',
          }}>
            The Azan (Adhan) is the Islamic call to prayer, recited by the muezzin at prescribed times of the day.
            It is a beautiful reminder for Muslims to pause from their daily activities and turn to Allah in prayer.
            Each mosque has its own unique style and melody, reflecting the rich diversity of Islamic traditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AzanScreen;

