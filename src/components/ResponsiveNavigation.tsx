import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';
import './ResponsiveNavigation.css';

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

  // Hide navigation on login/register pages
  const hideNavPaths = ['/login', '/register'];
  const shouldHideNav = hideNavPaths.includes(location.pathname) || !authState.isAuthenticated;

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

  // Don't render navigation on login/register pages
  if (shouldHideNav) {
    return null;
  }

  // Mobile: Bottom Navigation with Glass Effect
  if (isMobile) {
    return (
      <nav className="glass-nav-container">
        <div className="glass-nav-blur">
          <div className="glass-nav-gradient">
            <div className="glass-nav-bar">
              {navItems.slice(0, 5).map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`glass-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <div className={`glass-nav-icon-container ${isActive ? 'active' : ''}`}>
                      <span className="glass-nav-icon">{item.icon}</span>
                    </div>
                    <span className="glass-nav-label">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => setSidebarOpen(true)}
                className="glass-nav-item glass-nav-more-button"
              >
                <div className="glass-nav-icon-container">
                  <span className="glass-nav-icon">☰</span>
                </div>
                <span className="glass-nav-label">More</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div
              className="glass-nav-overlay"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="glass-nav-sidebar">
              <div className="glass-nav-sidebar-header">
                <h3>Menu</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="glass-nav-close-button"
                >
                  ✕
                </button>
              </div>
              {navItems.slice(5).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`glass-nav-sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="glass-nav-sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              {authState.isAuthenticated && (
                <div className="glass-nav-sidebar-footer">
                  <Link
                    to="/profile"
                    onClick={() => setSidebarOpen(false)}
                    className="glass-nav-sidebar-link"
                  >
                    👤 Profile
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      onClick={() => setSidebarOpen(false)}
                      className="glass-nav-sidebar-link admin-link"
                    >
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="glass-nav-sidebar-link logout-button"
                  >
                    Logout
                  </button>
                </div>
              )}
            </aside>
          </>
        )}
      </nav>
    );
  }

  // Desktop: Sidebar Navigation
  return (
    <aside className="desktop-sidebar">
      {/* Logo/Header */}
      <div className="desktop-sidebar-header">
        <h2>🕌 Tijaniyah Pro</h2>
      </div>

      {/* Navigation Items */}
      <nav className="desktop-sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`desktop-sidebar-item ${isActive ? 'active' : ''}`}
            >
              <span className="desktop-sidebar-icon">{item.icon}</span>
              <span className="desktop-sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {authState.isAuthenticated && (
        <div className="desktop-sidebar-footer">
          <div className="desktop-sidebar-user">
            <div className="desktop-sidebar-avatar">
              {authState.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="desktop-sidebar-user-info">
              <p className="desktop-sidebar-user-name">
                {authState.user?.name || 'User'}
              </p>
              <p className="desktop-sidebar-user-email">
                {authState.user?.email || ''}
              </p>
            </div>
          </div>
          <Link to="/profile" className="desktop-sidebar-link">
            👤 Profile
          </Link>
          {isAdmin() && (
            <Link to="/admin" className="desktop-sidebar-link admin-link">
              ⚙️ Admin Panel
            </Link>
          )}
          <button onClick={handleLogout} className="desktop-sidebar-link logout-button">
            Logout
          </button>
        </div>
      )}
    </aside>
  );
};

export default ResponsiveNavigation;
