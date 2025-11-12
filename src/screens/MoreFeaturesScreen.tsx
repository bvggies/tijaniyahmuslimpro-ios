import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchApp, getSearchSuggestions, SearchResult } from '../services/searchService';
import './MoreFeaturesScreen.css';

interface Feature {
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

const MoreFeaturesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchApp(query);
      const suggestions = getSearchSuggestions(query);
      setSearchResults(results);
      setSearchSuggestions(suggestions);
    } else {
      setSearchResults([]);
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleSearchResultPress = (result: SearchResult) => {
    if (result.screen) {
      // Map screen names to routes
      const screenToRoute: { [key: string]: string } = {
        'Scholars': '/scholars',
        'Qibla': '/qibla',
        'Prayer Times': '/prayer-times',
        'Tasbih': '/tasbih',
        'Wazifa': '/wazifa',
        'Lazim': '/lazim-tracker',
        'TijaniyaLazim': '/tijaniya-lazim',
        'Azan': '/azan',
        'ZikrJumma': '/zikr-jumma',
        'Journal': '/journal',
        'Lessons': '/lessons',
        'Community': '/community',
        'Mosque': '/mosque',
        'Makkah Live': '/makkah-live',
        'AI Noor': '/ai-noor',
        'Donate': '/donate',
        'ZakatCalculator': '/zakat-calculator',
        'Hajj': '/hajj',
        'NotificationSettings': '/notifications',
      };
      
      const route = screenToRoute[result.screen] || `/${result.screen.toLowerCase().replace(/\s+/g, '-')}`;
      navigate(route);
    } else if (result.type === 'prayer') {
      navigate('/prayer-times');
    } else if (result.type === 'dua') {
      navigate('/duas');
    } else if (result.type === 'quran') {
      navigate('/quran');
    }
  };

  const handleAINoorSearch = () => {
    navigate('/ai-noor', { state: { searchQuery: searchQuery.trim() } });
  };

  const features: Feature[] = [
    {
      title: 'Digital Tasbih',
      description: 'Count your dhikr with our digital tasbih',
      icon: '📿',
      color: '#FFD54F',
      path: '/tasbih',
    },
    {
      title: 'Wazifa',
      description: 'Daily Islamic practices and routines',
      icon: '✅',
      color: '#F57F17',
      path: '/wazifa',
    },
    {
      title: 'Lazim Tracker',
      description: 'Track your daily Islamic commitments',
      icon: '📋',
      color: '#2196F3',
      path: '/lazim-tracker',
    },
    {
      title: 'Tijaniya Lazim',
      description: 'Complete guide to performing the Lazim with step-by-step instructions',
      icon: '📖',
      color: '#00BFA5',
      path: '/tijaniya-lazim',
    },
    {
      title: 'Azan',
      description: 'Listen to beautiful Azan from famous mosques around the world',
      icon: '🔊',
      color: '#2E7D32',
      path: '/azan',
    },
    {
      title: 'Zikr Jumma',
      description: 'Special Friday prayers and dhikr',
      icon: '📅',
      color: '#9C27B0',
      path: '/zikr-jumma',
    },
    {
      title: 'Islamic Journal',
      description: 'Reflect on your spiritual journey',
      icon: '📔',
      color: '#FF5722',
      path: '/journal',
    },
    {
      title: 'Scholars',
      description: 'Learn from Islamic scholars and teachers',
      icon: '👨‍🏫',
      color: '#607D8B',
      path: '/scholars',
    },
    {
      title: 'Lessons',
      description: 'Interactive Islamic lessons and courses',
      icon: '🎓',
      color: '#4CAF50',
      path: '/lessons',
    },
    {
      title: 'Community',
      description: 'Connect with fellow Muslims worldwide',
      icon: '💬',
      color: '#E91E63',
      path: '/community',
    },
    {
      title: 'Mosque Locator',
      description: 'Find nearby mosques and prayer facilities',
      icon: '📍',
      color: '#795548',
      path: '/mosque',
    },
    {
      title: 'Makkah Live',
      description: 'Watch live streams from the Holy Kaaba',
      icon: '📹',
      color: '#FFD54F',
      path: '/makkah-live',
    },
    {
      title: 'AI Noor',
      description: 'AI-powered Islamic assistant',
      icon: '💡',
      color: '#00BCD4',
      path: '/ai-noor',
    },
    {
      title: 'Donate',
      description: 'Support Islamic causes',
      icon: '❤️',
      color: '#F44336',
      path: '/donate',
    },
    {
      title: 'Zakat Calculator',
      description: 'Calculate your obligatory charity (Zakat)',
      icon: '🧮',
      color: '#4CAF50',
      path: '/zakat-calculator',
    },
    {
      title: 'Hajj',
      description: 'Makkah Live, Hajj & Umrah, Hajj Journey',
      icon: '🕋',
      color: '#11C48D',
      path: '/hajj',
    },
    {
      title: 'Notifications',
      description: 'Manage prayer and reminder notifications',
      icon: '🔔',
      color: '#2E7D32',
      path: '/notifications',
    },
  ];

  const filteredFeatures = features.filter(feature =>
    !searchQuery.trim() ||
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="more-container">
      {/* Header */}
      <div className="more-header">
        <h1 className="more-header-title">More Features</h1>
        <p className="more-header-subtitle">Explore all Islamic tools and resources</p>
        
        {/* Search Bar */}
        <div className="more-search-container">
          <div className="more-search-bar">
            <span className="more-search-icon">🔍</span>
            <input
              type="text"
              className="more-search-input"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
          </div>
          
          {/* Search Suggestions */}
          {searchSuggestions.length > 0 && isSearchFocused && (
            <div className="more-suggestions-container">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="more-suggestion-item"
                  onClick={() => handleSuggestionPress(suggestion)}
                >
                  <span>🔍</span>
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Results or Features Grid */}
      {searchResults.length > 0 ? (
        <div className="more-search-results-container">
          <h3 className="more-search-results-title">Search Results</h3>
          {searchResults.map((result, index) => (
            <button
              key={index}
              className="more-search-result-item"
              onClick={() => handleSearchResultPress(result)}
            >
              <div className="more-search-result-content">
                <h4 className="more-search-result-title">{result.title}</h4>
                {result.titleArabic && (
                  <p className="more-search-result-title-arabic">{result.titleArabic}</p>
                )}
                <p className="more-search-result-description">{result.description}</p>
                <span className="more-search-result-category">{result.category}</span>
                {result.specialties && result.specialties.length > 0 && (
                  <div className="more-specialties-container">
                    {result.specialties.slice(0, 3).map((specialty, idx) => (
                      <span key={idx} className="more-specialty-tag">{specialty}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="more-search-result-arrow">→</span>
            </button>
          ))}
        </div>
      ) : searchQuery.trim() ? (
        <div className="more-no-results-container">
          <span className="more-no-results-icon">🔍</span>
          <h3 className="more-no-results-title">No results found</h3>
          <p className="more-no-results-subtitle">
            We couldn't find "{searchQuery}" in our content
          </p>
          
          <div className="more-ai-search-container">
            <h4 className="more-ai-search-title">Search with AI</h4>
            <p className="more-ai-search-subtitle">
              AI Noor can help with Islamic questions, Quran, Hadith, Tijaniyya teachings, and more
            </p>
            
            <button className="more-ai-noor-button" onClick={handleAINoorSearch}>
              <span>✨</span>
              <span>Ask AI Noor</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="more-features-grid">
          {filteredFeatures.map((feature, index) => (
            <div
              key={index}
              className="more-feature-card"
              style={{ '--feature-color': feature.color } as React.CSSProperties}
              onClick={() => navigate(feature.path)}
            >
              <div className="more-feature-icon-container" style={{ backgroundColor: `${feature.color}33` }}>
                <span className="more-feature-icon">{feature.icon}</span>
              </div>
              
              <h3 className="more-feature-title">{feature.title}</h3>
              <p className="more-feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* App Info */}
      <div className="more-app-info-container">
        <div className="more-app-info-card">
          <span className="more-app-info-icon">ℹ️</span>
          <div className="more-app-info-content">
            <h3 className="more-app-info-title">Tijaniyah Muslim Pro</h3>
            <p className="more-app-info-description">
              Your comprehensive Islamic companion app with all the tools you need for spiritual growth and daily practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreFeaturesScreen;
