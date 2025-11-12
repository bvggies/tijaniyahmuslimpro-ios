import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HajjScreen.css';

const HajjScreen: React.FC = () => {
  const navigate = useNavigate();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const Accordion: React.FC<{ icon: string; title: string; children: React.ReactNode; cta?: string; onPressCta?: () => void }> = ({ icon, title, children, cta, onPressCta }) => {
    const isOpen = openAccordion === title;
    return (
      <div className="hajj-acc-container">
        <button className="hajj-acc-header" onClick={() => toggleAccordion(title)}>
          <div className="hajj-card-icon-wrap">
            <span>{icon}</span>
          </div>
          <span className="hajj-acc-title">{title}</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className="hajj-acc-body">
            {children}
            {cta && onPressCta && (
              <button className="hajj-cta-button" onClick={onPressCta}>
                <span>{cta}</span>
                <span>→</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="hajj-bullet-row">
      <span className="hajj-bullet-dot">•</span>
      <span className="hajj-bullet-text">{children as any}</span>
    </div>
  );

  return (
    <div className="hajj-container">
      <div className="hajj-header">
        <h1 className="hajj-header-title">Hajj & Umrah</h1>
        <p className="hajj-header-subtitle">Complete guide for your spiritual journey</p>
        <div className="hajj-quick-actions">
          <button className="hajj-qa-btn" onClick={() => navigate('/makkah-live')}>
            <span>📹</span>
            <span>Makkah Live</span>
          </button>
          <button className="hajj-qa-btn" onClick={() => navigate('/hajj-umrah')}>
            <span>🚶</span>
            <span>Hajj & Umrah</span>
          </button>
          <button className="hajj-qa-btn" onClick={() => navigate('/hajj-journey')}>
            <span>🗺️</span>
            <span>Journey</span>
          </button>
        </div>
      </div>

      <div className="hajj-section">
        <Accordion
          icon="📹"
          title="Makkah Live"
          cta="Open"
          onPressCta={() => navigate('/makkah-live')}
        >
          <p className="hajj-block-title">Key Features</p>
          <Bullet>Live Video Feed: 24/7 HD stream of the Kaaba and Masjid al‑Haram with Tawaf visible in real time.</Bullet>
          <Bullet>Virtual Connection: Feel spiritually connected when travel isn't possible.</Bullet>
          <Bullet>Prayer Times: Tune in during salāh for a more immersive experience.</Bullet>
          <Bullet>Special Occasions: Ramadan, Hajj and nightly worship highlights.</Bullet>
          <Bullet>HD Quality: Clear, beautiful view of the sanctuary.</Bullet>
          <p className="hajj-block-title">Why It's Useful</p>
          <Bullet>Spiritual Connection from anywhere.</Bullet>
          <Bullet>Inspiration for pilgrims preparing for Hajj/Umrah.</Bullet>
        </Accordion>

        <Accordion
          icon="🚶"
          title="Hajj & Umrah"
          cta="Open"
          onPressCta={() => navigate('/hajj-umrah')}
        >
          <p className="hajj-block-title">Key Features</p>
          <Bullet>Step‑by‑Step Guide: Ihram, Tawaf, Sa'i, Ramy al‑Jamarāt, Mina, 'Arafah, Muzdalifah.</Bullet>
          <Bullet>Essential Duas: Text, meanings and (optionally) audio.</Bullet>
          <Bullet>Practical Info: Visa tips, packing lists, health & safety guidance.</Bullet>
          <Bullet>Q&A & Tips: FAQs and advice for first‑time pilgrims.</Bullet>
          <Bullet>Offline Access: Critical guidance available without internet.</Bullet>
          <p className="hajj-block-title">Why It's Useful</p>
          <Bullet>Clear guidance reduces overwhelm for first‑timers.</Bullet>
          <Bullet>One‑stop resource from preparation to rituals.</Bullet>
        </Accordion>

        <Accordion
          icon="🗺️"
          title="Hajj Journey"
          cta="Open"
          onPressCta={() => navigate('/hajj-journey')}
        >
          <p className="hajj-block-title">Key Features</p>
          <Bullet>Personalized Timeline: Day‑by‑day itinerary aligned to Hajj schedule.</Bullet>
          <Bullet>Real‑Time Alerts: Reminders for 'Arafah, Tawaf, Jamarāt, etc.</Bullet>
          <Bullet>Milestone Tracking: Check off completed rites and Qurbani.</Bullet>
          <Bullet>Interactive Maps: Guidance for key locations (Haram, Jamarāt, 'Arafah).</Bullet>
          <Bullet>Emergency Assistance: Quick contacts and help info around Makkah.</Bullet>
          <Bullet>Hajj Diary: Capture reflections and notes.</Bullet>
          <p className="hajj-block-title">Why It's Useful</p>
          <Bullet>Peace of mind with a structured plan.</Bullet>
          <Bullet>Focus on spiritual fulfillment while logistics are organized.</Bullet>
        </Accordion>
      </div>

      <div className="hajj-section">
        <p className="hajj-block-title">Safety Tips</p>
        <Bullet>Stay hydrated and protect yourself from heat.</Bullet>
        <Bullet>Use mobility aids if needed and take breaks.</Bullet>
        <Bullet>Maintain good hygiene and wash hands frequently.</Bullet>
        <Bullet>Keep emergency contacts handy at all times.</Bullet>
      </div>
    </div>
  );
};

export default HajjScreen;

