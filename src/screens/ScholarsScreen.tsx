import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

interface Scholar {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  image?: string;
}

// Simplified scholar data - in production, this would come from an API
const SCHOLARS: Scholar[] = [
  {
    id: 'ahmad_tijani',
    name: 'Shaykh Ahmad Tijani (R.A)',
    title: 'Founder of Tariqa Tijaniyya & Seal of Muhammadan Sainthood',
    bio: 'Sidi Abu Abbas Ahmad al-Tijani (1737-1815), founder of the Tariqa Tijaniyya, was born in Ain Madi, Algeria. A descendant of the Prophet Muhammad through Hasan and Mawlay Idris, he established the most widespread Sufi order in West Africa.',
    specialties: ['Tariqa Tijaniyya', 'Sufism', 'Islamic Law', 'Hadith', 'Tafsir'],
    image: '/assets/images/Shaykh Ahmad.jpg',
  },
  {
    id: 'sheikh_muhammad_gibrima',
    name: 'Sheikh Muhammad Gibrima (Zul-Ma\'arif) (1902–1975)',
    title: 'Distinguished Tijani Scholar & Sufi of Nguru, Nigeria',
    bio: 'Sheikh Muhammad Gibrima was a distinguished Islamic scholar and Sufi from Nguru, Yobe State, Nigeria. A prolific author, he wrote works including Jihaazu Saarih, Suril Musuun, Sidrat Al Muntahaa, Far\'u An Nawaal, and Shajarat Al Kaun.',
    specialties: ['Tariqa Tijaniyya', 'Sufism', 'Islamic Scholarship', 'Authorship'],
    image: '/assets/images/SHEIKH FATIHU.jpg',
  },
  {
    id: 'sheikh_aliyu_harazimi_kano',
    name: 'Shaykh Aliyu Harazimi (Kano) (1919–2013)',
    title: 'Tijani Sufi Ascetic of Kano – Abu\'l‑Anwar, Sahib al‑Dhikr',
    bio: 'A renowned Tijani ascetic and guide in Kano, emblematic of piety and world‑renunciation. His zawiya in Hausawa became famous in the 1980s for energetic dhikr and training seekers toward ma\'rifa.',
    specialties: ['Tariqa Tijaniyya', 'Dhikr & Salawat', 'Asceticism', 'Spiritual Training'],
    image: '/assets/images/sheikaliu.jpeg',
  },
  {
    id: 'ali_harazim_al_barada',
    name: 'Khalifat Al-Akbar, Sidi Ali Harazim Al-Barada (R.A)',
    title: 'Greatest Inheritor of Shaykh Ahmad Tijani & Author of Jawahir al-Ma\'ani',
    bio: 'Gifted with gnosis and consummate sainthood, Sidi Ali Harazim was known as the greatest inheritor (khalifa) of Shaykh Ahmad Tijani, and was commended to the Shaykh by the Prophet Muhammad himself.',
    specialties: ['Tariqa Tijaniyya', 'Sufism', 'Spiritual Guidance', 'Jawahir al-Ma\'ani'],
    image: '/assets/images/Shaykh Ahmad.jpg',
  },
  {
    id: 'ibrahim_niasse',
    name: 'Shaykh Ibrahim Niasse (R.A)',
    title: 'The Fayda & Spiritual Guide',
    bio: 'Shaykh Ibrahim Niasse was a prominent Tijani scholar who spread the Tariqa Tijaniyya throughout West Africa. He was known for his spiritual guidance and the Fayda (spiritual flood).',
    specialties: ['Tariqa Tijaniyya', 'Fayda', 'Spiritual Guidance', 'West African Islam'],
    image: '/assets/images/Al-HajjMalikSy.jpg',
  },
  {
    id: 'usman_dan_fodio',
    name: 'Sheikh Usman ɗan Fodio (Shehu) (1764–1817)',
    title: 'Founder of the Sokoto Caliphate & West African Reformer',
    bio: 'Born in Gobir, Usman was a Fulani-Torodbe scholar who preached Sunni Islam across Hausaland. He authored over a hundred works on religion, law, governance, culture, and society.',
    specialties: ['Sokoto Caliphate', 'Islamic Reform', 'Sunni Law', 'Education'],
    image: '/assets/images/SHEIKH OSMAN.jpg',
  },
];

const ScholarsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScholars = SCHOLARS.filter(scholar =>
    scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholar.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholar.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '8px' }}>
          👨‍🏫 Tijaniya Scholars
        </h1>
        <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
          Learn about the great scholars of Tariqa Tijaniyya
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search scholars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ width: '100%' }}
          />
        </div>

        {/* Scholars Grid */}
        {filteredScholars.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍🏫</p>
            <p style={{ fontSize: '18px', color: '#E7F5F1', marginBottom: '8px' }}>
              No scholars found
            </p>
            <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
              Try adjusting your search query
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {filteredScholars.map((scholar) => (
              <div
                key={scholar.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => navigate(`/scholar/${scholar.id}`, { state: { scholar } })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                }}
              >
                {scholar.image && (
                  <img
                    src={scholar.image}
                    alt={scholar.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '16px',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#E7F5F1',
                  marginBottom: '8px',
                }}>
                  {scholar.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#00BFA5',
                  marginBottom: '12px',
                  fontWeight: '500',
                }}>
                  {scholar.title}
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#BBE1D5',
                  lineHeight: '1.6',
                  marginBottom: '12px',
                }}>
                  {scholar.bio.substring(0, 150)}...
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {scholar.specialties.slice(0, 3).map((specialty, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        background: 'rgba(0, 191, 165, 0.2)',
                        color: '#00BFA5',
                        fontSize: '11px',
                        fontWeight: '500',
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                  {scholar.specialties.length > 3 && (
                    <span style={{ fontSize: '11px', color: '#BBE1D5' }}>
                      +{scholar.specialties.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarsScreen;

