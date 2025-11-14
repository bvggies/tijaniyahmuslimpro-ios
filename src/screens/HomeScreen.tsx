import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTimeFormat } from '../contexts/TimeFormatContext';
import { getPrayerTimes, updatePrayerCountdowns, PrayerTime } from '../services/prayerService';
import LocationService, { LocationData } from '../services/locationService';
import { getCurrentIslamicDate, getUpcomingIslamicEvents } from '../services/islamicCalendarService';
import { getDailyReminder, getCategoryIcon, DailyReminder } from '../services/dailyReminderService';
import ProfileAvatar from '../components/ProfileAvatar';
import LanguageSelector from '../components/LanguageSelector';
import { colors } from '../utils/theme';
import './HomeScreen.css';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { language, t } = useLanguage();
  const { timeFormat, formatTimeWithSeconds } = useTimeFormat();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [islamicDate, setIslamicDate] = useState(getCurrentIslamicDate());
  const [upcomingEvents] = useState(getUpcomingIslamicEvents());
  const [dailyReminder, setDailyReminder] = useState<DailyReminder | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAzanId, setSelectedAzanId] = useState<'makkah' | 'istanbul' | null>(null);
  const [isAzanPlaying, setIsAzanPlaying] = useState(false);
  const [openHajj, setOpenHajj] = useState<'live' | 'guide' | 'journey' | null>(null);
  const azanAudioRef = React.useRef<HTMLAudioElement | null>(null);

  const azanOptions = [
    { id: 'makkah' as const, label: 'Makkah', file: '/assets/audio/azan/makkah.mp3' },
    { id: 'istanbul' as const, label: 'Istanbul', file: '/assets/audio/azan/istanbul.mp3' },
  ];

  const loadDailyReminder = React.useCallback((timezone?: string) => {
    const reminder = getDailyReminder(timezone);
    setDailyReminder(reminder);
  }, []);

  const loadLocationAndPrayerTimes = React.useCallback(async () => {
    try {
      const locationService = LocationService.getInstance();
      const userLocation = await locationService.getUserLocation();
      
      if (!userLocation) {
        const fallbackLocation: LocationData = {
          latitude: 21.3891,
          longitude: 39.8579,
          city: 'Makkah',
          country: 'Saudi Arabia',
        };
        setCurrentLocation(fallbackLocation);
        const times = await getPrayerTimes(fallbackLocation.latitude, fallbackLocation.longitude, timeFormat);
        setPrayerTimes(times);
        return;
      }

      setCurrentLocation({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        city: userLocation.city,
        country: userLocation.country,
        timezone: userLocation.timezone,
      });

      const times = await getPrayerTimes(userLocation.latitude, userLocation.longitude, timeFormat);
      setPrayerTimes(times);
      setIslamicDate(getCurrentIslamicDate());
      loadDailyReminder(userLocation.timezone);
    } catch (error) {
      console.error('Error loading location and prayer times:', error);
      const fallbackLocation: LocationData = {
        latitude: 21.3891,
        longitude: 39.8579,
        city: 'Makkah',
        country: 'Saudi Arabia',
      };
      setCurrentLocation(fallbackLocation);
      const times = await getPrayerTimes(fallbackLocation.latitude, fallbackLocation.longitude, timeFormat);
      setPrayerTimes(times);
    }
  }, [timeFormat, loadDailyReminder]);

  useEffect(() => {
    loadLocationAndPrayerTimes();
    loadDailyReminder();
    
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeInterval);
  }, [loadLocationAndPrayerTimes, loadDailyReminder]);

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

  useEffect(() => {
    return () => {
      if (azanAudioRef.current) {
        azanAudioRef.current.pause();
        azanAudioRef.current = null;
      }
    };
  }, []);


  const handlePlayPauseAzan = async () => {
    if (!selectedAzanId) {
      alert('Please select an azan audio first');
      return;
    }

    if (isAzanPlaying && azanAudioRef.current) {
      azanAudioRef.current.pause();
      setIsAzanPlaying(false);
      return;
    }

    const option = azanOptions.find(o => o.id === selectedAzanId);
    if (!option) return;

    try {
      if (azanAudioRef.current) {
        azanAudioRef.current.pause();
      }
      
      const audio = new Audio(option.file);
      azanAudioRef.current = audio;
      
      audio.onended = () => {
        setIsAzanPlaying(false);
        azanAudioRef.current = null;
      };
      
      audio.onerror = () => {
        alert('Unable to play audio');
        setIsAzanPlaying(false);
        azanAudioRef.current = null;
      };
      
      await audio.play();
      setIsAzanPlaying(true);
    } catch (error) {
      console.error('Error playing azan:', error);
      alert('Unable to play audio');
      setIsAzanPlaying(false);
    }
  };

  const nextPrayer = prayerTimes.find(p => p.isNext) || null;

  const getCountryFlag = (country?: string): string => {
    if (!country) return '🌍';
    const countryLower = country.toLowerCase();
    const flagMap: { [key: string]: string } = {
      'ghana': '🇬🇭', 'nigeria': '🇳🇬', 'egypt': '🇪🇬', 'morocco': '🇲🇦',
      'algeria': '🇩🇿', 'tunisia': '🇹🇳', 'saudi arabia': '🇸🇦', 'uae': '🇦🇪',
      'qatar': '🇶🇦', 'kuwait': '🇰🇼', 'bahrain': '🇧🇭', 'oman': '🇴🇲',
      'pakistan': '🇵🇰', 'india': '🇮🇳', 'bangladesh': '🇧🇩', 'turkey': '🇹🇷',
      'united states': '🇺🇸', 'united kingdom': '🇬🇧', 'canada': '🇨🇦',
      'france': '🇫🇷', 'germany': '🇩🇪', 'australia': '🇦🇺',
    };
    
    for (const [key, flag] of Object.entries(flagMap)) {
      if (countryLower.includes(key) || key.includes(countryLower)) {
        return flag;
      }
    }
    return '🌍';
  };

  const getPrayerNameArabic = (prayerName: string) => {
    const arabicNames: { [key: string]: string } = {
      'Fajr': 'الفجر', 'Dhuhr': 'الظهر', 'Asr': 'العصر',
      'Maghrib': 'المغرب', 'Isha': 'العشاء'
    };
    return arabicNames[prayerName] || prayerName;
  };

  const getPrayerIcon = (prayerName: string) => {
    const icons: { [key: string]: string } = {
      'Fajr': '🌅', 'Dhuhr': '☀️', 'Asr': '🌤️', 'Maghrib': '🌇', 'Isha': '🌙'
    };
    return icons[prayerName] || '🕐';
  };

  const getPrayerColor = (prayerName: string) => {
    const colors: { [key: string]: string } = {
      'Fajr': '#FF6B35', 'Dhuhr': '#FFD23F', 'Asr': '#FF8C42',
      'Maghrib': '#FF6B9D', 'Isha': '#4A90E2'
    };
    return colors[prayerName] || '#607D8B';
  };

  const quickActions = [
    { title: 'Lessons', titleArabic: 'الدروس', icon: '🎓', color: '#4CAF50', path: '/lessons' },
    { title: 'AI Noor', titleArabic: 'الذكاء الاصطناعي', icon: '💡', color: '#00BCD4', path: '/ai-noor' },
    { title: 'Azan', titleArabic: 'الأذان', icon: '🔊', color: '#FF9800', path: '/azan' },
    { title: 'Scholars', titleArabic: 'العلماء', icon: '👨‍🏫', color: '#607D8B', path: '/scholars' },
    { title: 'Tariqa Tijaniyyah', titleArabic: 'الطريقة التجانية', icon: '⭐', color: colors.accentTeal, path: '/tariqa-tijaniyyah' },
    { title: 'Makkah Live', titleArabic: 'مكة مباشر', icon: '📹', color: colors.accentYellow, path: '/makkah-live' },
    { title: 'Mosque Locator', titleArabic: 'موقع المسجد', icon: '📍', color: '#795548', path: '/mosque' },
    { title: 'Qibla Direction', titleArabic: 'القبلة', icon: '🧭', color: '#FF5722', path: '/qibla' },
    { title: 'Prayer Times', titleArabic: 'أوقات الصلاة', icon: '🕐', color: '#9C27B0', path: '/prayer-times' },
    { title: 'Community', titleArabic: 'المجتمع', icon: '💬', color: '#3F51B5', path: '/community' },
    { title: 'Donate', titleArabic: 'التبرع', icon: '❤️', color: '#E91E63', path: '/donate' },
    { title: 'Settings', titleArabic: 'الإعدادات', icon: '⚙️', color: '#607D8B', path: '/settings' },
    { title: 'Digital Tasbih', titleArabic: 'السبحة الرقمية', icon: '📿', color: '#4CAF50', path: '/tasbih' },
    { title: 'Wazifa', titleArabic: 'الوظيفة', icon: '📖', color: '#2196F3', path: '/wazifa' },
    { title: 'Lazim Tracker', titleArabic: 'متتبع اللازم', icon: '✅', color: '#2E7D32', path: '/lazim-tracker' },
    { title: 'Tijaniya Lazim', titleArabic: 'اللازم التجاني', icon: '🕌', color: '#00BFA5', path: '/tijaniya-lazim' },
    { title: 'Zikr Jumma', titleArabic: 'ذكر الجمعة', icon: '📅', color: '#9C27B0', path: '/zikr-jumma' },
    { title: 'Islamic Journal', titleArabic: 'المجلة الإسلامية', icon: '📔', color: '#FF9800', path: '/journal' },
    { title: 'Hajj', titleArabic: 'الحج', icon: '🕋', color: '#795548', path: '/hajj' },
    { title: 'Zakat Calculator', titleArabic: 'حاسبة الزكاة', icon: '💰', color: '#4CAF50', path: '/zakat-calculator' },
    { title: 'Notifications', titleArabic: 'الإشعارات', icon: '🔔', color: '#FF5722', path: '/notifications' },
  ];

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <div className="home-header-content">
          <div className="home-logo-container">
            <img src="/assets/images/appicon.png" alt="App Icon" className="home-header-logo" />
          </div>
          
          <div className="home-header-actions">
            <button className="home-header-button" onClick={() => navigate('/donate')}>
              <span className="home-header-icon">❤️</span>
              <span className="home-header-label">{t('donate.title')}</span>
            </button>
            
            <div className="home-header-button" onClick={() => navigate('/profile')}>
              <div className="home-header-avatar-wrapper">
                <ProfileAvatar 
                  profilePicture={authState.user?.profilePicture}
                  name={authState.user?.name}
                  size={24}
                  showBorder={false}
                />
              </div>
              <span className="home-header-label">{t('profile.title')}</span>
            </div>
            
            <LanguageSelector compact={true} />
            
            <button className="home-header-button" onClick={() => navigate('/settings')}>
              <span className="home-header-icon">⚙️</span>
              <span className="home-header-label">{t('common.settings')}</span>
            </button>
          </div>
        </div>
        
        <div className="home-greeting-location">
          <div className="home-greeting">
            <h2 className="home-greeting-text">Assalamu Alaikum</h2>
            <p className="home-greeting-arabic">السلام عليكم</p>
          </div>
          
          <div className="home-location">
            <span className="home-location-flag">{getCountryFlag(currentLocation?.country)}</span>
            <span className="home-location-text">
              {currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : 'Detecting location...'}
            </span>
          </div>
        </div>
      </div>

      <div className="home-scroll-content">
        {/* Islamic Calendar Card */}
        <div className="home-calendar-card">
          <div className="home-calendar-header">
            <span className="home-calendar-icon">📅</span>
            <h3 className="home-calendar-title">Islamic Calendar</h3>
          </div>
          <div className="home-calendar-content">
            <p className="home-hijri-date">
              {islamicDate.day} {islamicDate.monthNameArabic} {islamicDate.year} AH
            </p>
            <p className="home-gregorian-date">
              {new Date().toLocaleDateString()} — {formatTimeWithSeconds(currentTime)}
            </p>
            <p className="home-day-name">
              {islamicDate.dayNameArabic} - {islamicDate.dayName}
            </p>
          </div>
        </div>

        {/* Next Prayer Card */}
        {nextPrayer && (
          <div className="home-next-prayer-card">
            <div className="home-next-prayer-header">
              <div className="home-next-prayer-header-left">
                <span className="home-next-prayer-icon">🌙</span>
                <div>
                  <p className="home-next-prayer-label">Next Prayer</p>
                  <p className="home-next-prayer-label-arabic">الصلاة القادمة</p>
                </div>
              </div>
              <div className="home-next-prayer-badge">
                <span>🔔</span>
                <span>Upcoming</span>
              </div>
            </div>
            
            <div className="home-next-prayer-main">
              <div className="home-next-prayer-name-section">
                <h2 className="home-next-prayer-name">{nextPrayer.name}</h2>
                <p className="home-next-prayer-name-arabic">{getPrayerNameArabic(nextPrayer.name)}</p>
              </div>
              
              <div className="home-next-prayer-time-section">
                <div className="home-next-prayer-time-display">
                  <span>🕐</span>
                  <span className="home-next-prayer-time-large">
                    {nextPrayer.timeWithSeconds || nextPrayer.time}
                  </span>
                </div>
                {nextPrayer.countdown && (
                  <div className="home-next-prayer-countdown">
                    <span>⏳</span>
                    <span>{nextPrayer.countdown}</span>
                  </div>
                )}
              </div>
            </div>
            
            {currentLocation && (
              <div className="home-next-prayer-footer">
                <span>📍 {currentLocation.city}</span>
                <span>🧮 MWL Method</span>
              </div>
            )}
          </div>
        )}

        {/* Prayer Times Section */}
        <div className="home-section">
          <h3 className="home-section-title">Prayer Times</h3>
          <p className="home-section-title-arabic">أوقات الصلاة</p>
          
          <div className="home-prayer-times-container">
            {prayerTimes.map((prayer, index) => {
              const prayerColor = getPrayerColor(prayer.name);
              const prayerIcon = getPrayerIcon(prayer.name);
              const arabicName = getPrayerNameArabic(prayer.name);
              
              return (
                <div
                  key={prayer.name}
                  className={`home-prayer-card ${prayer.isCurrent ? 'home-prayer-card-current' : ''}`}
                  style={prayer.isCurrent ? { borderColor: prayerColor, backgroundColor: `${prayerColor}20` } : {}}
                >
                  <div className="home-prayer-icon-container" style={{ backgroundColor: `${prayerColor}20` }}>
                    <span>{prayerIcon}</span>
                  </div>
                  <div className="home-prayer-info">
                    <div className="home-prayer-name-container">
                      <span className="home-prayer-name">{prayer.name}</span>
                      <span className="home-prayer-name-arabic">{arabicName}</span>
                    </div>
                    <span className="home-prayer-time">{prayer.time}</span>
                  </div>
                  {prayer.isCurrent && (
                    <div className="home-prayer-current-indicator">
                      <span>✓</span>
                      <span>Now</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="home-section">
          <h3 className="home-section-title">Quick Actions</h3>
          <p className="home-section-title-arabic">إجراءات سريعة</p>
          
          {/* Mini Azan Player */}
          <div className="home-mini-azan-card">
            <div className="home-mini-azan-header">
              <span>🔊</span>
              <span>Azan Player</span>
              <div style={{ flex: 1 }} />
              <button className="home-mini-azan-play" onClick={handlePlayPauseAzan}>
                {isAzanPlaying ? '⏸️' : '▶️'}
              </button>
            </div>
            <div className="home-mini-azan-list">
              {azanOptions.map(opt => (
                <button
                  key={opt.id}
                  className={`home-mini-azan-item ${selectedAzanId === opt.id ? 'home-mini-azan-item-active' : ''}`}
                  onClick={() => setSelectedAzanId(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="home-quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="home-quick-action-card"
                style={{ '--action-color': action.color } as React.CSSProperties}
              >
                <div className="home-quick-action-icon" style={{ backgroundColor: action.color }}>
                  <span>{action.icon}</span>
                </div>
                <span className="home-quick-action-title">{action.title}</span>
                <span className="home-quick-action-title-arabic">{action.titleArabic}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="home-section">
          <h3 className="home-section-title">Upcoming Events</h3>
          <p className="home-section-title-arabic">الأحداث القادمة</p>
          
          <div className="home-events-scroll">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="home-event-card">
                <h4 className="home-event-title">{event.title}</h4>
                <p className="home-event-title-arabic">{event.titleArabic}</p>
                <p className="home-event-date">{event.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hajj Section */}
        <div className="home-section">
          <h3 className="home-section-title">Hajj</h3>
          <div className="home-hajj-quick-row">
            <button
              className="home-hajj-quick-btn"
              onClick={() => setOpenHajj(openHajj === 'live' ? null : 'live')}
            >
              <span>📹</span>
              <span>Watch Live</span>
            </button>
            <button
              className="home-hajj-quick-btn"
              onClick={() => setOpenHajj(openHajj === 'guide' ? null : 'guide')}
            >
              <span>🚶</span>
              <span>Hajj Guide</span>
            </button>
            <button
              className="home-hajj-quick-btn"
              onClick={() => setOpenHajj(openHajj === 'journey' ? null : 'journey')}
            >
              <span>🗺️</span>
              <span>Journey</span>
            </button>
          </div>
          
          {openHajj === 'live' && (
            <div className="home-hajj-dropdown-card">
              <h4>Makkah Live</h4>
              <p>24/7 HD stream of the Kaaba with prayer times and special events.</p>
              <button onClick={() => navigate('/makkah-live')}>Open →</button>
            </div>
          )}
          {openHajj === 'guide' && (
            <div className="home-hajj-dropdown-card">
              <h4>Hajj & Umrah</h4>
              <p>Step-by-step rites, essential duas, packing list, visa info, health & safety tips.</p>
              <button onClick={() => navigate('/hajj-umrah')}>Open →</button>
            </div>
          )}
          {openHajj === 'journey' && (
            <div className="home-hajj-dropdown-card">
              <h4>Hajj Journey</h4>
              <p>Day-by-day timeline with reminders, mark-done checklist, and quick map links.</p>
              <button onClick={() => navigate('/hajj-journey')}>Open →</button>
            </div>
          )}
        </div>

        {/* Daily Reminder */}
        {dailyReminder && (
          <div className="home-section">
            <h3 className="home-section-title">Daily Reminder</h3>
            <div className="home-reminder-card">
              <div className="home-reminder-header">
                <span className="home-reminder-icon">{getCategoryIcon(dailyReminder.category)}</span>
                <h4 className="home-reminder-title">
                  {language === 'ar' ? (dailyReminder.titleArabic || dailyReminder.title) : dailyReminder.title}
                </h4>
              </div>
              <div className="home-reminder-content">
                <p className="home-reminder-text">
                  {language === 'ar' ? (dailyReminder.contentArabic || dailyReminder.content) : dailyReminder.content}
                </p>
                {dailyReminder.source && (
                  <p className="home-reminder-source">— {dailyReminder.source}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
