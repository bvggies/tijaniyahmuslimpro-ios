import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

interface DhikrOption {
  arabic: string;
  transliteration: string;
  meaning: string;
  color: string;
}

const dhikrOptions: DhikrOption[] = [
  { arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah', meaning: 'Glory be to Allah', color: '#4CAF50' },
  { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', meaning: 'Praise be to Allah', color: '#2196F3' },
  { arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest', color: '#FF9800' },
  { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illa Allah', meaning: 'There is no god but Allah', color: '#9C27B0' },
];

const TasbihScreen: React.FC = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [selectedDhikr, setSelectedDhikr] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);

  const incrementCount = () => {
    setCount(prev => {
      const newCount = prev + 1;
      
      // Animation
      if (counterRef.current) {
        counterRef.current.style.transform = 'scale(1.2)';
        setTimeout(() => {
          if (counterRef.current) {
            counterRef.current.style.transform = 'scale(1)';
          }
        }, 200);
      }

      // Visual feedback when target reached
      if (newCount % target === 0 && newCount > 0) {
        // Flash effect
        if (counterRef.current) {
          counterRef.current.style.boxShadow = `0 0 30px ${dhikrOptions[selectedDhikr].color}`;
          setTimeout(() => {
            if (counterRef.current) {
              counterRef.current.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            }
          }, 500);
        }
      }

      return newCount;
    });
  };

  const resetCount = () => {
    setCount(0);
    if (counterRef.current) {
      counterRef.current.style.transform = 'scale(1)';
    }
  };

  const changeTarget = (newTarget: number) => {
    setTarget(newTarget);
    setCount(0);
  };

  const completedRounds = Math.floor(count / target);
  const currentRound = (count % target) || target;

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setCount(prev => {
          const newCount = prev + 1;
          if (counterRef.current) {
            counterRef.current.style.transform = 'scale(1.2)';
            setTimeout(() => {
              if (counterRef.current) {
                counterRef.current.style.transform = 'scale(1)';
              }
            }, 200);
          }
          if (newCount % target === 0 && newCount > 0) {
            if (counterRef.current) {
              counterRef.current.style.boxShadow = `0 0 30px ${dhikrOptions[selectedDhikr].color}`;
              setTimeout(() => {
                if (counterRef.current) {
                  counterRef.current.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                }
              }, 500);
            }
          }
          return newCount;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, selectedDhikr]);

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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '16px' }}>
          Digital Tasbih
        </h1>
        <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
          Press the button or spacebar to count
        </p>
      </div>

      {/* Dhikr Selection */}
      <div style={{ padding: '20px', paddingBottom: '12px' }}>
        <h2 style={{ fontSize: '18px', color: '#E7F5F1', marginBottom: '12px' }}>Select Dhikr</h2>
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}>
          {dhikrOptions.map((dhikr, index) => (
            <div
              key={index}
              onClick={() => setSelectedDhikr(index)}
              style={{
                minWidth: '200px',
                padding: '16px',
                borderRadius: '12px',
                background: selectedDhikr === index
                  ? `linear-gradient(135deg, ${dhikr.color} 0%, ${dhikr.color}CC 100%)`
                  : 'rgba(255, 255, 255, 0.1)',
                border: selectedDhikr === index ? `2px solid ${dhikr.color}` : '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <p style={{
                fontSize: '20px',
                color: '#FFFFFF',
                textAlign: 'right',
                marginBottom: '8px',
                fontFamily: 'Amiri, "Arabic Typesetting", serif',
              }}>
                {dhikr.arabic}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#FFFFFF',
                fontWeight: '600',
                marginBottom: '4px',
              }}>
                {dhikr.transliteration}
              </p>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                {dhikr.meaning}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Counter */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: '400px',
      }}>
        <div
          ref={counterRef}
          onClick={incrementCount}
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${dhikrOptions[selectedDhikr].color} 0%, ${dhikrOptions[selectedDhikr].color}CC 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
            userSelect: 'none',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <p style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            margin: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}>
            {count}
          </p>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginTop: '8px',
          }}>
            / {target}
          </p>
        </div>

        {/* Current Dhikr Display */}
        <div style={{
          marginTop: '32px',
          textAlign: 'center',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          minWidth: '300px',
        }}>
          <p style={{
            fontSize: '24px',
            color: '#E7F5F1',
            textAlign: 'right',
            marginBottom: '8px',
            fontFamily: 'Amiri, "Arabic Typesetting", serif',
          }}>
            {dhikrOptions[selectedDhikr].arabic}
          </p>
          <p style={{
            fontSize: '16px',
            color: '#BBE1D5',
            fontWeight: '600',
            marginBottom: '4px',
          }}>
            {dhikrOptions[selectedDhikr].transliteration}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#9E9E9E',
          }}>
            {dhikrOptions[selectedDhikr].meaning}
          </p>
        </div>

        {/* Round Info */}
        <div style={{
          marginTop: '24px',
          display: 'flex',
          gap: '24px',
          textAlign: 'center',
        }}>
          <div>
            <p style={{
              fontSize: '12px',
              color: '#9E9E9E',
              marginBottom: '4px',
            }}>
              Current Round
            </p>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#11C48D',
            }}>
              {currentRound}
            </p>
          </div>
          <div>
            <p style={{
              fontSize: '12px',
              color: '#9E9E9E',
              marginBottom: '4px',
            }}>
              Completed Rounds
            </p>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#11C48D',
            }}>
              {completedRounds}
            </p>
          </div>
        </div>
      </div>

      {/* Target Selection */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', color: '#E7F5F1', marginBottom: '12px' }}>Target Count</h3>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {[33, 99, 100, 1000].map((value) => (
            <button
              key={value}
              onClick={() => changeTarget(value)}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: target === value
                  ? `linear-gradient(135deg, ${dhikrOptions[selectedDhikr].color} 0%, ${dhikrOptions[selectedDhikr].color}CC 100%)`
                  : 'rgba(255, 255, 255, 0.1)',
                color: target === value ? '#FFFFFF' : '#BBE1D5',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{
        padding: '20px',
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
      }}>
        <button
          onClick={resetCount}
          className="btn btn-secondary"
          style={{ minWidth: '120px' }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Instructions */}
      <div className="card" style={{ margin: '20px', marginTop: '0' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#E7F5F1',
          marginBottom: '12px',
        }}>
          How to Use
        </h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}>
          <li style={{
            fontSize: '14px',
            color: '#BBE1D5',
            marginBottom: '8px',
            lineHeight: '1.6',
          }}>
            • Click the counter circle or press <strong>Spacebar</strong> to increment
          </li>
          <li style={{
            fontSize: '14px',
            color: '#BBE1D5',
            marginBottom: '8px',
            lineHeight: '1.6',
          }}>
            • Select a dhikr from the options above
          </li>
          <li style={{
            fontSize: '14px',
            color: '#BBE1D5',
            marginBottom: '8px',
            lineHeight: '1.6',
          }}>
            • Choose your target count (33, 99, 100, or 1000)
          </li>
          <li style={{
            fontSize: '14px',
            color: '#BBE1D5',
            lineHeight: '1.6',
          }}>
            • The counter will flash when you complete a round
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TasbihScreen;

