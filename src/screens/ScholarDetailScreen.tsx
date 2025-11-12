import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

const ScholarDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scholar = location.state?.scholar;

  if (!scholar) {
    return (
      <div className="App">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#E7F5F1', fontSize: '18px' }}>Scholar not found</p>
          <button
            onClick={() => navigate('/scholars')}
            className="btn btn-primary"
            style={{ marginTop: '20px' }}
          >
            Back to Scholars
          </button>
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
        <button
          onClick={() => navigate('/scholars')}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '8px' }}>
          {scholar.name}
        </h1>
        <p style={{ fontSize: '16px', color: '#00BFA5', fontWeight: '500' }}>
          {scholar.title}
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {scholar.image && (
          <img
            src={scholar.image}
            alt={scholar.name}
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '16px',
              marginBottom: '24px',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}

        {/* Biography */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '12px',
          }}>
            Biography
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#BBE1D5',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
          }}>
            {scholar.bio}
          </p>
        </div>

        {/* Specialties */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '12px',
          }}>
            Specialties
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {scholar.specialties.map((specialty: string, index: number) => (
              <span
                key={index}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: 'rgba(0, 191, 165, 0.2)',
                  color: '#00BFA5',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarDetailScreen;

