import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/tijaniyah-features', label: 'Tijaniyah', icon: '⭐' },
  { path: '/qibla', label: 'Qibla', icon: '🧭' },
  { path: '/quran', label: 'Quran', icon: '📖' },
  { path: '/duas', label: 'Duas', icon: '🤲' },
  { path: '/more', label: 'More', icon: '⋯' },
];

const ResponsiveNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, logout, isAdmin } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Mobile: Bottom Navigation
  if (isMobile) {
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
        {navItems.slice(0, 5).map((item) => {
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
            >
              <span style={{
                fontSize: '24px',
                marginBottom: '4px',
                filter: isActive ? 'none' : 'grayscale(0.3)',
              }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: '11px',
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
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            background: 'transparent',
            border: 'none',
            color: '#BBE1D5',
            cursor: 'pointer',
            minWidth: '60px',
          }}
        >
          <span style={{ fontSize: '24px', marginBottom: '4px' }}>☰</span>
          <span style={{ fontSize: '11px' }}>More</span>
        </button>
      </nav>
    );
  }

  // Desktop: Sidebar Navigation
  return (
    <>
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '250px',
        background: 'linear-gradient(180deg, #0B3F39 0%, #052F2A 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px 0',
        zIndex: 1000,
        overflowY: 'auto',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Logo/Header */}
        <div style={{
          padding: '0 20px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '20px',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#11C48D',
            margin: 0,
          }}>
            🕌 Tijaniyah Pro
          </h2>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '0 12px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#FFFFFF' : '#BBE1D5',
                  background: isActive ? 'rgba(17, 196, 141, 0.2)' : 'transparent',
                  borderLeft: isActive ? '3px solid #11C48D' : '3px solid transparent',
                  transition: 'all 0.3s ease',
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
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        {authState.isAuthenticated && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #11C48D 0%, #00BFA5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 'bold',
              }}>
                {authState.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#E7F5F1',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {authState.user?.name || 'User'}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#9E9E9E',
                  margin: 0,
                }}>
                  {authState.user?.email || ''}
                </p>
              </div>
            </div>
            <Link
              to="/profile"
              style={{
                display: 'block',
                padding: '8px 12px',
                marginBottom: '8px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#BBE1D5',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              👤 Profile
            </Link>
            {isAdmin() && (
              <Link
                to="/admin"
                style={{
                  display: 'block',
                  padding: '8px 12px',
                  marginBottom: '8px',
                  borderRadius: '6px',
                  background: 'rgba(255, 193, 7, 0.2)',
                  color: '#FFC107',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                ⚙️ Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'rgba(244, 67, 54, 0.2)',
                border: 'none',
                color: '#F44336',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1001,
            }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside style={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: '280px',
            maxWidth: '85%',
            background: 'linear-gradient(180deg, #0B3F39 0%, #052F2A 100%)',
            zIndex: 1002,
            padding: '20px',
            overflowY: 'auto',
            boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.3)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h3 style={{ color: '#E7F5F1', margin: 0 }}>Menu</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#E7F5F1',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
            {navItems.slice(5).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: location.pathname === item.path ? '#11C48D' : '#BBE1D5',
                  background: location.pathname === item.path ? 'rgba(17, 196, 141, 0.2)' : 'transparent',
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            {authState.isAuthenticated && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Link
                  to="/profile"
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: 'block',
                    padding: '10px',
                    marginBottom: '8px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#BBE1D5',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '14px',
                  }}
                >
                  👤 Profile
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    background: 'rgba(244, 67, 54, 0.2)',
                    border: 'none',
                    color: '#F44336',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  );
};

export default ResponsiveNavigation;

