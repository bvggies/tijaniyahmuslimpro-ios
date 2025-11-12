import React, { useState } from 'react';
import { colors } from '../utils/theme';
import IslamicBackground from '../components/IslamicBackground';
import './TijaniyaLazimScreen.css';

const TijaniyaLazimScreen: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStep, setSelectedStep] = useState(0);
  const [lazimType, setLazimType] = useState<'morning' | 'evening' | null>(null);

  const lazimSteps = [
    {
      id: 0,
      title: "Niyyah (Intention)",
      arabic: "اللهم إني نويت أن أتقرب إليك بقرائة ورد الصباح اللازم في الطريقة التجانية إقتداء بسيد أحمد التجاني رضي اللّٰه عنه تعبدا لله تعالى",
      transliteration: "Allahumma innii nawaytu an ataqarraba ilayka bi qiraa-ati wirdis-sabaahi allaazim fit-țareeqati Tijaniyyah iqtidaa-a bisayyidi Ahmad at-Tijani Radiyallahu anhu ta'abbudan lillahi ta'aalaa.",
      translation: "O Allah, I intend to draw closer to You by reciting the obligatory morning Lazim in the Tijani Tariqa, following our Master Ahmad al-Tijani, may Allah be pleased with him, as an act of devotion to Allah the Almighty.",
      instruction: "Choose Morning or Evening Lazim below, then recite the appropriate intention.",
      color: colors.accentYellow,
      icon: "❤️",
      details: "This is the niyyah (intention) that must be recited before beginning the Lazim. Choose whether you're performing the Morning Lazim or Evening Lazim, then recite the appropriate intention.",
      morningArabic: "اللهم إني نويت أن أتقرب إليك بقرائة ورد الصباح اللازم في الطريقة التجانية إقتداء بسيد أحمد التجاني رضي اللّٰه عنه تعبدا لله تعالى",
      morningTransliteration: "Allahumma innii nawaytu an ataqarraba ilayka bi qiraa-ati wirdis-sabaahi allaazim fit-țareeqati Tijaniyyah iqtidaa-a bisayyidi Ahmad at-Tijani Radiyallahu anhu ta'abbudan lillahi ta'aalaa.",
      morningTranslation: "O Allah, I intend to draw closer to You by reciting the obligatory morning Lazim in the Tijani Tariqa, following our Master Ahmad al-Tijani, may Allah be pleased with him, as an act of devotion to Allah the Almighty.",
      eveningArabic: "اللهم إني نويت أن أتقرب إليك بقرائة ورد المساء اللازم في الطريقة التجانية إقتداء بسيد أحمد التجاني رضي اللّٰه عنه تعبدا لله تعالى",
      eveningTransliteration: "Allahumma innii nawaytu an ataqarraba ilayka bi qiraa-ati wirdil-masaa-i allaazim fit-tareeqati Tijaniyyah iqtidaa-a bisayyidi Ahmad at-Tijani Radiyallahu anhu ta'abbudan lillahi ta'aalaa.",
      eveningTranslation: "O Allah, I intend to draw closer to You by reciting the obligatory evening Lazim in the Tijani Tariqa, following our Master Ahmad al-Tijani, may Allah be pleased with him, as an act of devotion to Allah the Almighty."
    },
    {
      id: 1,
      title: "Opening Supplication",
      arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      transliteration: "A'Uzubillahi minashaytani -rajim",
      translation: "I seek refuge in Allah from Satan, the accursed",
      instruction: "Start with this supplication, then recite Suratul Fatiha until Amin",
      color: colors.primary,
      icon: "🛡️",
      details: "This is the opening supplication that protects you from Satan's influence before beginning the Lazim. After reciting this, proceed to recite the entire Suratul Fatiha (The Opening) until you reach 'Amin'."
    },
    {
      id: 2,
      title: "Seeking Forgiveness",
      arabic: "أَسْتَغْفِرُ اللَّه",
      transliteration: "ASTAGHFIRULLAH",
      translation: "I ask Allah for forgiveness",
      instruction: "Recite this 100 times using the counter",
      color: colors.success,
      icon: "💧",
      details: "This is the formula for asking forgiveness. Recite 'ASTAGHFIRULLAH' exactly 100 times. Use the counter to keep track of your recitations. This purifies your heart and soul before proceeding to the next step."
    },
    {
      id: 3,
      title: "Salat upon the Prophet",
      arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ",
      transliteration: "Allahumma şalli 'ala Sayyidina Muhammadini |-Fatihi limă ughliq(a), wa l-khatimi limā sabaq(a), năşiri |-haqqi bi l-haqq(i), wa I-hădi ilă șirațikal-mustaqim(i), wa 'alā alihi haqqa qadrihi wa miqdārihi I-'azim.",
      translation: "O Allah, send prayers upon our master Muhammad, the opener of what was closed, and the seal of what had preceded, the helper of the truth by the Truth, and the guide to Your straight path. May Allah send prayers upon his Family according to his greatness and magnificent rank.",
      instruction: "Recite Salatul Fatihi 100 times (this is the best salat upon the Prophet)",
      color: colors.accentTeal,
      icon: "⭐",
      details: "This is Salatul Fatihi, the most powerful prayer upon the Prophet (PBUH). Recite this complete formula 100 times. This prayer has immense spiritual benefits and is considered the best form of sending blessings upon the Prophet."
    },
    {
      id: 4,
      title: "Declaration of Faith",
      arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
      transliteration: "La ilaha illal-lah",
      translation: "There is no god but Allah",
      instruction: "Recite this 100 times, then add the completion formula",
      color: colors.warning,
      icon: "💎",
      details: "This is the declaration of faith (Shahada). Recite 'La ilaha illal-lah' exactly 100 times. After the 100th recitation, you must add the completion formula to properly conclude this step."
    },
    {
      id: 5,
      title: "Completion Formula",
      arabic: "سَيِّدُنَا مُحَمَّدٌ رَسُولُ اللَّهِ عَلَيْهِ السَّلَامُ اللَّهِ",
      transliteration: "Sayyiduna Muhammad rasulullahi alayhi salami-lah",
      translation: "Our master Muhammad is the Messenger of Allah, peace be upon him",
      instruction: "Recite this after the 100th 'La ilaha illal-lah'",
      color: colors.accentGreen,
      icon: "✅",
      details: "This is the completion formula that must be recited immediately after the 100th 'La ilaha illal-lah'. It completes the declaration of faith and acknowledges the Prophet's status as Allah's messenger."
    },
    {
      id: 6,
      title: "Closing Supplication",
      arabic: "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا",
      transliteration: "Innal laha wa mala-ikatahu yuçalluna 'Alan-nabiyyi ya ayyuhal-lazina amanu çallu 'alayhi wa sallimu taslima",
      translation: "Indeed, Allah and His angels send blessings upon the Prophet. O you who believe, send blessings upon him and greet him with peace.",
      instruction: "Recite this beautiful verse from the Quran",
      color: colors.primary,
      icon: "📖",
      details: "This is a verse from the Quran (33:56) that commands believers to send blessings upon the Prophet. It's a beautiful way to conclude the Lazim with Allah's own words."
    },
    {
      id: 7,
      title: "Final Blessings",
      arabic: "صَلَّى اللَّهُ عَلَيْهِ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ تَسْلِيمًا سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ وَسَلَامٌ عَلَى الْمُرْسَلِينَ وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      transliteration: "Çallal-lahu alayhi wa ala alihi wa çahbihi wa sallama tasliman. Subhana rabbika rabbil-izzaati amma yacifuna wa salamun alal-murçalina wal-hamdulil-lahi rabbil Alamin",
      translation: "May Allah send blessings upon him, his family, and his companions, and grant them peace. Glory to your Lord, the Lord of honor, above what they describe. Peace be upon the messengers, and praise be to Allah, Lord of the worlds.",
      instruction: "Conclude with these final blessings and praises",
      color: colors.accentTeal,
      icon: "❤️",
      details: "This is the final supplication that concludes the Lazim. It includes blessings upon the Prophet, his family, and companions, followed by glorification of Allah and praise for His messengers."
    }
  ];

  const resetCounter = () => {
    setCounter(0);
  };

  const incrementCounter = () => {
    if (counter < 100) {
      setCounter(counter + 1);
    } else {
      window.alert("Complete: You have reached 100 recitations!");
    }
  };

  const decrementCounter = () => {
    if (counter > 0) {
      setCounter(counter - 1);
    }
  };

  const openStepModal = (stepIndex: number) => {
    setSelectedStep(stepIndex);
    setIsModalVisible(true);
  };

  const renderStepCard = (step: any, index: number) => {
    // Special handling for niyyah step
    if (step.id === 0) {
      return (
        <div key={step.id} className="niyyah-card">
          <div 
            className="niyyah-gradient"
            style={{
              background: `linear-gradient(135deg, ${step.color}, ${step.color}80)`,
            }}
          >
            <div className="niyyah-header">
              <div className="niyyah-number">
                <span className="niyyah-number-text">{step.id}</span>
              </div>
              <div className="niyyah-title-container">
                <h3 className="niyyah-title">{step.title}</h3>
                <p className="niyyah-instruction">{step.instruction}</p>
              </div>
              <span className="niyyah-icon">{step.icon}</span>
            </div>
            
            {/* Lazim Type Selection */}
            <div className="lazim-type-container">
              <p className="lazim-type-title">Choose Lazim Type:</p>
              <div className="lazim-type-buttons">
                <button
                  className={`lazim-type-button ${lazimType === 'morning' ? 'selected' : ''}`}
                  onClick={() => setLazimType('morning')}
                >
                  Morning Lazim
                </button>
                <button
                  className={`lazim-type-button ${lazimType === 'evening' ? 'selected' : ''}`}
                  onClick={() => setLazimType('evening')}
                >
                  Evening Lazim
                </button>
              </div>
            </div>
            
            {/* Display selected niyyah */}
            {lazimType && (
              <div className="selected-niyyah-container">
                <div className="arabic-container">
                  <p className="arabic-text">
                    {lazimType === 'morning' ? step.morningArabic : step.eveningArabic}
                  </p>
                </div>
                
                <div className="transliteration-container">
                  <p className="transliteration-text">
                    {lazimType === 'morning' ? step.morningTransliteration : step.eveningTransliteration}
                  </p>
                </div>
                
                <div className="translation-container">
                  <p className="translation-text">
                    {lazimType === 'morning' ? step.morningTranslation : step.eveningTranslation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Regular step rendering
    return (
      <div
        key={step.id}
        className="step-card"
        onClick={() => openStepModal(index)}
      >
        <div 
          className="step-gradient"
          style={{
            background: `linear-gradient(135deg, ${step.color}, ${step.color}80)`,
          }}
        >
          <div className="step-header">
            <div className="step-number">
              <span className="step-number-text">{step.id}</span>
            </div>
            <div className="step-title-container">
              <h3 className="step-title">{step.title}</h3>
              <p className="step-instruction">{step.instruction}</p>
            </div>
            <span className="step-icon">{step.icon}</span>
          </div>
          
          <div className="arabic-container">
            <p className="arabic-text">{step.arabic}</p>
          </div>
          
          <div className="transliteration-container">
            <p className="transliteration-text">{step.transliteration}</p>
          </div>
          
          <div className="translation-container">
            <p className="translation-text">{step.translation}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderCounter = () => (
    <div className="counter-container">
      <div 
        className="counter-gradient"
        style={{
          background: `linear-gradient(135deg, ${colors.accentTeal}, ${colors.primary})`,
        }}
      >
        <h3 className="counter-title">Recitation Counter</h3>
        <div className="counter-display">
          <span className="counter-number">{counter}</span>
          <span className="counter-label">/ 100</span>
        </div>
        <div className="counter-buttons">
          <button
            className="counter-button"
            onClick={decrementCounter}
            disabled={counter === 0}
          >
            <span>−</span>
          </button>
          <button
            className="counter-button"
            onClick={incrementCounter}
            disabled={counter === 100}
          >
            <span>+</span>
          </button>
        </div>
        <button
          className="reset-button"
          onClick={resetCounter}
        >
          Reset Counter
        </button>
      </div>
    </div>
  );

  return (
    <IslamicBackground opacity={0.1}>
      <div className="tijaniya-lazim-container">
        <div className="scroll-container">
          {/* Header */}
          <div 
            className="header"
            style={{
              background: `linear-gradient(135deg, ${colors.accentTeal}, ${colors.primary})`,
            }}
          >
            <div className="header-content">
              <span className="header-icon">📖</span>
              <h1 className="header-title">Tijaniya Lazim</h1>
              <p className="header-subtitle">The Obligatory Recitation</p>
              <p className="header-arabic">تطبيق الورد اللازم</p>
            </div>
          </div>

          {/* Counter Section */}
          {renderCounter()}

          {/* Steps */}
          <div className="steps-container">
            <h2 className="section-title">Tijaniya Lazim</h2>
            {lazimSteps.map((step, index) => renderStepCard(step, index))}
          </div>

          {/* Instructions */}
          <div className="instructions-container">
            <div className="instructions-gradient">
              <h3 className="instructions-title">Important Instructions</h3>
              <p className="instructions-text">
                • Perform ablution (wudu) before starting<br />
                • Find a clean, quiet place<br />
                • Face the Qibla direction<br />
                • Use the counter for accurate counting<br />
                • Recite with proper pronunciation<br />
                • Maintain focus and sincerity<br />
                • Complete all steps in order
              </p>
            </div>
          </div>
        </div>

        {/* Step Detail Modal */}
        {isModalVisible && (
          <div className="modal-overlay" onClick={() => setIsModalVisible(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div 
                className="modal-gradient"
                style={{
                  background: `linear-gradient(135deg, ${lazimSteps[selectedStep]?.color || colors.primary}, ${lazimSteps[selectedStep]?.color || colors.primary}80)`,
                }}
              >
                <div className="modal-header">
                  <h3 className="modal-title">{lazimSteps[selectedStep]?.title}</h3>
                  <button
                    className="close-button"
                    onClick={() => setIsModalVisible(false)}
                  >
                    <span>✕</span>
                  </button>
                </div>
                
                <div className="modal-scroll">
                  <div className="modal-arabic-container">
                    <p className="modal-arabic-text">{lazimSteps[selectedStep]?.arabic}</p>
                  </div>
                  
                  <div className="modal-transliteration-container">
                    <p className="modal-transliteration-text">{lazimSteps[selectedStep]?.transliteration}</p>
                  </div>
                  
                  <div className="modal-translation-container">
                    <p className="modal-translation-text">{lazimSteps[selectedStep]?.translation}</p>
                  </div>
                  
                  <div className="modal-details-container">
                    <p className="modal-details-text">{lazimSteps[selectedStep]?.details}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </IslamicBackground>
  );
};

export default TijaniyaLazimScreen;

