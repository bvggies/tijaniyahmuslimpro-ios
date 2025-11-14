import React, { useState, useMemo } from 'react';
import '../App.css';
import './DuasScreen.css';

interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  frenchTranslation?: string;
  hausaTranslation?: string;
  category: string;
  isFavorite?: boolean;
}

// Mock data for Duas
const mockDuas: Dua[] = [
  // Morning Duas
  {
    id: '1',
    title: 'Dua for Morning',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    transliteration: 'Asbahna wa asbahal mulku lillah',
    translation: 'We have reached the morning and the dominion belongs to Allah',
    frenchTranslation: 'Nous avons atteint le matin et la souveraineté appartient à Allah',
    hausaTranslation: 'Mun isa safe kuma mulki na Allah ne',
    category: 'Morning',
  },
  {
    id: '2',
    title: 'Morning Remembrance',
    arabic: 'اللَّهُمَّ أَصْبَحْنَا نُشْهِدُكَ وَنُشْهِدُ حَمَلَةَ عَرْشِكَ',
    transliteration: 'Allahumma asbahna nushhiduka wa nushhidu hamalata arshika',
    translation: 'O Allah, we have reached the morning and bear witness to You and the bearers of Your Throne',
    frenchTranslation: 'Ô Allah, nous avons atteint le matin et témoignons de Toi et des porteurs de Ton Trône',
    hausaTranslation: 'Ya Allah, mun isa safe kuma muna shaida a gare ka da masu ɗaukar kursiyinka',
    category: 'Morning',
  },
  
  // Evening Duas
  {
    id: '3',
    title: 'Dua for Evening',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    transliteration: 'Amsayna wa amsal mulku lillah',
    translation: 'We have reached the evening and the dominion belongs to Allah',
    frenchTranslation: 'Nous avons atteint le soir et la souveraineté appartient à Allah',
    hausaTranslation: 'Mun isa yamma kuma mulki na Allah ne',
    category: 'Evening',
  },
  {
    id: '4',
    title: 'Evening Remembrance',
    arabic: 'اللَّهُمَّ أَمْسَيْنَا نُشْهِدُكَ وَنُشْهِدُ حَمَلَةَ عَرْشِكَ',
    transliteration: 'Allahumma amsayna nushhiduka wa nushhidu hamalata arshika',
    translation: 'O Allah, we have reached the evening and bear witness to You and the bearers of Your Throne',
    frenchTranslation: 'Ô Allah, nous avons atteint le soir et témoignons de Toi et des porteurs de Ton Trône',
    hausaTranslation: 'Ya Allah, mun isa yamma kuma muna shaida a gare ka da masu ɗaukar kursiyinka',
    category: 'Evening',
  },
  
  // Eating Duas
  {
    id: '5',
    title: 'Dua Before Eating',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah',
    frenchTranslation: 'Au nom d\'Allah',
    hausaTranslation: 'Da sunan Allah',
    category: 'Eating',
  },
  {
    id: '6',
    title: 'Dua After Eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا',
    transliteration: 'Alhamdulillahil lathee at\'amana wa saqana',
    translation: 'Praise be to Allah who fed us and gave us drink',
    frenchTranslation: 'Louange à Allah qui nous a nourris et nous a donné à boire',
    hausaTranslation: 'Godiya ga Allah wanda ya ciyar da mu kuma ya ba mu ruwa',
    category: 'Eating',
  },
  
  // Travel Duas
  {
    id: '7',
    title: 'Dua for Travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا',
    transliteration: 'Subhanallathee sakhkhara lana hadha',
    translation: 'Glory to Him who has subjected this to us',
    frenchTranslation: 'Gloire à Celui qui nous a soumis cela',
    hausaTranslation: 'Tsarki ga wanda ya sanya wannan a hannunmu',
    category: 'Travel',
  },
  {
    id: '8',
    title: 'Dua When Leaving Home',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ',
    transliteration: 'Bismillahi tawakkaltu ala Allah',
    translation: 'In the name of Allah, I place my trust in Allah',
    frenchTranslation: 'Au nom d\'Allah, je place ma confiance en Allah',
    hausaTranslation: 'Da sunan Allah, na dora amanata a kan Allah',
    category: 'Travel',
  },
  
  // Prayer Duas
  {
    id: '9',
    title: 'Dua Before Prayer',
    arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ',
    transliteration: 'Allahumma ba\'id bayni wa bayna khataayaya',
    translation: 'O Allah, distance me from my sins',
    frenchTranslation: 'Ô Allah, éloigne-moi de mes péchés',
    hausaTranslation: 'Ya Allah, ka nisanta ni da zunubanku',
    category: 'Prayer',
  },
  {
    id: '10',
    title: 'Dua After Prayer',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ',
    transliteration: 'Astaghfirullah allathee la ilaha illa huwa',
    translation: 'I seek forgiveness from Allah, there is no god but He',
    frenchTranslation: 'Je demande pardon à Allah, il n\'y a de dieu que Lui',
    hausaTranslation: 'Ina neman gafara daga Allah, babu abin bautawa sai Shi',
    category: 'Prayer',
  },
  
  // Sleep Duas
  {
    id: '11',
    title: 'Dua Before Sleeping',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your name, O Allah, I die and I live',
    frenchTranslation: 'En Ton nom, ô Allah, je meurs et je vis',
    hausaTranslation: 'Da sunanka Ya Allah, ina mutuwa kuma ina rai',
    category: 'Sleep',
  },
  {
    id: '12',
    title: 'Dua After Waking Up',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا',
    transliteration: 'Alhamdulillahil lathee ahyana ba\'da ma amatana',
    translation: 'Praise be to Allah who gave us life after death',
    frenchTranslation: 'Louange à Allah qui nous a donné la vie après la mort',
    hausaTranslation: 'Godiya ga Allah wanda ya ba mu rai bayan mutuwa',
    category: 'Sleep',
  },
];

const DuasScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);

  // Load favorites from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('dua_favorites');
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)));
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: Set<string>) => {
    localStorage.setItem('dua_favorites', JSON.stringify(Array.from(newFavorites)));
    setFavorites(newFavorites);
  };

  const categories = useMemo(() => {
    const cats = new Set(mockDuas.map(dua => dua.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredDuas = useMemo(() => {
    let filtered = mockDuas;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(dua => dua.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(dua =>
        dua.title.toLowerCase().includes(query) ||
        dua.arabic.includes(query) ||
        dua.translation.toLowerCase().includes(query) ||
        dua.transliteration.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const toggleFavorite = (duaId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(duaId)) {
      newFavorites.delete(duaId);
    } else {
      newFavorites.add(duaId);
    }
    saveFavorites(newFavorites);
  };

  const handleShare = async (dua: Dua) => {
    const shareText = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: dua.title,
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Dua copied to clipboard!');
    }
  };

  const handleCopy = (dua: Dua) => {
    const copyText = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}`;
    navigator.clipboard.writeText(copyText);
    alert('Dua copied to clipboard!');
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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '16px' }}>
          Duas & Supplications
        </h1>

        {/* Search Bar */}
        <input
          type="text"
          className="input"
          placeholder="Search duas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Category Filter */}
      <div style={{
        padding: '20px',
        paddingBottom: '12px',
        overflowX: 'auto',
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          minWidth: 'max-content',
        }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: selectedCategory === category
                  ? 'linear-gradient(135deg, #11C48D 0%, #00BFA5 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: selectedCategory === category ? '#FFFFFF' : '#BBE1D5',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Duas List */}
      <div style={{ padding: '20px', paddingTop: '0' }}>
        {filteredDuas.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#BBE1D5' }}>No duas found matching your search.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredDuas.map((dua) => {
              const isFavorite = favorites.has(dua.id);
              
              return (
                <div
                  key={dua.id}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onClick={() => setSelectedDua(dua)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#E7F5F1',
                        marginBottom: '4px',
                      }}>
                        {dua.title}
                      </p>
                      <span style={{
                        fontSize: '12px',
                        color: '#11C48D',
                        background: 'rgba(17, 196, 141, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}>
                        {dua.category}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(dua.id);
                      }}
                      style={{
                        padding: '8px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '20px',
                      }}
                    >
                      {isFavorite ? '⭐' : '☆'}
                    </button>
                  </div>

                  <p style={{
                    fontSize: '20px',
                    color: '#E7F5F1',
                    textAlign: 'right',
                    lineHeight: '1.8',
                    marginBottom: '12px',
                    fontFamily: 'Amiri, "Arabic Typesetting", serif',
                  }}>
                    {dua.arabic}
                  </p>

                  <p style={{
                    fontSize: '14px',
                    color: '#9E9E9E',
                    fontStyle: 'italic',
                    marginBottom: '8px',
                  }}>
                    {dua.transliteration}
                  </p>

                  <p style={{
                    fontSize: '14px',
                    color: '#BBE1D5',
                    lineHeight: '1.6',
                  }}>
                    {dua.translation}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dua Detail Modal */}
      {selectedDua && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedDua(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#E7F5F1',
                  marginBottom: '8px',
                }}>
                  {selectedDua.title}
                </h2>
                <span style={{
                  fontSize: '12px',
                  color: '#11C48D',
                  background: 'rgba(17, 196, 141, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}>
                  {selectedDua.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedDua(null)}
                style={{
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  color: '#E7F5F1',
                }}
              >
                ✕
              </button>
            </div>

            <p style={{
              fontSize: '28px',
              color: '#E7F5F1',
              textAlign: 'right',
              lineHeight: '2',
              marginBottom: '20px',
              fontFamily: 'Amiri, "Arabic Typesetting", serif',
            }}>
              {selectedDua.arabic}
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              <p style={{
                fontSize: '16px',
                color: '#9E9E9E',
                fontStyle: 'italic',
                marginBottom: '12px',
              }}>
                {selectedDua.transliteration}
              </p>
              <p style={{
                fontSize: '18px',
                color: '#BBE1D5',
                lineHeight: '1.8',
              }}>
                {selectedDua.translation}
              </p>
            </div>

            {selectedDua.frenchTranslation && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#9E9E9E',
                  marginBottom: '8px',
                }}>
                  French Translation:
                </p>
                <p style={{
                  fontSize: '16px',
                  color: '#BBE1D5',
                  lineHeight: '1.6',
                }}>
                  {selectedDua.frenchTranslation}
                </p>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
            }}>
              <button
                onClick={() => toggleFavorite(selectedDua.id)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                {favorites.has(selectedDua.id) ? '⭐ Remove Favorite' : '☆ Add Favorite'}
              </button>
              <button
                onClick={() => handleShare(selectedDua)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                📤 Share
              </button>
              <button
                onClick={() => handleCopy(selectedDua)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                📋 Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuasScreen;

