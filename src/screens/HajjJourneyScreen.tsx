import React, { useState, useEffect } from 'react';
import './HajjJourneyScreen.css';

const phases = [
  { key: 'day8', title: 'Day 8: Entering Ihram', text: 'Enter into the state of Ihram and make your intention for Hajj. Travel to Mina and stay there until Fajr of Day 9.' },
  { key: 'day9', title: 'Day 9: Day of Arafah', text: 'After Fajr, proceed to Arafah. Stand at Arafah from Dhuhr until Maghrib. This is the most important day of Hajj. After Maghrib, proceed to Muzdalifah and spend the night there.' },
  { key: 'day10', title: 'Day 10: Eid al-Adha', text: 'After Fajr in Muzdalifah, proceed to Mina. Perform Rami (stoning) of Jamarat al-Aqaba. Perform Qurbani (sacrifice). Perform Tawaf al-Ifadah and Sa\'i. Return to Mina and stay there.' },
  { key: 'days11_13', title: 'Days 11-13: Days of Tashreeq', text: 'Stay in Mina for the next 2-3 days. Perform Rami of all three Jamarat (small, medium, large) after Dhuhr each day. After completing the Rami on the last day, perform Tawaf al-Wida (Farewell Tawaf) before leaving Makkah.' },
];

const HajjJourneyScreen: React.FC = () => {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('hajj_journey_done');
    if (saved) {
      try {
        setDone(JSON.parse(saved));
      } catch {
        setDone({});
      }
    }
  }, []);

  const toggle = (k: string) => {
    const newDone = { ...done, [k]: !done[k] };
    setDone(newDone);
    localStorage.setItem('hajj_journey_done', JSON.stringify(newDone));
  };

  const openMap = (query: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="hajj-journey-container">
      <div className="hajj-journey-header">
        <h1 className="hajj-journey-header-title">Hajj Journey</h1>
        <p className="hajj-journey-header-subtitle">Track your Hajj journey day by day</p>
      </div>

      <div className="hajj-journey-section">
        {phases.map(p => (
          <div key={p.key} className="hajj-journey-phase-card">
            <div className="hajj-journey-phase-header">
              <h3 className="hajj-journey-phase-title">{p.title}</h3>
            </div>
            <p className="hajj-journey-phase-text">{p.text}</p>
            <button
              className={`hajj-journey-done-btn ${done[p.key] ? 'hajj-journey-done-btn-active' : ''}`}
              onClick={() => toggle(p.key)}
            >
              <span className={done[p.key] ? 'hajj-journey-done-btn-text-active' : ''}>
                {done[p.key] ? '✓ Done' : 'Mark Done'}
              </span>
            </button>
            <div className="hajj-journey-map-row">
              <button className="hajj-journey-map-btn" onClick={() => openMap('Masjid al-Haram')}>
                Haram
              </button>
              <button className="hajj-journey-map-btn" onClick={() => openMap('Jamarat Bridge')}>
                Jamarat
              </button>
              <button className="hajj-journey-map-btn" onClick={() => openMap('Mount Arafat')}>
                Arafat
              </button>
              <button className="hajj-journey-map-btn" onClick={() => openMap('Muzdalifah')}>
                Muzdalifah
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HajjJourneyScreen;

