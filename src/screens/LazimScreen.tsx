import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../utils/theme';
import './LazimScreen.css';

interface LazimItem {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  date: string;
}

const mockLazimItems: LazimItem[] = [
  {
    id: '1',
    title: 'Daily Quran Reading',
    description: 'Read at least 1 page of Quran daily',
    frequency: 'daily',
    completed: true,
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Morning Dhikr',
    description: 'Recite morning adhkar after Fajr',
    frequency: 'daily',
    completed: true,
    date: '2024-01-15',
  },
  {
    id: '3',
    title: 'Weekly Fasting',
    description: 'Fast on Mondays and Thursdays',
    frequency: 'weekly',
    completed: false,
    date: '2024-01-15',
  },
  {
    id: '4',
    title: 'Monthly Charity',
    description: 'Give charity to the needy',
    frequency: 'monthly',
    completed: false,
    date: '2024-01-15',
  },
  {
    id: '5',
    title: 'Evening Reflection',
    description: 'Reflect on the day and seek forgiveness',
    frequency: 'daily',
    completed: true,
    date: '2024-01-15',
  },
];

const LazimScreen: React.FC = () => {
  const navigate = useNavigate();
  const [lazimItems, setLazimItems] = useState<LazimItem[]>(mockLazimItems);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', frequency: 'daily' as const });

  const filteredItems = lazimItems.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.frequency === selectedFilter;
  });

  const completedCount = lazimItems.filter(item => item.completed).length;
  const totalCount = lazimItems.length;
  const streakDays = 7;

  const toggleLazim = (id: string) => {
    setLazimItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addNewLazim = () => {
    if (!newItem.title.trim()) {
      window.alert('Error\nPlease enter a title for your commitment');
      return;
    }

    const newLazimItem: LazimItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      frequency: newItem.frequency,
      completed: false,
      date: new Date().toISOString().split('T')[0],
    };

    setLazimItems(prev => [newLazimItem, ...prev]);
    setNewItem({ title: '', description: '', frequency: 'daily' });
    setShowAddModal(false);
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '#4CAF50';
      case 'weekly': return '#2196F3';
      case 'monthly': return '#FF9800';
      default: return '#666';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'monthly': return '🗓️';
      default: return '📅';
    }
  };

  return (
    <div className="lazim-container">
      {/* Header */}
      <div className="lazim-header">
        <div className="lazim-header-content">
          <div>
            <h1 className="lazim-header-title">Lazim Tracker</h1>
            <p className="lazim-header-subtitle">Track your daily Islamic commitments</p>
          </div>
          <button className="lazim-add-button" onClick={() => setShowAddModal(true)}>
            <span>+</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="lazim-stats-container">
        <div className="lazim-stat-card">
          <p className="lazim-stat-number">{completedCount}</p>
          <p className="lazim-stat-label">Completed</p>
        </div>
        <div className="lazim-stat-card">
          <p className="lazim-stat-number">{totalCount}</p>
          <p className="lazim-stat-label">Total</p>
        </div>
        <div className="lazim-stat-card">
          <p className="lazim-stat-number">{streakDays}</p>
          <p className="lazim-stat-label">Day Streak</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="lazim-progress-container">
        <div className="lazim-progress-header">
          <p className="lazim-progress-title">Today's Progress</p>
          <p className="lazim-progress-text">{Math.round((completedCount / totalCount) * 100)}%</p>
        </div>
        <div className="lazim-progress-bar">
          <div
            className="lazim-progress-fill"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="lazim-filter-container">
        {[
          { key: 'all', label: 'All', icon: '📋' },
          { key: 'daily', label: 'Daily', icon: '📅' },
          { key: 'weekly', label: 'Weekly', icon: '📆' },
          { key: 'monthly', label: 'Monthly', icon: '🗓️' },
        ].map((filter) => (
          <button
            key={filter.key}
            className={`lazim-filter-button ${selectedFilter === filter.key ? 'lazim-selected-filter-button' : ''}`}
            onClick={() => setSelectedFilter(filter.key as any)}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Lazim Items List */}
      <div className="lazim-list">
        {filteredItems.map((item) => (
          <div key={item.id} className={`lazim-card ${item.completed ? 'lazim-completed-card' : ''}`}>
            <div className="lazim-card-header">
              <div className="lazim-info">
                <div className="lazim-title-row">
                  <h3 className={`lazim-title ${item.completed ? 'lazim-completed-text' : ''}`}>
                    {item.title}
                  </h3>
                  <div className="lazim-frequency-badge" style={{ backgroundColor: getFrequencyColor(item.frequency) }}>
                    <span>{getFrequencyIcon(item.frequency)}</span>
                    <span>{item.frequency}</span>
                  </div>
                </div>
                <p className="lazim-description">{item.description}</p>
              </div>
              <button
                className={`lazim-checkbox ${item.completed ? 'lazim-checked-box' : ''}`}
                onClick={() => toggleLazim(item.id)}
              >
                {item.completed && <span>✓</span>}
              </button>
            </div>
            
            <div className="lazim-footer">
              <p className="lazim-date-text">{item.date}</p>
              <div className="lazim-progress-indicator">
                <div className={`lazim-progress-dot ${item.completed ? 'lazim-completed-dot' : ''}`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lazim Modal */}
      {showAddModal && (
        <div className="lazim-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="lazim-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="lazim-modal-header">
              <h2 className="lazim-modal-title">Add New Commitment</h2>
              <button className="lazim-modal-close" onClick={() => setShowAddModal(false)}>
                <span>×</span>
              </button>
            </div>
            
            <input
              type="text"
              className="lazim-input"
              placeholder="Commitment title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            />
            
            <textarea
              className="lazim-textarea"
              placeholder="Description (optional)"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              rows={3}
            />
            
            <div className="lazim-frequency-selector">
              <p className="lazim-frequency-label">Frequency:</p>
              {['daily', 'weekly', 'monthly'].map((freq) => (
                <button
                  key={freq}
                  className={`lazim-frequency-option ${newItem.frequency === freq ? 'lazim-selected-frequency-option' : ''}`}
                  onClick={() => setNewItem({ ...newItem, frequency: freq as any })}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
              ))}
            </div>
            
            <button className="lazim-save-button" onClick={addNewLazim}>
              <span>Add Commitment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazimScreen;

