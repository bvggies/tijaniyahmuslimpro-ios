import React, { useState, useEffect } from 'react';
import './HajjUmrahScreen.css';

interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

const HajjUmrahScreen: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('umrah_checklist');
    const base: ChecklistItem[] = [
      { id: 'ihram', label: 'Enter Ihram', done: false },
      { id: 'tawaf', label: 'Perform Tawaf (7 rounds)', done: false },
      { id: 'sai', label: 'Perform Sa\'i (7 rounds)', done: false },
      { id: 'taqseer', label: 'Taqseer (cut hair)', done: false },
    ];
    if (saved) {
      try {
        const parsed: Record<string, boolean> = JSON.parse(saved);
        setItems(base.map(i => ({ ...i, done: !!parsed[i.id] })));
      } catch {
        setItems(base);
      }
    } else {
      setItems(base);
    }
  }, []);

  const toggle = (id: string) => {
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, done: !i.done } : i);
      const map: Record<string, boolean> = {};
      next.forEach(i => { map[i.id] = i.done; });
      localStorage.setItem('umrah_checklist', JSON.stringify(map));
      return next;
    });
  };

  const completedCount = items.filter(i => i.done).length;
  const totalCount = items.length;
  const percentage = Math.round((completedCount / Math.max(1, totalCount)) * 100);

  return (
    <div className="hajj-umrah-container">
      <div className="hajj-umrah-header">
        <h1 className="hajj-umrah-header-title">Hajj & Umrah Guide</h1>
        <p className="hajj-umrah-header-subtitle">Complete step-by-step guide for your pilgrimage</p>
      </div>

      <div className="hajj-umrah-section">
        <h2 className="hajj-umrah-section-title">Umrah Steps ({percentage}%)</h2>
        {items.map(item => (
          <button
            key={item.id}
            className={`hajj-umrah-check-item ${item.done ? 'hajj-umrah-check-item-done' : ''}`}
            onClick={() => toggle(item.id)}
          >
            <span className="hajj-umrah-check-icon">{item.done ? '✓' : '☐'}</span>
            <span className={`hajj-umrah-check-label ${item.done ? 'hajj-umrah-check-label-done' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="hajj-umrah-section">
        <h2 className="hajj-umrah-section-title">Packing List</h2>
        <div className="hajj-umrah-bullets">
          <p className="hajj-umrah-bullet">• Ihram garments (men), modest clothing (women)</p>
          <p className="hajj-umrah-bullet">• Comfortable sandals/shoes, unscented toiletries</p>
          <p className="hajj-umrah-bullet">• Refillable water bottle, small first‑aid kit</p>
          <p className="hajj-umrah-bullet">• Travel documents, IDs, cards, emergency contacts</p>
        </div>
      </div>

      <div className="hajj-umrah-section">
        <h2 className="hajj-umrah-section-title">Visa Information</h2>
        <p className="hajj-umrah-paragraph">• Apply through eVisa portals or group operator guidance</p>
        <p className="hajj-umrah-paragraph">• Check vaccination requirements as per current policy</p>
        <p className="hajj-umrah-paragraph">• Ensure all documents are valid and up to date</p>
      </div>

      <div className="hajj-umrah-section">
        <h2 className="hajj-umrah-section-title">Frequently Asked Questions</h2>
        <div className="hajj-umrah-faq">
          <p className="hajj-umrah-faq-q">What is the difference between Hajj and Umrah?</p>
          <p className="hajj-umrah-faq-a">Hajj is the major pilgrimage performed during specific days of Dhul-Hijjah, while Umrah can be performed at any time of the year.</p>
          <p className="hajj-umrah-faq-q">How long does Umrah take?</p>
          <p className="hajj-umrah-faq-a">Umrah typically takes 2-4 hours to complete, depending on the crowd and your pace.</p>
        </div>
      </div>

      <div className="hajj-umrah-section">
        <h2 className="hajj-umrah-section-title">Hajj Overview</h2>
        <p className="hajj-umrah-paragraph">
          Hajj is one of the five pillars of Islam and is obligatory for every Muslim who is physically and financially able to perform it at least once in their lifetime. It takes place during the Islamic month of Dhul-Hijjah.
        </p>
      </div>

      <div className="hajj-umrah-section">
        <h2 className="hajj-umrah-section-title">Essential Duas</h2>
        <div className="hajj-umrah-dua-card">
          <h3 className="hajj-umrah-dua-title">Talbiyah</h3>
          <p className="hajj-umrah-dua-arabic">لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ</p>
          <p className="hajj-umrah-dua-transliteration">Labbaik Allahumma labbaik, labbaik la sharika laka labbaik, innal hamda wan ni'mata laka wal mulk, la sharika lak</p>
          <p className="hajj-umrah-dua-translation">Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise and blessings are Yours, and all sovereignty, You have no partner.</p>
        </div>
      </div>
    </div>
  );
};

export default HajjUmrahScreen;

