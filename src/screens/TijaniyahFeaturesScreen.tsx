import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './TijaniyahFeaturesScreen.css';

const TijaniyahFeaturesScreen: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: '1',
      title: 'Tariqa Tijaniyyah',
      description: 'Learn about The Tijānī Path',
      icon: '⭐',
      color: '#00BFA5',
      path: '/tariqa-tijaniyyah',
    },
    {
      id: '2',
      title: 'Tijaniya Fiqh',
      description: 'The Conditions of Tijaniya Fiqh',
      icon: '📖',
      color: '#2E7D32',
      path: '/tijaniya-fiqh',
    },
    {
      id: '3',
      title: 'Resources for Beginners',
      description: 'Islamic Terms & Phrases',
      icon: '📚',
      color: '#4CAF50',
      path: '/resources-beginners',
    },
    {
      id: '4',
      title: 'Proof of Tasawwuf Part 1',
      description: 'Dhikr is the Greatest Obligation',
      icon: '💎',
      color: '#FF9800',
      path: '/proof-tasawwuf',
    },
    {
      id: '5',
      title: 'Tijaniya Lazim',
      description: 'Complete guide to performing the Lazim',
      icon: '📿',
      color: '#00BFA5',
      path: '/tijaniya-lazim',
    },
    {
      id: '6',
      title: 'Wazifa',
      description: 'Daily Wazifa practice',
      icon: '✅',
      color: '#F57F17',
      path: '/wazifa',
    },
    {
      id: '7',
      title: 'Zikr Jumma',
      description: 'Friday dhikr',
      icon: '📅',
      color: '#9C27B0',
      path: '/zikr-jumma',
    },
    {
      id: '8',
      title: 'Azan',
      description: 'Call to prayer',
      icon: '🔊',
      color: '#2E7D32',
      path: '/azan',
    },
  ];

  return (
    <div className="App">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #00BFA5 0%, #2E7D32 100%)',
        paddingTop: '40px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
        color: '#FFFFFF',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '32px' }}>⭐</span>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Tijaniyah Features</h1>
            <p style={{ fontSize: '16px', margin: '4px 0 0', opacity: 0.9 }}>Authentic Tijaniyah Practices & Resources</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '30px',
        }}>
          {features.map((feature) => (
            <div
              key={feature.id}
              className="card"
              style={{
                cursor: 'pointer',
                background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}10 100%)`,
                borderLeft: `4px solid ${feature.color}`,
                transition: 'all 0.3s ease',
              }}
              onClick={() => {
                if (feature.path) {
                  navigate(feature.path);
                } else {
                  alert(`${feature.title} - Coming Soon!`);
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              }}
            >
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
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          <p style={{
            fontSize: '18px',
            color: '#E7F5F1',
            fontStyle: 'italic',
            marginBottom: '8px',
          }}>
            "The best of people are those who benefit others"
          </p>
          <p style={{
            fontSize: '14px',
            color: '#BBE1D5',
          }}>
            - Prophet Muhammad (SAW)
          </p>
        </div>
      </div>
    </div>
  );
};

export default TijaniyahFeaturesScreen;

