import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const HomeScreen: React.FC = () => {
  return (
    <div className="App">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#11C48D' }}>
            🕌 Tijaniyah Muslim Pro
          </h1>
          <p style={{ fontSize: '18px', color: '#BBE1D5' }}>
            Your Complete Islamic Companion
          </p>
        </div>

        <div className="grid grid-2" style={{ marginBottom: '40px' }}>
          <Link to="/prayer-times" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ marginBottom: '12px', color: '#11C48D' }}>🕐 Prayer Times</h3>
            <p style={{ color: '#BBE1D5' }}>Get accurate prayer times for your location</p>
          </Link>

          <Link to="/qibla" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ marginBottom: '12px', color: '#11C48D' }}>🧭 Qibla Compass</h3>
            <p style={{ color: '#BBE1D5' }}>Find the direction to Mecca</p>
          </Link>

          <Link to="/quran" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ marginBottom: '12px', color: '#11C48D' }}>📖 Quran</h3>
            <p style={{ color: '#BBE1D5' }}>Read and listen to the Holy Quran</p>
          </Link>

          <Link to="/duas" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ marginBottom: '12px', color: '#11C48D' }}>🤲 Duas</h3>
            <p style={{ color: '#BBE1D5' }}>Collection of Islamic supplications</p>
          </Link>

          <Link to="/tasbih" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ marginBottom: '12px', color: '#11C48D' }}>📿 Digital Tasbih</h3>
            <p style={{ color: '#BBE1D5' }}>Count your dhikr with our digital tasbih</p>
          </Link>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/more" className="btn btn-primary">
            Explore More Features
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;

