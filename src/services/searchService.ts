export interface SearchResult {
  id: string;
  title: string;
  titleArabic?: string;
  description: string;
  type: 'prayer' | 'dua' | 'quran' | 'zikr' | 'wazifa' | 'lazim' | 'scholar' | 'mosque' | 'general';
  category: string;
  content?: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  screen?: string;
  specialties?: string[];
}

export const searchData: SearchResult[] = [
  {
    id: 'prayer-1',
    title: 'Fajr Prayer',
    titleArabic: 'صلاة الفجر',
    description: 'Dawn prayer time',
    type: 'prayer',
    category: 'Prayer Times',
  },
  {
    id: 'prayer-2',
    title: 'Dhuhr Prayer',
    titleArabic: 'صلاة الظهر',
    description: 'Midday prayer time',
    type: 'prayer',
    category: 'Prayer Times',
  },
  {
    id: 'prayer-3',
    title: 'Asr Prayer',
    titleArabic: 'صلاة العصر',
    description: 'Afternoon prayer time',
    type: 'prayer',
    category: 'Prayer Times',
  },
  {
    id: 'prayer-4',
    title: 'Maghrib Prayer',
    titleArabic: 'صلاة المغرب',
    description: 'Sunset prayer time',
    type: 'prayer',
    category: 'Prayer Times',
  },
  {
    id: 'prayer-5',
    title: 'Isha Prayer',
    titleArabic: 'صلاة العشاء',
    description: 'Night prayer time',
    type: 'prayer',
    category: 'Prayer Times',
  },
  {
    id: 'dua-1',
    title: 'Dua for Morning',
    titleArabic: 'دعاء الصباح',
    description: 'Morning supplication',
    type: 'dua',
    category: 'Duas',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    transliteration: 'Asbahna wa asbahal mulku lillah',
    translation: 'We have reached the morning and the dominion belongs to Allah',
  },
  {
    id: 'quran-1',
    title: 'Surah Al-Fatihah',
    titleArabic: 'سورة الفاتحة',
    description: 'The Opening - First chapter of Quran',
    type: 'quran',
    category: 'Quran',
  },
  {
    id: 'ahmad_tijani',
    title: 'Shaykh Ahmad Tijani (R.A)',
    titleArabic: 'الشيخ أحمد التجاني',
    description: 'Founder of Tariqa Tijaniyya & Seal of Muhammadan Sainthood',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Sufism', 'Islamic Law', 'Hadith', 'Tafsir', 'Spiritual Guidance'],
  },
  {
    id: 'general-1',
    title: 'Qibla Direction',
    titleArabic: 'اتجاه القبلة',
    description: 'Find the direction of Kaaba',
    type: 'general',
    category: 'Qibla',
    screen: 'Qibla',
  },
];

export const searchApp = (query: string): SearchResult[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  return searchData.filter(item => 
    item.title.toLowerCase().includes(lowercaseQuery) ||
    item.titleArabic?.toLowerCase().includes(lowercaseQuery) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.arabic?.toLowerCase().includes(lowercaseQuery) ||
    item.transliteration?.toLowerCase().includes(lowercaseQuery) ||
    item.translation?.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery) ||
    item.specialties?.some(specialty => specialty.toLowerCase().includes(lowercaseQuery))
  );
};

export const getSearchSuggestions = (query: string): string[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  const exactMatches = searchData.filter(item => 
    item.title.toLowerCase().includes(lowercaseQuery) ||
    item.titleArabic?.toLowerCase().includes(lowercaseQuery)
  );
  
  const partialMatches = searchData.filter(item => 
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery)
  );
  
  const allMatches = [...exactMatches, ...partialMatches];
  const uniqueMatches = allMatches.filter((item, index, self) => 
    index === self.findIndex(t => t.id === item.id)
  );
  
  return uniqueMatches.slice(0, 5).map(item => item.title);
};

