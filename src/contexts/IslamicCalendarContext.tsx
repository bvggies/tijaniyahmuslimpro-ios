import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type IslamicCalendarType = 'lunar' | 'umm-al-qura' | 'tabular' | 'kuwaiti' | 'makkah' | 'karachi' | 'istanbul' | 'tehran' | 'cairo' | 'singapore' | 'jakarta';

export interface IslamicDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  monthNameArabic: string;
  dayName: string;
  dayNameArabic: string;
  isHoliday?: boolean;
  holidayName?: string;
}

export interface IslamicCalendarInfo {
  type: IslamicCalendarType;
  name: string;
  description: string;
  region: string;
  accuracy: 'high' | 'medium' | 'low';
}

interface IslamicCalendarContextType {
  selectedCalendar: IslamicCalendarType;
  setSelectedCalendar: (calendar: IslamicCalendarType) => void;
  getCurrentIslamicDate: () => IslamicDate;
  getCalendarInfo: (type: IslamicCalendarType) => IslamicCalendarInfo;
  getAllCalendars: () => IslamicCalendarInfo[];
  convertToIslamic: (gregorianDate: Date) => IslamicDate;
}

const IslamicCalendarContext = createContext<IslamicCalendarContextType | undefined>(undefined);

const ISLAMIC_MONTHS = [
  { name: 'Muharram', arabic: 'محرم' },
  { name: 'Safar', arabic: 'صفر' },
  { name: 'Rabi\' al-awwal', arabic: 'ربيع الأول' },
  { name: 'Rabi\' al-thani', arabic: 'ربيع الثاني' },
  { name: 'Jumada al-awwal', arabic: 'جمادى الأولى' },
  { name: 'Jumada al-thani', arabic: 'جمادى الثانية' },
  { name: 'Rajab', arabic: 'رجب' },
  { name: 'Sha\'ban', arabic: 'شعبان' },
  { name: 'Ramadan', arabic: 'رمضان' },
  { name: 'Shawwal', arabic: 'شوال' },
  { name: 'Dhu al-Qi\'dah', arabic: 'ذو القعدة' },
  { name: 'Dhu al-Hijjah', arabic: 'ذو الحجة' }
];

const ISLAMIC_DAYS = [
  { name: 'Sunday', arabic: 'الأحد' },
  { name: 'Monday', arabic: 'الاثنين' },
  { name: 'Tuesday', arabic: 'الثلاثاء' },
  { name: 'Wednesday', arabic: 'الأربعاء' },
  { name: 'Thursday', arabic: 'الخميس' },
  { name: 'Friday', arabic: 'الجمعة' },
  { name: 'Saturday', arabic: 'السبت' }
];

const CALENDAR_INFO: Record<IslamicCalendarType, IslamicCalendarInfo> = {
  'lunar': { type: 'lunar', name: 'Lunar Calendar', description: 'Traditional lunar calendar', region: 'Global', accuracy: 'high' },
  'umm-al-qura': { type: 'umm-al-qura', name: 'Umm al-Qura', description: 'Official calendar of Saudi Arabia', region: 'Saudi Arabia', accuracy: 'high' },
  'tabular': { type: 'tabular', name: 'Tabular Islamic', description: 'Mathematical calendar', region: 'Global', accuracy: 'high' },
  'kuwaiti': { type: 'kuwaiti', name: 'Kuwaiti Algorithm', description: 'Used in Kuwait', region: 'Kuwait', accuracy: 'high' },
  'makkah': { type: 'makkah', name: 'Makkah Calendar', description: 'Based on Makkah sighting', region: 'Makkah', accuracy: 'medium' },
  'karachi': { type: 'karachi', name: 'Karachi Calendar', description: 'Used in Pakistan', region: 'Pakistan', accuracy: 'high' },
  'istanbul': { type: 'istanbul', name: 'Istanbul Calendar', description: 'Used in Turkey', region: 'Turkey', accuracy: 'high' },
  'tehran': { type: 'tehran', name: 'Tehran Calendar', description: 'Used in Iran', region: 'Iran', accuracy: 'high' },
  'cairo': { type: 'cairo', name: 'Cairo Calendar', description: 'Used in Egypt', region: 'Egypt', accuracy: 'high' },
  'singapore': { type: 'singapore', name: 'Singapore Calendar', description: 'Used in Singapore', region: 'Singapore', accuracy: 'high' },
  'jakarta': { type: 'jakarta', name: 'Jakarta Calendar', description: 'Used in Indonesia', region: 'Indonesia', accuracy: 'high' }
};

export const IslamicCalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCalendar, setSelectedCalendarState] = useState<IslamicCalendarType>('lunar');

  useEffect(() => {
    const saved = localStorage.getItem('tijaniyah_islamic_calendar') as IslamicCalendarType;
    if (saved && saved in CALENDAR_INFO) {
      setSelectedCalendarState(saved);
    }
  }, []);

  const setSelectedCalendar = (calendar: IslamicCalendarType) => {
    setSelectedCalendarState(calendar);
    localStorage.setItem('tijaniyah_islamic_calendar', calendar);
  };

  const convertToIslamic = (gregorianDate: Date): IslamicDate => {
    const epoch = new Date(622, 6, 16);
    const daysSinceEpoch = Math.floor((gregorianDate.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
    const islamicYear = Math.floor(daysSinceEpoch / 354.367) + 1;
    const daysInYear = daysSinceEpoch % 354.367;
    
    let remainingDays = daysInYear;
    let month = 1;
    let day = 1;
    
    for (let i = 0; i < 12; i++) {
      const daysInMonth = (i % 2 === 0) ? 30 : 29;
      if (remainingDays < daysInMonth) {
        month = i + 1;
        day = Math.floor(remainingDays) + 1;
        break;
      }
      remainingDays -= daysInMonth;
    }
    
    const monthInfo = ISLAMIC_MONTHS[month - 1];
    const dayOfWeek = gregorianDate.getDay();
    const dayInfo = ISLAMIC_DAYS[dayOfWeek];
    
    return {
      day,
      month,
      year: islamicYear,
      monthName: monthInfo.name,
      monthNameArabic: monthInfo.arabic,
      dayName: dayInfo.name,
      dayNameArabic: dayInfo.arabic,
    };
  };

  const getCurrentIslamicDate = (): IslamicDate => {
    return convertToIslamic(new Date());
  };

  const getCalendarInfo = (type: IslamicCalendarType): IslamicCalendarInfo => {
    return CALENDAR_INFO[type];
  };

  const getAllCalendars = (): IslamicCalendarInfo[] => {
    return Object.values(CALENDAR_INFO);
  };

  return (
    <IslamicCalendarContext.Provider value={{
      selectedCalendar,
      setSelectedCalendar,
      getCurrentIslamicDate,
      getCalendarInfo,
      getAllCalendars,
      convertToIslamic,
    }}>
      {children}
    </IslamicCalendarContext.Provider>
  );
};

export const useIslamicCalendar = (): IslamicCalendarContextType => {
  const context = useContext(IslamicCalendarContext);
  if (!context) {
    throw new Error('useIslamicCalendar must be used within an IslamicCalendarProvider');
  }
  return context;
};

