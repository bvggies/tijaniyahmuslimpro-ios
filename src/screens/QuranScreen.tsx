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
      <div className="App">
        <div className="flex-center" style={{ minHeight: '100vh' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: '#BBE1D5' }}>Loading Quran...</p>
        </div>
      </div>
    );
  }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1' }}>
            {viewMode === 'verses' ? 'Quran' : viewMode === 'search' ? 'Search Results' : 'Quran'}
          </h1>
          {viewMode !== 'chapters' && (
            <button
              onClick={goBack}
              style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#E7F5F1',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              ← Back
            </button>
          )}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          className="input"
          placeholder="Search chapters or verses..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            marginTop: '8px',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {viewMode === 'chapters' && (
          <div>
            <h2 style={{ fontSize: '20px', color: '#E7F5F1', marginBottom: '16px' }}>
              Chapters ({chapters.length})
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="card"
                  onClick={() => handleChapterSelect(chapter.id)}
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #11C48D 0%, #00BFA5 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}>
                      {chapter.id}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#E7F5F1',
                        marginBottom: '4px',
                      }}>
                        {chapter.name}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#BBE1D5',
                        textAlign: 'right',
                        marginBottom: '4px',
                      }}>
                        {chapter.nameArabic}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#9E9E9E',
                      }}>
                        {chapter.verses} verses • {chapter.revelationPlace}
                      </p>
                    </div>
                    <span style={{ fontSize: '20px', color: '#BBE1D5' }}>→</span>
                  </div>
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
              <div className="flex-center" style={{ padding: '40px' }}>
                <div className="spinner"></div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {verses.map((verse) => {
                  const isBookmarked = bookmarks.has(`${verse.surah}:${verse.verse}`);
                  
                  return (
                    <div
                      key={`${verse.surah}-${verse.verse}`}
                      className="card"
                      style={{
                        padding: '20px',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '16px',
                          background: 'linear-gradient(135deg, #11C48D 0%, #00BFA5 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}>
                          {verse.verse}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => toggleBookmark(verse.surah, verse.verse)}
                            style={{
                              padding: '8px',
                              background: isBookmarked ? '#FFD54F' : 'rgba(255,255,255,0.1)',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '18px',
                            }}
                          >
                            {isBookmarked ? '⭐' : '☆'}
                          </button>
                          <button
                            onClick={() => handleShare(verse)}
                            style={{
                              padding: '8px',
                              background: 'rgba(255,255,255,0.1)',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '18px',
                            }}
                          >
                            📤
                          </button>
                          <button
                            onClick={() => handleCopy(verse)}
                            style={{
                              padding: '8px',
                              background: 'rgba(255,255,255,0.1)',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '18px',
                            }}
                          >
                            📋
                          </button>
                        </div>
                      </div>

                      <p style={{
                        fontSize: '24px',
                        color: '#E7F5F1',
                        textAlign: 'right',
                        lineHeight: '1.8',
                        marginBottom: '16px',
                        fontFamily: 'Amiri, "Arabic Typesetting", serif',
                      }}>
                        {verse.arabic}
                      </p>

                      <p style={{
                        fontSize: '16px',
                        color: '#BBE1D5',
                        lineHeight: '1.6',
                        marginBottom: '8px',
                      }}>
                        {verse.translation}
                      </p>

                      {verse.transliteration && (
                        <p style={{
                          fontSize: '14px',
                          color: '#9E9E9E',
                          fontStyle: 'italic',
                        }}>
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

