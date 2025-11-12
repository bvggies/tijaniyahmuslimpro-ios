// Quran service for web - simplified version
// In production, this would fetch from an API or use a complete dataset

export interface QuranChapter {
  id: number;
  name: string;
  nameArabic: string;
  nameTransliterated: string;
  meaning: string;
  verses: number;
  revelationPlace: 'Mecca' | 'Medina';
}

export interface QuranVerse {
  surah: number;
  verse: number;
  arabic: string;
  translation: string;
  transliteration?: string;
  frenchTranslation?: string;
  hausaTranslation?: string;
}

// Sample chapters data (in production, use complete dataset)
const sampleChapters: QuranChapter[] = [
  { id: 1, name: 'Al-Fatiha', nameArabic: 'الفاتحة', nameTransliterated: 'Al-Fatiha', meaning: 'The Opening', verses: 7, revelationPlace: 'Mecca' },
  { id: 2, name: 'Al-Baqarah', nameArabic: 'البقرة', nameTransliterated: 'Al-Baqarah', meaning: 'The Cow', verses: 286, revelationPlace: 'Medina' },
  { id: 3, name: 'Ali Imran', nameArabic: 'آل عمران', nameTransliterated: 'Ali Imran', meaning: 'Family of Imran', verses: 200, revelationPlace: 'Medina' },
  // Add more chapters as needed
];

// Fetch chapters from API or use local data
export const getQuranChapters = async (): Promise<QuranChapter[]> => {
  try {
    // Try to fetch from API
    const response = await fetch('https://api.alquran.cloud/v1/meta');
    if (response.ok) {
      const data = await response.json();
      const surahs = data.data?.surahs?.references || [];
      return surahs.map((s: any) => ({
        id: s.number,
        name: s.englishName,
        nameArabic: s.name,
        nameTransliterated: s.englishNameTranslation,
        meaning: s.englishNameTranslation,
        verses: s.numberOfAyahs,
        revelationPlace: s.revelationType === 'Meccan' ? 'Mecca' : 'Medina',
      }));
    }
  } catch (error) {
    console.warn('Failed to fetch chapters from API, using sample data:', error);
  }
  
  return sampleChapters;
};

export const getChapterById = (id: number, chapters: QuranChapter[]): QuranChapter | undefined => {
  return chapters.find(chapter => chapter.id === id);
};

// Fetch verses for a chapter
export const getVersesByChapter = async (chapterId: number, language: string = 'en'): Promise<QuranVerse[]> => {
  try {
    let translationId = 'en.sahih';
    if (language === 'fr') {
      translationId = 'fr.hamidullah';
    }
    
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${chapterId}/editions/quran-simple,${translationId}`);
    if (!response.ok) throw new Error('Failed to fetch verses');
    
    const json = await response.json();
    const editions = json.data || [];
    const arabic = editions.find((e: any) => e.edition?.identifier === 'quran-simple' || e.edition?.language === 'ar');
    const translation = editions.find((e: any) => e.edition?.identifier === translationId || e.edition?.language === language);
    
    const verses: QuranVerse[] = [];
    const max = Math.max(
      Array.isArray(arabic?.ayahs) ? arabic.ayahs.length : 0,
      Array.isArray(translation?.ayahs) ? translation.ayahs.length : 0
    );
    
    for (let i = 0; i < max; i++) {
      const a = arabic?.ayahs?.[i];
      const t = translation?.ayahs?.[i];
      verses.push({
        surah: chapterId,
        verse: (a?.numberInSurah || t?.numberInSurah || i + 1),
        arabic: a?.text || '',
        translation: t?.text || '',
        transliteration: '',
        frenchTranslation: language === 'fr' ? t?.text : undefined,
        hausaTranslation: language === 'ha' ? t?.text : undefined,
      });
    }
    
    return verses;
  } catch (error) {
    console.error('Error fetching verses:', error);
    return [];
  }
};

export const searchQuran = async (query: string, chapters: QuranChapter[]): Promise<{ chapters: QuranChapter[], verses: QuranVerse[] }> => {
  const lowercaseQuery = query.toLowerCase();
  
  const matchingChapters = chapters.filter(chapter =>
    chapter.name.toLowerCase().includes(lowercaseQuery) ||
    chapter.nameArabic.includes(query) ||
    chapter.nameTransliterated.toLowerCase().includes(lowercaseQuery) ||
    chapter.meaning.toLowerCase().includes(lowercaseQuery)
  );

  // For verse search, we'd need to search through verses
  // This is simplified - in production, use a search API
  const matchingVerses: QuranVerse[] = [];

  return { chapters: matchingChapters, verses: matchingVerses };
};

// Bookmark management using localStorage
const BOOKMARKS_KEY = 'quran_bookmarks';

export interface QuranBookmark {
  surah: number;
  verse: number;
  timestamp: string;
  note?: string;
}

export const getBookmarks = (): QuranBookmark[] => {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addBookmark = (surah: number, verse: number, note?: string): void => {
  try {
    const bookmarks = getBookmarks();
    const bookmark: QuranBookmark = {
      surah,
      verse,
      timestamp: new Date().toISOString(),
      note
    };
    
    // Check if bookmark already exists
    const exists = bookmarks.find(b => b.surah === surah && b.verse === verse);
    if (!exists) {
      bookmarks.push(bookmark);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  } catch (error) {
    console.error('Error adding bookmark:', error);
  }
};

export const removeBookmark = (surah: number, verse: number): void => {
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(b => !(b.surah === surah && b.verse === verse));
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing bookmark:', error);
  }
};

