import React, { useState, useEffect } from 'react';
import {
  getQuranChapters,
  getChapterById,
  getVersesByChapter,
  searchQuran,
  addBookmark,
  removeBookmark,
  getBookmarks,
  QuranChapter,
  QuranVerse,
} from '../services/quranService';
import '../App.css';
import './QuranScreen.css';

const QuranScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'chapters' | 'verses' | 'search'>('chapters');
  const [chapters, setChapters] = useState<QuranChapter[]>([]);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);
  const [searchResults, setSearchResults] = useState<{ chapters: QuranChapter[], verses: QuranVerse[] }>({ chapters: [], verses: [] });

  useEffect(() => {
    loadChapters();
    loadBookmarks();
  }, []);

  const loadChapters = async () => {
    try {
      setIsLoadingChapters(true);
      const quranChapters = await getQuranChapters();
      setChapters(quranChapters);
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setIsLoadingChapters(false);
    }
  };

  const loadBookmarks = () => {
    const storedBookmarks = getBookmarks();
    const bookmarkSet = new Set(storedBookmarks.map(b => `${b.surah}:${b.verse}`));
    setBookmarks(bookmarkSet);
  };

  const handleChapterSelect = async (chapterId: number) => {
    setSelectedChapter(chapterId);
    setIsLoadingVerses(true);
    setViewMode('verses');
    try {
      const full = await getVersesByChapter(chapterId, 'en');
      setVerses(full);
    } catch (error) {
      console.error('Error loading verses:', error);
    } finally {
      setIsLoadingVerses(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await searchQuran(query, chapters);
      setSearchResults(results);
      setViewMode('search');
    } else {
      setViewMode('chapters');
    }
  };

  const toggleBookmark = (surah: number, verse: number) => {
    const key = `${surah}:${verse}`;
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(key)) {
      newBookmarks.delete(key);
      removeBookmark(surah, verse);
    } else {
      newBookmarks.add(key);
      addBookmark(surah, verse);
    }
    setBookmarks(newBookmarks);
  };

  const handleShare = async (verse: QuranVerse) => {
    const chapter = selectedChapter ? getChapterById(selectedChapter, chapters) : null;
    const shareText = `${chapter?.name || 'Quran'} ${verse.surah}:${verse.verse}\n\n${verse.arabic}\n\n${verse.translation}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quran Verse',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Verse copied to clipboard!');
    }
  };

  const handleCopy = (verse: QuranVerse) => {
    const chapter = selectedChapter ? getChapterById(selectedChapter, chapters) : null;
    const copyText = `${chapter?.name || 'Quran'} ${verse.surah}:${verse.verse}\n\n${verse.arabic}\n\n${verse.translation}`;
    navigator.clipboard.writeText(copyText);
    alert('Verse copied to clipboard!');
  };

  const goBack = () => {
    if (viewMode === 'verses') {
      setViewMode('chapters');
      setSelectedChapter(null);
    } else if (viewMode === 'search') {
      setViewMode('chapters');
      setSearchQuery('');
    }
  };

  if (isLoadingChapters) {
    return (
      <div className="quran-screen">
        <div className="quran-loading">
          <div className="spinner"></div>
          <p>Loading Quran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quran-screen">
      {/* Header */}
      <div className="quran-header">
        <div className="quran-header-content">
          <h1 className="quran-header-title">
            {viewMode === 'verses' ? 'Quran' : viewMode === 'search' ? 'Search Results' : 'Quran'}
          </h1>
          {viewMode !== 'chapters' && (
            <button
              onClick={goBack}
              className="quran-back-button"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="quran-search-container">
          <input
            type="text"
            className="quran-search-input"
            placeholder="Search chapters or verses..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="quran-content">
        {viewMode === 'chapters' && (
          <div>
            <h2 className="quran-section-title">
              Chapters ({chapters.length})
            </h2>
            <div className="quran-chapters-grid">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="quran-chapter-card"
                  onClick={() => handleChapterSelect(chapter.id)}
                >
                  <div className="quran-chapter-number">
                    {chapter.id}
                  </div>
                  <div className="quran-chapter-info">
                    <p className="quran-chapter-name">
                      {chapter.name}
                    </p>
                    <p className="quran-chapter-name-arabic">
                      {chapter.nameArabic}
                    </p>
                    <div className="quran-chapter-meta">
                      <span>{chapter.verses} verses</span>
                      <span>•</span>
                      <span>{chapter.revelationPlace}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '20px', color: '#BBE1D5' }}>→</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'verses' && (
          <div>
            {selectedChapter && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '24px', color: '#E7F5F1', marginBottom: '8px' }}>
                  {getChapterById(selectedChapter, chapters)?.name}
                </h2>
                <p style={{ fontSize: '18px', color: '#BBE1D5', textAlign: 'right', marginBottom: '4px' }}>
                  {getChapterById(selectedChapter, chapters)?.nameArabic}
                </p>
                <p style={{ fontSize: '14px', color: '#9E9E9E' }}>
                  {getChapterById(selectedChapter, chapters)?.meaning} • {getChapterById(selectedChapter, chapters)?.verses} verses
                </p>
              </div>
            )}

            {isLoadingVerses ? (
              <div className="quran-loading">
                <div className="spinner"></div>
                <p>Loading verses...</p>
              </div>
            ) : (
              <div>
                {verses.map((verse) => {
                  const isBookmarked = bookmarks.has(`${verse.surah}:${verse.verse}`);
                  
                  return (
                    <div
                      key={`${verse.surah}-${verse.verse}`}
                      className="quran-verse-card"
                    >
                      <div className="quran-verse-header">
                        <div className="quran-verse-number">
                          {verse.verse}
                        </div>
                        <div className="quran-verse-actions">
                          <button
                            onClick={() => toggleBookmark(verse.surah, verse.verse)}
                            className="quran-action-button"
                            style={{ background: isBookmarked ? '#FFD54F' : 'rgba(255,255,255,0.1)' }}
                          >
                            {isBookmarked ? '⭐' : '☆'}
                          </button>
                          <button
                            onClick={() => handleShare(verse)}
                            className="quran-action-button"
                          >
                            📤
                          </button>
                          <button
                            onClick={() => handleCopy(verse)}
                            className="quran-action-button"
                          >
                            📋
                          </button>
                        </div>
                      </div>

                      <p className="quran-verse-arabic">
                        {verse.arabic}
                      </p>

                      <p className="quran-verse-translation">
                        {verse.translation}
                      </p>

                      {verse.transliteration && (
                        <p className="quran-verse-transliteration">
                          {verse.transliteration}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {viewMode === 'search' && (
          <div>
            <h2 style={{ fontSize: '20px', color: '#E7F5F1', marginBottom: '16px' }}>
              Search Results for "{searchQuery}"
            </h2>
            
            {searchResults.chapters.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', color: '#BBE1D5', marginBottom: '12px' }}>Chapters</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {searchResults.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="card"
                      onClick={() => handleChapterSelect(chapter.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <p style={{ fontSize: '16px', fontWeight: '600', color: '#E7F5F1' }}>
                        {chapter.name} ({chapter.nameArabic})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.verses.length > 0 && (
              <div>
                <h3 style={{ fontSize: '18px', color: '#BBE1D5', marginBottom: '12px' }}>Verses</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {searchResults.verses.map((verse) => (
                    <div key={`${verse.surah}-${verse.verse}`} className="card">
                      <p style={{ fontSize: '14px', color: '#9E9E9E', marginBottom: '8px' }}>
                        {getChapterById(verse.surah, chapters)?.name} {verse.surah}:{verse.verse}
                      </p>
                      <p style={{ fontSize: '20px', color: '#E7F5F1', textAlign: 'right', marginBottom: '8px' }}>
                        {verse.arabic}
                      </p>
                      <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
                        {verse.translation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.chapters.length === 0 && searchResults.verses.length === 0 && (
              <p style={{ color: '#BBE1D5', textAlign: 'center', padding: '40px' }}>
                No results found for "{searchQuery}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranScreen;

