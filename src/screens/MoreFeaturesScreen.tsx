import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

interface Feature {
  title: string;
  description: string;
  icon: string;
  color: string;
  path?: string;
  comingSoon?: boolean;
}

const MoreFeaturesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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
      comingSoon: true,
    },
    {
      title: 'Tijaniya Lazim',
      description: 'Complete guide to performing the Lazim',
      icon: '📖',
      color: '#00BFA5',
      comingSoon: true,
    },
    {
      title: 'Azan',
      description: 'Listen to beautiful Azan from famous mosques',
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
      title: 'Journal',
      description: 'Reflect on your spiritual journey',
      icon: '📔',
      color: '#00BFA5',
      path: '/journal',
    },
    {
      title: 'Scholars',
      description: 'Learn about Tijaniya scholars',
      icon: '👨‍🏫',
      color: '#2E7D32',
      path: '/scholars',
    },
    {
      title: 'Community',
      description: 'Connect with fellow Muslims',
      icon: '👥',
      color: '#9C27B0',
      path: '/community',
    },
    {
      title: 'Settings',
      description: 'Manage your app preferences',
      icon: '⚙️',
      color: '#607D8B',
      path: '/settings',
    },
    {
      title: 'Islamic Journal',
      description: 'Reflect on your spiritual journey',
      icon: '📔',
      color: '#FF5722',
      comingSoon: true,
    },
    {
      title: 'Scholars',
      description: 'Learn from Islamic scholars and teachers',
      icon: '👥',
      color: '#607D8B',
      comingSoon: true,
    },
    {
      title: 'Lessons',
      description: 'Interactive Islamic lessons and courses',
      icon: '🎓',
      color: '#4CAF50',
      comingSoon: true,
    },
    {
      title: 'Community',
      description: 'Connect with fellow Muslims worldwide',
      icon: '💬',
      color: '#E91E63',
      comingSoon: true,
    },
    {
      title: 'Mosque Locator',
      description: 'Find nearby mosques and prayer facilities',
      icon: '📍',
      color: '#795548',
      comingSoon: true,
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
      comingSoon: true,
    },
    {
      title: 'Donate',
      description: 'Support Islamic causes',
      icon: '❤️',
      color: '#F44336',
      comingSoon: true,
    },
    {
      title: 'Zakat Calculator',
      description: 'Calculate your obligatory charity (Zakat)',
      icon: '🧮',
      color: '#4CAF50',
      comingSoon: true,
    },
    {
      title: 'Hajj & Umrah',
      description: 'Hajj Journey and Umrah guides',
      icon: '🕋',
      color: '#11C48D',
      comingSoon: true,
    },
    {
      title: 'Notifications',
      description: 'Manage prayer and reminder notifications',
      icon: '🔔',
      color: '#2E7D32',
      comingSoon: true,
    },
  ];

  const filteredFeatures = features.filter(feature =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '16px' }}>
          More Features
        </h1>

        {/* Search Bar */}
        <input
          type="text"
          className="input"
          placeholder="Search features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Features Grid */}
      <div style={{
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {filteredFeatures.map((feature, index) => {
          const content = (
            <div
              className="card"
              style={{
                cursor: feature.path && !feature.comingSoon ? 'pointer' : 'default',
                opacity: feature.comingSoon ? 0.7 : 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (feature.path && !feature.comingSoon) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              }}
              onClick={() => {
                if (feature.path && !feature.comingSoon) {
                  navigate(feature.path);
                }
              }}
            >
              {feature.comingSoon && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(255, 152, 0, 0.9)',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600',
                }}>
                  Coming Soon
                </div>
              )}
              
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: `${feature.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '16px',
              }}>
                {feature.icon}
              </div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#E7F5F1',
                marginBottom: '8px',
              }}>
                {feature.title}
              </h3>

              <p style={{
                fontSize: '14px',
                color: '#BBE1D5',
                lineHeight: '1.5',
                margin: 0,
              }}>
                {feature.description}
              </p>
            </div>
          );

          if (feature.path && !feature.comingSoon) {
            return (
              <Link
                key={index}
                to={feature.path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {content}
              </Link>
            );
          }

          return <div key={index}>{content}</div>;
        })}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="card" style={{ margin: '20px', textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#BBE1D5' }}>No features found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default MoreFeaturesScreen;

