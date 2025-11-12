import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TimeFormat = '12h' | '24h';

interface TimeFormatContextType {
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
  formatTime: (date: Date) => string;
  formatTimeWithSeconds: (date: Date) => string;
}

const TimeFormatContext = createContext<TimeFormatContextType | undefined>(undefined);

interface TimeFormatProviderProps {
  children: ReactNode;
}

export const TimeFormatProvider: React.FC<TimeFormatProviderProps> = ({ children }) => {
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>('12h');

  useEffect(() => {
    const savedFormat = localStorage.getItem('tijaniyah_timeFormat') as TimeFormat;
    if (savedFormat && (savedFormat === '12h' || savedFormat === '24h')) {
      setTimeFormatState(savedFormat);
    }
  }, []);

  const setTimeFormat = (format: TimeFormat) => {
    setTimeFormatState(format);
    localStorage.setItem('tijaniyah_timeFormat', format);
  };

  const formatTime = (date: Date): string => {
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

  const formatTimeWithSeconds = (date: Date): string => {
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

  return (
    <TimeFormatContext.Provider value={{ timeFormat, setTimeFormat, formatTime, formatTimeWithSeconds }}>
      {children}
    </TimeFormatContext.Provider>
  );
};

export const useTimeFormat = (): TimeFormatContextType => {
  const context = useContext(TimeFormatContext);
  if (!context) {
    throw new Error('useTimeFormat must be used within a TimeFormatProvider');
  }
  return context;
};

