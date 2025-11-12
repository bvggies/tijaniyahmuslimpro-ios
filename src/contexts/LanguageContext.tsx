import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'fr' | 'ar' | 'ha';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation data (simplified - can be expanded)
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.tijaniyah_features': 'Tijaniyah Features',
    'nav.qibla': 'Qibla',
    'nav.quran': 'Quran',
    'nav.duas': 'Duas',
    'nav.more': 'More',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.search': 'Search',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.tijaniyah_features': 'Fonctionnalités Tijaniyah',
    'nav.qibla': 'Qibla',
    'nav.quran': 'Coran',
    'nav.duas': 'Duas',
    'nav.more': 'Plus',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.search': 'Rechercher',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.tijaniyah_features': 'ميزات التيجانية',
    'nav.qibla': 'القبلة',
    'nav.quran': 'القرآن',
    'nav.duas': 'الأدعية',
    'nav.more': 'المزيد',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.search': 'بحث',
  },
  ha: {
    'nav.home': 'Gida',
    'nav.tijaniyah_features': 'Fasalolin Tijaniyah',
    'nav.qibla': 'Qibla',
    'nav.quran': 'Alkur\'ani',
    'nav.duas': 'Addu\'o\'i',
    'nav.more': 'Kara',
    'common.loading': 'Ana lodawa...',
    'common.error': 'Kuskure',
    'common.success': 'Nasara',
    'common.cancel': 'Soke',
    'common.save': 'Ajiye',
    'common.search': 'Nemo',
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('tijaniyah_language') as Language;
    if (savedLanguage && ['en', 'fr', 'ar', 'ha'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('tijaniyah_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

