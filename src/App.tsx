import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { TimeFormatProvider } from './contexts/TimeFormatContext';
import { IslamicCalendarProvider } from './contexts/IslamicCalendarContext';
import { NotificationProvider } from './contexts/NotificationContext';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PrayerTimesScreen from './screens/PrayerTimesScreen';
import QiblaScreen from './screens/QiblaScreen';
import QuranScreen from './screens/QuranScreen';
import DuasScreen from './screens/DuasScreen';
import ResponsiveNavigation from './components/ResponsiveNavigation';
import TasbihScreen from './screens/TasbihScreen';
import MoreFeaturesScreen from './screens/MoreFeaturesScreen';
import MakkahLiveScreen from './screens/MakkahLiveScreen';
import ProfileScreen from './screens/ProfileScreen';
import WazifaScreen from './screens/WazifaScreen';
import AzanScreen from './screens/AzanScreen';
import TijaniyahFeaturesScreen from './screens/TijaniyahFeaturesScreen';
import JournalScreen from './screens/JournalScreen';
import ScholarsScreen from './screens/ScholarsScreen';
import ScholarDetailScreen from './screens/ScholarDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import CommunityScreen from './screens/CommunityScreen';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  
  if (authState.isLoading) {
    return <div className="flex-center" style={{ minHeight: '100vh' }}>
      <div className="spinner"></div>
    </div>;
  }
  
  if (!authState.isAuthenticated && !authState.isGuest) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Guest Route Component
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  
  if (authState.isLoading) {
    return <div className="flex-center" style={{ minHeight: '100vh' }}>
      <div className="spinner"></div>
    </div>;
  }
  
  if (authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Main App Routes
const AppRoutes: React.FC = () => {
  return (
    <>
        <Routes>
          <Route path="/login" element={<GuestRoute><LoginScreen /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterScreen /></GuestRoute>} />
          <Route path="/guest" element={<div className="container"><h1>Guest Mode</h1></div>} />
      <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
      <Route path="/prayer-times" element={<ProtectedRoute><PrayerTimesScreen /></ProtectedRoute>} />
      <Route path="/qibla" element={<ProtectedRoute><QiblaScreen /></ProtectedRoute>} />
      <Route path="/quran" element={<ProtectedRoute><QuranScreen /></ProtectedRoute>} />
      <Route path="/duas" element={<ProtectedRoute><DuasScreen /></ProtectedRoute>} />
      <Route path="/tasbih" element={<ProtectedRoute><TasbihScreen /></ProtectedRoute>} />
      <Route path="/more" element={<ProtectedRoute><MoreFeaturesScreen /></ProtectedRoute>} />
      <Route path="/makkah-live" element={<ProtectedRoute><MakkahLiveScreen /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
      <Route path="/wazifa" element={<ProtectedRoute><WazifaScreen /></ProtectedRoute>} />
      <Route path="/azan" element={<ProtectedRoute><AzanScreen /></ProtectedRoute>} />
      <Route path="/tijaniyah-features" element={<ProtectedRoute><TijaniyahFeaturesScreen /></ProtectedRoute>} />
      <Route path="/tariqa-tijaniyyah" element={<ProtectedRoute><div className="container"><h1>Tariqa Tijaniyyah (Coming Soon)</h1></div></ProtectedRoute>} />
      <Route path="/tijaniya-fiqh" element={<ProtectedRoute><div className="container"><h1>Tijaniya Fiqh (Coming Soon)</h1></div></ProtectedRoute>} />
      <Route path="/tijaniya-lazim" element={<ProtectedRoute><div className="container"><h1>Tijaniya Lazim (Coming Soon)</h1></div></ProtectedRoute>} />
      <Route path="/resources-beginners" element={<ProtectedRoute><div className="container"><h1>Resources for Beginners (Coming Soon)</h1></div></ProtectedRoute>} />
      <Route path="/proof-tasawwuf" element={<ProtectedRoute><div className="container"><h1>Proof of Tasawwuf Part 1 (Coming Soon)</h1></div></ProtectedRoute>} />
      <Route path="/zikr-jumma" element={<ProtectedRoute><div className="container"><h1>Zikr Jumma (Coming Soon)</h1></div></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><JournalScreen /></ProtectedRoute>} />
      <Route path="/scholars" element={<ProtectedRoute><ScholarsScreen /></ProtectedRoute>} />
      <Route path="/scholar/:id" element={<ProtectedRoute><ScholarDetailScreen /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityScreen /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><div className="container"><h1>Admin Dashboard (Coming Soon)</h1></div></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <ResponsiveNavigation />
    </>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <TimeFormatProvider>
          <IslamicCalendarProvider>
            <NotificationProvider>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </NotificationProvider>
          </IslamicCalendarProvider>
        </TimeFormatProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
