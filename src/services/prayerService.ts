import { PrayerTimes, Coordinates, CalculationMethod } from 'adhan';

export interface PrayerTime {
  name: string;
  time: string;
  timeWithSeconds?: string;
  countdown?: string;
  isCurrent?: boolean;
  isNext?: boolean;
}

// Helper function to format time from Date object
export const formatTime = (date: Date, timeFormat: '12h' | '24h' = '12h'): string => {
  if (timeFormat === '12h') {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } else {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
};

// Helper function to format time with seconds
export const formatTimeWithSeconds = (date: Date, timeFormat: '12h' | '24h' = '12h'): string => {
  if (timeFormat === '12h') {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } else {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }
};

// Helper function to calculate countdown
const calculateCountdown = (targetDate: Date, currentDate: Date): { countdown: string; secondsUntil: number } => {
  try {
    if (!targetDate || !currentDate || isNaN(targetDate.getTime()) || isNaN(currentDate.getTime())) {
      return { countdown: '00:00:00', secondsUntil: 0 };
    }

    const target = new Date(targetDate);
    const current = new Date(currentDate);
    
    if (target.getTime() <= current.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    
    const diffMs = target.getTime() - current.getTime();
    
    if (diffMs <= 0) {
      return { countdown: '00:00:00', secondsUntil: 0 };
    }
    
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const countdownString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return {
      countdown: countdownString,
      secondsUntil: totalSeconds
    };
  } catch (error) {
    console.error('Error in calculateCountdown:', error);
    return { countdown: '00:00:00', secondsUntil: 0 };
  }
};

// Prayer times calculation using Adhan library
export const getPrayerTimes = async (latitude: number, longitude: number, timeFormat: '12h' | '24h' = '12h'): Promise<PrayerTime[]> => {
  try {
    const coordinates = new Coordinates(latitude, longitude);
    const params = CalculationMethod.MuslimWorldLeague();
    const date = new Date();
    const prayerTimes = new PrayerTimes(coordinates, date, params);

    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr },
      { name: 'Dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', time: prayerTimes.isha },
    ];

    const now = new Date();
    let currentPrayerIndex = -1;
    let nextPrayerIndex = -1;

    // Find current and next prayer
    for (let i = 0; i < prayers.length; i++) {
      const prayerTime = prayers[i].time;
      if (now >= prayerTime && (i === prayers.length - 1 || now < prayers[i + 1].time)) {
        currentPrayerIndex = i;
        nextPrayerIndex = (i + 1) % prayers.length;
        break;
      }
    }

    // If no current prayer found, next is the first prayer of tomorrow
    if (currentPrayerIndex === -1) {
      nextPrayerIndex = 0;
    }

    return prayers.map((prayer, index) => {
      const isCurrent = index === currentPrayerIndex;
      const isNext = index === nextPrayerIndex;
      
      const timeStr = formatTime(prayer.time, timeFormat);
      const timeWithSecondsStr = formatTimeWithSeconds(prayer.time, timeFormat);
      
      let countdown: string | undefined;
      if (isNext) {
        const { countdown: cd } = calculateCountdown(prayer.time, now);
        countdown = cd;
      }

      return {
        name: prayer.name,
        time: timeStr,
        timeWithSeconds: timeWithSecondsStr,
        countdown,
        isCurrent,
        isNext,
      };
    });
  } catch (error) {
    console.error('Error getting prayer times:', error);
    throw error;
  }
};

// Update prayer countdowns
export const updatePrayerCountdowns = (prayerTimes: PrayerTime[], timeFormat: '12h' | '24h' = '12h'): PrayerTime[] => {
  const now = new Date();
  
  return prayerTimes.map((prayer) => {
    if (prayer.isNext) {
      // Parse the time string to get the Date object
      const [timePart] = prayer.time.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      const prayerDate = new Date();
      prayerDate.setHours(hours, minutes, 0, 0);
      
      if (prayerDate <= now) {
        prayerDate.setDate(prayerDate.getDate() + 1);
      }
      
      const { countdown } = calculateCountdown(prayerDate, now);
      return { ...prayer, countdown };
    }
    return prayer;
  });
};

// Get Qibla direction
export const getQiblaDirection = (latitude: number, longitude: number): number => {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  
  const lat1 = latitude * Math.PI / 180;
  const lat2 = kaabaLat * Math.PI / 180;
  const deltaLng = (kaabaLng - longitude) * Math.PI / 180;
  
  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
};

