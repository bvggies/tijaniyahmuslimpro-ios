import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import '../App.css';

interface Entry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'grateful' | 'reflective' | 'hopeful' | 'peaceful' | 'struggling' | 'inspired';
  tags: string[];
  wordCount: number;
  createdAt: number;
}

const STORAGE_KEY = 'journal_entries_v2';

const ISLAMIC_PROMPTS = [
  "What am I grateful to Allah for today?",
  "How did I grow closer to Allah today?",
  "What lesson did I learn from today's experiences?",
  "How can I be a better Muslim tomorrow?",
  "What dua did I make today and why?",
  "How did I show kindness to others today?",
  "What challenges did Allah help me overcome?",
  "How did I practice patience today?",
  "What Islamic knowledge did I gain today?",
  "How did I remember Allah throughout the day?"
];

const MOOD_EMOJIS = {
  grateful: '🙏',
  reflective: '🤔',
  hopeful: '🌟',
  peaceful: '☮️',
  struggling: '💪',
  inspired: '✨'
};

const JournalScreen: React.FC = () => {
  const { authState } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Entry['mood']>('grateful');
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<Entry['mood'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mood'>('newest');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const list = await api.listJournal();
      const mapped: Entry[] = (Array.isArray(list) ? list : []).map((e: any) => ({
        id: e.id,
        title: e.title || 'Untitled',
        content: e.content || '',
        mood: 'grateful',
        tags: Array.isArray(e.tags) ? e.tags : [],
        wordCount: String(e.content || '').trim().split(/\s+/).filter((w: string) => w.length > 0).length,
        createdAt: e.createdAt ? new Date(e.createdAt).getTime() : Date.now(),
        date: new Date(e.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      }));
      setEntries(mapped);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
    } catch {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    }
  };

  const saveEntries = (list: Entry[]) => {
    setEntries(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const addEntry = async () => {
    if (authState.isGuest) {
      alert('Please login to create journal entries');
      return;
    }
    
    if (!title.trim() && !content.trim()) return;
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const optimistic: Entry = {
      id: `tmp-${Date.now()}`,
      title: title.trim() || 'Untitled',
      content: content.trim(),
      mood,
      tags,
      wordCount,
      createdAt: Date.now(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
    saveEntries([optimistic, ...entries]);
    try {
      const created = await api.createJournal(optimistic.title, optimistic.content, optimistic.tags);
      const mapped: Entry = {
        id: created.id,
        title: created.title || 'Untitled',
        content: created.content || '',
        mood: optimistic.mood,
        tags: Array.isArray(created.tags) ? created.tags : [],
        wordCount: String(created.content || '').trim().split(/\s+/).filter((w: string) => w.length > 0).length,
        createdAt: created.createdAt ? new Date(created.createdAt).getTime() : Date.now(),
        date: new Date(created.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      };
      saveEntries([mapped, ...entries.filter(e => e.id !== optimistic.id)]);
    } catch (e) {
      saveEntries(entries);
      alert('Failed to save entry');
    }
    setTitle('');
    setContent('');
    setMood('grateful');
    setTags([]);
    setShowModal(false);
  };

  const deleteEntry = async (id: string) => {
    const prev = entries;
    saveEntries(entries.filter(e => e.id !== id));
    try {
      if (!id.startsWith('tmp-')) await api.deleteJournal(id);
    } catch (e) {
      saveEntries(prev);
      alert('Failed to delete entry');
    }
  };

  const getFilteredEntries = () => {
    let filtered = entries;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (filterMood !== 'all') {
      filtered = filtered.filter(entry => entry.mood === filterMood);
    }
    
    switch (sortBy) {
      case 'oldest':
        return filtered.sort((a, b) => a.createdAt - b.createdAt);
      case 'mood':
        return filtered.sort((a, b) => a.mood.localeCompare(b.mood));
      default:
        return filtered.sort((a, b) => b.createdAt - a.createdAt);
    }
  };

  const handleUsePrompt = (prompt: string) => {
    setTitle(prompt);
    setContent('');
    setShowPrompts(false);
    setShowModal(true);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '8px' }}>
              📔 Islamic Journal
            </h1>
            <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
              Reflect on your spiritual journey
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowStats(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              📊 Stats
            </button>
            <button
              onClick={() => setShowPrompts(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              💡 Prompts
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '12px 24px',
                borderRadius: '25px',
                background: 'linear-gradient(135deg, #00BFA5 0%, #11C48D 100%)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              + New Entry
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ flex: 1 }}
          />
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value as any)}
            className="input-field"
            style={{ width: '150px' }}
          >
            <option value="all">All Moods</option>
            {(['grateful', 'reflective', 'hopeful', 'peaceful', 'struggling', 'inspired'] as Entry['mood'][]).map(m => (
              <option key={m} value={m}>{MOOD_EMOJIS[m]} {m}</option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {(['newest', 'oldest', 'mood'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: sortBy === option ? '#00BFA5' : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontWeight: sortBy === option ? 'bold' : 'normal',
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* Entries List */}
        {getFilteredEntries().length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📔</p>
            <p style={{ fontSize: '18px', color: '#E7F5F1', marginBottom: '8px' }}>
              No entries found.
            </p>
            <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
              {searchQuery || filterMood !== 'all' ? 'Try adjusting your search or filters.' : 'Add your first reflection to begin your spiritual journey.'}
            </p>
          </div>
        ) : (
          <div>
            {getFilteredEntries().map((entry) => (
              <div key={entry.id} className="card" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#E7F5F1', marginBottom: '4px' }}>
                      {entry.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#BBE1D5' }}>{entry.date}</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                  }}>
                    <span>{MOOD_EMOJIS[entry.mood]}</span>
                    <span style={{ fontSize: '12px', color: '#E7F5F1' }}>{entry.mood}</span>
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#BBE1D5',
                  lineHeight: '1.6',
                  marginBottom: '12px',
                  whiteSpace: 'pre-wrap',
                }}>
                  {entry.content.substring(0, 200)}{entry.content.length > 200 ? '...' : ''}
                </p>
                {entry.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {entry.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          background: 'rgba(0, 191, 165, 0.2)',
                          color: '#00BFA5',
                          fontSize: '12px',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span style={{ fontSize: '12px', color: '#BBE1D5' }}>
                        +{entry.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#9E9E9E' }}>
                    📝 {entry.wordCount} words
                  </span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(244, 67, 54, 0.2)',
                      border: 'none',
                      color: '#F44336',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Entry Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#052F2A',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#E7F5F1', margin: 0 }}>
                New Entry
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#E7F5F1',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              style={{ marginBottom: '16px' }}
            />

            <textarea
              placeholder="Write your reflection..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field"
              style={{
                minHeight: '200px',
                resize: 'vertical',
                marginBottom: '16px',
                fontFamily: 'inherit',
              }}
            />

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#BBE1D5', marginBottom: '8px' }}>Mood:</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['grateful', 'reflective', 'hopeful', 'peaceful', 'struggling', 'inspired'] as Entry['mood'][]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      background: mood === m ? '#00BFA5' : 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{MOOD_EMOJIS[m]}</span>
                    <span>{m}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#BBE1D5', marginBottom: '8px' }}>Tags:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '16px',
                      background: 'rgba(0, 191, 165, 0.2)',
                      color: '#00BFA5',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#00BFA5',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a tag and press Enter"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTag(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                className="input-field"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={addEntry}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Save Entry
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompts Modal */}
      {showPrompts && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#052F2A',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#E7F5F1', margin: 0 }}>
                Writing Prompts
              </h2>
              <button
                onClick={() => setShowPrompts(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#E7F5F1',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div>
              {ISLAMIC_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleUsePrompt(prompt)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '8px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#E7F5F1',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStats && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#052F2A',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#E7F5F1', margin: 0 }}>
                Journal Statistics
              </h2>
              <button
                onClick={() => setShowStats(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#E7F5F1',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div className="card">
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#00BFA5', margin: 0 }}>
                  {entries.length}
                </p>
                <p style={{ fontSize: '14px', color: '#BBE1D5', margin: '4px 0 0' }}>Total Entries</p>
              </div>
              <div className="card">
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#00BFA5', margin: 0 }}>
                  {entries.reduce((sum, e) => sum + e.wordCount, 0)}
                </p>
                <p style={{ fontSize: '14px', color: '#BBE1D5', margin: '4px 0 0' }}>Total Words</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalScreen;

