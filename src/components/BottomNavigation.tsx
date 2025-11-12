import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/prayer-times', label: 'Prayer', icon: '🕐' },
  { path: '/qibla', label: 'Qibla', icon: '🧭' },
  { path: '/quran', label: 'Quran', icon: '📖' },
  { path: '/duas', label: 'Duas', icon: '🤲' },
];

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(11, 63, 57, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              textDecoration: 'none',
              color: isActive ? '#11C48D' : '#BBE1D5',
              transition: 'all 0.3s ease',
              borderRadius: '12px',
              minWidth: '60px',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span style={{
              fontSize: '24px',
              marginBottom: '4px',
              filter: isActive ? 'none' : 'grayscale(0.3)',
            }}>
              {item.icon}
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: isActive ? '600' : '400',
            }}>
              {item.label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '30px',
                height: '3px',
                background: '#11C48D',
                borderRadius: '0 0 3px 3px',
              }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;

