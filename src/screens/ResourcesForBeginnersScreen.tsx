import React, { useState } from 'react';
import { colors } from '../utils/theme';
import './ResourcesForBeginnersScreen.css';

const ResourcesForBeginnersScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Terms', icon: '📋' },
    { id: 'common', name: 'Common Phrases', icon: '💬' },
    { id: 'prayer', name: 'Prayer Terms', icon: '⏰' },
    { id: 'quran', name: 'Quran Terms', icon: '📖' },
    { id: 'islamic', name: 'Islamic Concepts', icon: '⭐' },
  ];

  interface Term {
    term: string;
    meaning: string;
    category: string;
    description?: string;
  }

  const commonPhrases: Term[] = [
    {
      term: "AL-HAMDU LILLAHI RABBIL 'ALAMIN",
      meaning: "Praise be to Allah, the Lord of the worlds.",
      description: "This is a verse from the Qur'an that Muslims recite and say many times per day. A Muslim invokes the praises of Allah before he does his daily work; and when he finishes, he thanks Allah for His favors.",
      category: 'common'
    },
    {
      term: "ALLAHU AKBAR",
      meaning: "Allah is the Greatest.",
      description: "This statement is said by Muslims numerous times. During the call for prayer, during prayer, when they are happy, and wish to express their approval of what they hear.",
      category: 'common'
    },
    {
      term: "ASSALAMU 'ALAIKUM",
      meaning: "Peace be upon you.",
      description: "This is an expression Muslims say whenever they meet one another. It is a statement of greeting with peace. Muslims try to establish peace on earth even through the friendly relation of greeting.",
      category: 'common'
    },
    {
      term: "ASTAGHFIRULLAH",
      meaning: "I ask Allah forgiveness.",
      description: "This is an expression used by a Muslim when he wants to ask Allah forgiveness. A Muslim says this phrase many times, even when he is talking to another person.",
      category: 'common'
    },
    {
      term: "BISMILLAHIR RAHMANIR RAHIM",
      meaning: "In the name of Allah, the Most Beneficent, the Most Merciful.",
      description: "This is a phrase from the Qur'an that is recited before reading the Qur'an. This phrase is also recited before doing any daily activity.",
      category: 'common'
    },
    {
      term: "IN SHA' ALLAH",
      meaning: "If Allah wills.",
      description: "When a person wishes to plan for the future, when he promises, when he makes resolutions, and when he makes a pledge, he makes them with permission and the will of Allah.",
      category: 'common'
    },
    {
      term: "MA SHA' ALLAH",
      meaning: "Whatever Allah wants.",
      description: "This is an expression that Muslims say whenever they are excited and surprised. When they wish to express their happiness, they use such an expression.",
      category: 'common'
    },
    {
      term: "LA ILAHA ILLALLAH",
      meaning: "There is no lord worthy of worship except Allah.",
      description: "This expression is the most important one in Islam. It is the creed that every person has to say to be considered a Muslim. It is part of the first pillar of Islam.",
      category: 'islamic'
    },
    {
      term: "MUHAMMADUN RASULULLAH",
      meaning: "Muhammad is the messenger of Allah.",
      description: "This statement is the second part of the first pillar of Islam. The meaning of this part is that Prophet Muhammad is the last and final prophet and messenger of Allah to mankind.",
      category: 'islamic'
    },
    {
      term: "SALLALLAHU 'ALAIHI WA SALLAM",
      meaning: "May the blessings and the peace of Allah be upon him (Muhammad).",
      description: "When the name of Prophet Muhammad (saw) is mentioned or written, a Muslim is to respect him and invoke this statement of peace upon him.",
      category: 'islamic'
    },
    {
      term: "SUBHANAHU WA TA'ALA",
      meaning: "Allah is pure of having partners and He is exalted from having a son.",
      description: "This is an expression that Muslims use whenever the name of Allah is pronounced or written. Muslims believe that Allah is the only God, the Creator of the Universe.",
      category: 'islamic'
    },
    {
      term: "JAZAKALLAHU KHAYRAN",
      meaning: "May Allah reward you for the good.",
      description: "This is a statement of thanks and appreciation to be said to the person who does a favor. Instead of saying 'thanks', the Islamic statement of thanks is to say this phrase.",
      category: 'common'
    },
    {
      term: "BARAKALLAH",
      meaning: "May the blessings of Allah (be upon you).",
      description: "This is an expression which means: 'May the blessings of Allah (be upon you).' When a Muslim wants to thank to another person, he uses different statements to express his thanks.",
      category: 'common'
    },
    {
      term: "INNA LILLAHI WA INNA ILAHI RAJI'UN",
      meaning: "We are from Allah and to Whom we are returning.",
      description: "When a Muslim is struck with a calamity, when he loses one of his loved ones, or when he has gone bankrupt, he should be patient and say this statement.",
      category: 'islamic'
    },
    {
      term: "LA HAWLA WA LA QUWWATA ILLA BILLAH",
      meaning: "There is no power and no strength save in Allah.",
      description: "This expression is read by a Muslim when he is struck by a calamity, or is taken over by a situation beyond his control. A Muslim puts his trust in the hands of Allah.",
      category: 'islamic'
    }
  ];

  const prayerTerms: Term[] = [
    { term: "ADHAAN", meaning: "The Muslim Call To Prayer", category: 'prayer' },
    { term: "ASR", meaning: "The Afternoon Prayer", category: 'prayer' },
    { term: "FAJR", meaning: "The Dawn Prayer", category: 'prayer' },
    { term: "MAGHRIB", meaning: "Prayer After Sunset", category: 'prayer' },
    { term: "ISHA", meaning: "The Night Prayer", category: 'prayer' },
    { term: "DUHR", meaning: "Noon Prayer", category: 'prayer' },
    { term: "SALAT", meaning: "Prayers", category: 'prayer' },
    { term: "RAK'AH", meaning: "A Unit Of Prayer", category: 'prayer' },
    { term: "QIBLAH", meaning: "Direction In Which All Muslim Pray", category: 'prayer' },
    { term: "WUDU", meaning: "Ritual Washing With Water To Be Pure For Prayer", category: 'prayer' },
    { term: "MASJID", meaning: "Mosque", category: 'prayer' },
    { term: "IMAM", meaning: "A Leader In The Community (Also Leads Prayer)", category: 'prayer' }
  ];

  const quranTerms: Term[] = [
    { term: "QUR'AN", meaning: "The Word Of God - The Final Revelation From God", category: 'quran' },
    { term: "AYAH", meaning: "A Verse Of The Holy Qur'an", category: 'quran' },
    { term: "SURAH", meaning: "A Chapter Of The Holy Qur'an", category: 'quran' },
    { term: "FATIHAH", meaning: "The Opening Chapter", category: 'quran' },
    { term: "JUZ", meaning: "A Part Of The Holy Qur'an", category: 'quran' },
    { term: "QARI", meaning: "One Who Memorizes The Qur'an By Heart", category: 'quran' },
    { term: "TAJWEED", meaning: "Recitation Of The Holy Qur'an With Precise Articulation", category: 'quran' },
    { term: "TAFSIR", meaning: "A Commentary", category: 'quran' },
    { term: "TILAWAT", meaning: "Reciting The Holy Qur'an And Conveying It's Message", category: 'quran' }
  ];

  const islamicConcepts: Term[] = [
    { term: "ISLAM", meaning: "Submission To The Will Of God", category: 'islamic' },
    { term: "IMAAN", meaning: "Faith", category: 'islamic' },
    { term: "TAQWA", meaning: "Fear Of God (Fear To Do Anything That Would Displease God)", category: 'islamic' },
    { term: "TAWHEED", meaning: "The Divine Unity", category: 'islamic' },
    { term: "SUNNAH", meaning: "The Traditions And Practices Of Muhammad", category: 'islamic' },
    { term: "HADITH", meaning: "Narrations/Reports Of The Deeds And Sayings Of The Holy Prophet", category: 'islamic' },
    { term: "SHARIAH", meaning: "The Islamic Law", category: 'islamic' },
    { term: "JIHAD", meaning: "A Struggle", category: 'islamic' },
    { term: "ZAKAT", meaning: "The Muslims Wealth Tax - It Is Compulsory On All Muslims", category: 'islamic' },
    { term: "HAJJ", meaning: "Pilgrimage To Mecca During The Islamic Month Of Dhul-Hijjah", category: 'islamic' },
    { term: "RAMADAN", meaning: "The Holy Month In The Islamic Calendar", category: 'islamic' },
    { term: "JANNAH", meaning: "Paradise", category: 'islamic' },
    { term: "JAHANAM", meaning: "Hell", category: 'islamic' },
    { term: "MALAIKAH", meaning: "Angels", category: 'islamic' },
    { term: "JIN", meaning: "God's Creation Made Of Smokeless Fire", category: 'islamic' }
  ];

  const allTerms = [...commonPhrases, ...prayerTerms, ...quranTerms, ...islamicConcepts];

  const filteredTerms = allTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'common': return colors.accentTeal;
      case 'prayer': return colors.primary;
      case 'quran': return colors.success;
      case 'islamic': return colors.warning;
      default: return colors.accentTeal;
    }
  };

  return (
    <div className="resources-container">
      <div className="resources-scroll-content">
        {/* Header */}
        <div className="resources-header">
          <div className="resources-header-content">
            <span className="resources-header-icon">📚</span>
            <h1 className="resources-header-title">RESOURCES FOR BEGINNERS</h1>
            <p className="resources-header-subtitle">Islamic Terms & Phrases</p>
            <p className="resources-header-arabic">مصادر للمبتدئين</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="resources-search-container">
          <div className="resources-search-bar">
            <span className="resources-search-icon">🔍</span>
            <input
              type="text"
              className="resources-search-input"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="resources-categories-container">
          <div className="resources-categories-scroll">
            {categories.map(category => (
              <button
                key={category.id}
                className={`resources-category-button ${selectedCategory === category.id ? 'resources-category-button-selected' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="resources-category-icon">{category.icon}</span>
                <span className="resources-category-text">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="resources-results-header">
          <p className="resources-results-text">
            {filteredTerms.length} {selectedCategory === 'all' ? 'Terms' : categories.find(c => c.id === selectedCategory)?.name} Found
          </p>
        </div>

        {/* Terms List */}
        <div className="resources-terms-container">
          {filteredTerms.map((term, index) => (
            <div key={index} className="resources-term-card">
              <div 
                className="resources-term-gradient"
                style={{ background: `linear-gradient(135deg, ${getCategoryColor(term.category)} 0%, ${getCategoryColor(term.category)}80 100%)` }}
              >
                <div className="resources-term-header">
                  <span className="resources-term-icon">{categories.find(c => c.id === term.category)?.icon || '📋'}</span>
                  <h3 className="resources-term-text">{term.term}</h3>
                </div>
                <p className="resources-meaning-text">{term.meaning}</p>
                {term.description && (
                  <p className="resources-description-text">{term.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="resources-footer">
          <p className="resources-footer-text">
            "The best of people are those who benefit others"
          </p>
          <p className="resources-footer-subtext">
            - Prophet Muhammad (SAW)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesForBeginnersScreen;

