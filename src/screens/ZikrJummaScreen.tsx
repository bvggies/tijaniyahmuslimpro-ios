import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../utils/theme';
import './ZikrJummaScreen.css';

// Digital Counter Component
const DigitalCounter = ({ count, onIncrement, onDecrement, onReset }: {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}) => (
  <div className="counter-container">
    <button className="counter-button" onClick={onDecrement}>
      <span>−</span>
    </button>
    <div className="counter-display">
      <span className="counter-text">{count}</span>
    </div>
    <button className="counter-button" onClick={onIncrement}>
      <span>+</span>
    </button>
    <button className="reset-button" onClick={onReset}>
      <span>↻</span>
    </button>
  </div>
);

// Haylala Step Card Component
const HaylalaStepCard = ({ 
  stepNumber, 
  title, 
  arabic, 
  transliteration, 
  english, 
  count, 
  onIncrement, 
  onDecrement, 
  onReset,
  isCompleted,
  targetCount 
}: {
  stepNumber: number;
  title: string;
  arabic: string;
  transliteration: string;
  english: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  isCompleted: boolean;
  targetCount: number;
}) => (
  <div className={`haylala-step-card ${isCompleted ? 'completed' : ''}`}>
    <div className="haylala-step-header">
      <div className={`haylala-step-number ${isCompleted ? 'completed' : ''}`}>
        <span className="haylala-step-number-text">{stepNumber}</span>
      </div>
      <div className="haylala-step-title-container">
        <h3 className={`haylala-step-title ${isCompleted ? 'completed' : ''}`}>{title}</h3>
        <p className="haylala-step-progress">{count}/{targetCount}</p>
      </div>
      {isCompleted && (
        <div className="completed-icon">
          <span>✓</span>
        </div>
      )}
    </div>
    
    <div className="haylala-step-content">
      <p className="haylala-arabic-text">{arabic}</p>
      <p className="haylala-transliteration-text">{transliteration}</p>
      <p className="haylala-english-text">{english}</p>
    </div>
    
    <DigitalCounter
      count={count}
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      onReset={onReset}
    />
  </div>
);

interface ZikrItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  completed: boolean;
  category: 'friday' | 'general' | 'surah';
}

const fridayZikr: ZikrItem[] = [
  {
    id: '1',
    title: 'Surah Al-Kahf',
    arabic: 'سُورَةُ الْكَهْف',
    transliteration: 'Surah Al-Kahf',
    translation: 'The Cave - Read on Friday for protection',
    count: 1,
    completed: false,
    category: 'surah',
  },
  {
    id: '2',
    title: 'Salawat on Prophet (PBUH)',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    transliteration: 'Allahumma salli ala Muhammad',
    translation: 'O Allah, send blessings upon Muhammad',
    count: 100,
    completed: false,
    category: 'friday',
  },
  {
    id: '3',
    title: 'Istighfar (Seeking Forgiveness)',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah',
    count: 100,
    completed: false,
    category: 'general',
  },
  {
    id: '4',
    title: 'Tasbih (Glory to Allah)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah',
    count: 100,
    completed: false,
    category: 'general',
  },
  {
    id: '5',
    title: 'Tahmid (Praise to Allah)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Praise be to Allah',
    count: 100,
    completed: false,
    category: 'general',
  },
  {
    id: '6',
    title: 'Takbir (Allah is Great)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    count: 100,
    completed: false,
    category: 'general',
  },
];

const fridayDuas = [
  {
    id: '1',
    title: 'Dua for Friday Morning',
    arabic: 'اللَّهُمَّ اجْعَلْنَا مِنَ التَّوَّابِينَ وَاجْعَلْنَا مِنَ الْمُتَطَهِّرِينَ',
    transliteration: 'Allahumma ij\'alna minat-tawwabeen wa ij\'alna minal-mutatahhireen',
    translation: 'O Allah, make us among those who repent and purify themselves',
  },
  {
    id: '2',
    title: 'Dua for Friday Blessings',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي يَوْمِ الْجُمُعَةِ',
    transliteration: 'Allahumma barik lana fi yawmil Jumu\'ah',
    translation: 'O Allah, bless us on this Friday',
  },
];

export default function ZikrJummaScreen() {
  const navigate = useNavigate();
  const [zikrItems, setZikrItems] = useState<ZikrItem[]>(fridayZikr);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'friday' | 'general' | 'surah'>('all');
  const [currentCounts, setCurrentCounts] = useState<{ [key: string]: number }>({});
  
  // Haylala (Friday's Dhikr) state
  const [istighfarCount, setIstighfarCount] = useState(0);
  const [salatilFathiCount1, setSalatilFathiCount1] = useState(0);
  const [laIlahaCount, setLaIlahaCount] = useState(0);
  const [sayidinaMuhammadCount, setSayidinaMuhammadCount] = useState(0);
  const [salatilFathiCount2, setSalatilFathiCount2] = useState(0);
  const [showHaylalaInfo, setShowHaylalaInfo] = useState(false);

  const filteredZikr = zikrItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const completedCount = zikrItems.filter(item => item.completed).length;
  const totalCount = zikrItems.length;

  const incrementCount = (id: string) => {
    const newCount = (currentCounts[id] || 0) + 1;
    setCurrentCounts(prev => ({ ...prev, [id]: newCount }));
    
    const zikrItem = zikrItems.find(item => item.id === id);
    if (zikrItem && newCount >= zikrItem.count) {
      setZikrItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, completed: true } : item
        )
      );
    }
  };

  const resetCount = (id: string) => {
    setCurrentCounts(prev => ({ ...prev, [id]: 0 }));
    setZikrItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: false } : item
      )
    );
  };

  const resetAllHaylalaCounters = () => {
    setIstighfarCount(0);
    setSalatilFathiCount1(0);
    setLaIlahaCount(0);
    setSayidinaMuhammadCount(0);
    setSalatilFathiCount2(0);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'friday': return '#9C27B0';
      case 'general': return '#2196F3';
      case 'surah': return '#FF9800';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'friday': return '📅';
      case 'general': return '●';
      case 'surah': return '📖';
      default: return '●';
    }
  };

  const renderZikrCard = (item: ZikrItem) => {
    const currentCount = currentCounts[item.id] || 0;
    const progress = (currentCount / item.count) * 100;
    
    return (
      <div
        key={item.id}
        className={`zikr-card ${item.completed ? 'completed' : ''}`}
      >
        <div className="zikr-header">
          <div className="zikr-info">
            <div className="zikr-title-row">
              <h3 className={`zikr-title ${item.completed ? 'completed' : ''}`}>
                {item.title}
              </h3>
              <div className="category-badge" style={{ backgroundColor: getCategoryColor(item.category) }}>
                <span>{getCategoryIcon(item.category)}</span>
              </div>
            </div>
            <p className="arabic-text">{item.arabic}</p>
            <p className="transliteration-text">{item.transliteration}</p>
            <p className="translation-text">{item.translation}</p>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-header">
            <span className="progress-text">
              {currentCount} / {item.count}
            </span>
            <span className="progress-percentage">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="action-buttons">
          <button
            className={`count-button ${item.completed ? 'disabled' : ''}`}
            onClick={() => incrementCount(item.id)}
            disabled={item.completed}
          >
            <span>{item.completed ? '✓' : '+'}</span>
          </button>
          
          <button
            className="reset-button-small"
            onClick={() => resetCount(item.id)}
          >
            <span>↻</span>
            <span>Reset</span>
          </button>
        </div>
      </div>
    );
  };

  const renderDuaCard = (item: any) => (
    <div key={item.id} className="dua-card">
      <h3 className="dua-title">{item.title}</h3>
      <p className="dua-arabic">{item.arabic}</p>
      <p className="dua-transliteration">{item.transliteration}</p>
      <p className="dua-translation">{item.translation}</p>
    </div>
  );

  return (
    <div className="zikr-jumma-container">
      <div className="scroll-container">
        {/* Haylala (Friday's Dhikr) Section */}
        <div className="haylala-section">
          <div 
            className="haylala-header"
            style={{
              background: `linear-gradient(135deg, ${colors.accentTeal}, ${colors.accentGreen})`,
            }}
          >
            <div className="haylala-header-content">
              <div>
                <h2 className="haylala-title">Haylala (Friday's Dhikr)</h2>
                <p className="haylala-subtitle">The Friday's dhikr to perform between 'Asr and Maghreb Prayers</p>
              </div>
              <button 
                className="info-button"
                onClick={() => setShowHaylalaInfo(true)}
              >
                <span>ℹ️</span>
              </button>
            </div>
          </div>

          <div className="haylala-content">
            <p className="haylala-intro-text">
              The Haylala (other names: Hadra, 'Asru) is the Friday's dhikr to perform between 'Asr and Maghreb Prayers.
            </p>

            {/* Niyyah (Intention) */}
            <div className="niyyah-card">
              <h3 className="niyyah-title">Niyyah (Intention)</h3>
              <p className="niyyah-arabic">
                اللهم إني نويت ذكر هيللة الجمعة اللازمة في الطريقة التجانية إقتداء بسيد أحمد التجاني رضي اللّٰه عنه تعبدا لله تعالى
              </p>
              <p className="niyyah-transliteration">
                Allahumma innii nawaytu dzikria haylalatal jum'ati allaazimati fit-țareeqati Tijaniyyah iqtidaa-a bisayyidi Ahmad at-Tijani Radiyallahu anhu ta'abbudan lillahi ta'aalaa.
              </p>
              <p className="niyyah-english">
                O Allah, I intend to perform the dhikr of the obligatory Friday Haylala in the Tijani Tariqa, following our Master Ahmad al-Tijani, may Allah be pleased with him, as an act of devotion to Allah the Almighty.
              </p>
            </div>

            {/* Haylala Steps */}
            <div className="haylala-steps-container">
              {/* Step 1: Auzubillah */}
              <HaylalaStepCard
                stepNumber={1}
                title="Seeking Refuge"
                arabic="أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ"
                transliteration="Auzubil-lahi minach-chaytani-rajim"
                english="I take refuge in God against the cursed satan"
                count={1}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onReset={() => {}}
                isCompleted={true}
                targetCount={1}
              />

              {/* Step 2: Suratul Fatiha */}
              <HaylalaStepCard
                stepNumber={2}
                title="Suratul Fatiha"
                arabic="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                transliteration="Bismillahi ar-Rahman ar-Raheem"
                english="Recite Suratul Fatiha"
                count={1}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onReset={() => {}}
                isCompleted={true}
                targetCount={1}
              />

              {/* Step 3: Istighfar */}
              <HaylalaStepCard
                stepNumber={3}
                title="Istighfar (3 times)"
                arabic="أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ"
                transliteration="Astaghfirullah Al 'Aziim alazii laa ilaaha illaa Huwal-Hayyul-Qayyoum"
                english="I ask forgiveness from ALLAH, The Great One, no God exists but Him, The Ever Living One, The Self Existing One"
                count={istighfarCount}
                onIncrement={() => setIstighfarCount(prev => Math.min(prev + 1, 3))}
                onDecrement={() => setIstighfarCount(prev => Math.max(prev - 1, 0))}
                onReset={() => setIstighfarCount(0)}
                isCompleted={istighfarCount >= 3}
                targetCount={3}
              />

              {/* Step 4: Salatil Fathi (First) */}
              <HaylalaStepCard
                stepNumber={4}
                title="Salatil Fathi (3 times)"
                arabic="اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَىٰ صِرَاطِكَ الْمُسْتَقِيمِ"
                transliteration="Allahumma salli 'ala Sayyidina Muhammadini l-Fatihi lima ughliq(a), wa l-khatimi lima sabaq(a), nasiri l-haqqi bi l-haqq(i), wa l-hadi ila siratika l-mustaqim(i)"
                english="O Allah, send prayers upon our master Muhammad, the opener of what was closed, and the seal of what had preceded, the helper of the truth by the Truth, and the guide to Your straight path"
                count={salatilFathiCount1}
                onIncrement={() => setSalatilFathiCount1(prev => Math.min(prev + 1, 3))}
                onDecrement={() => setSalatilFathiCount1(prev => Math.max(prev - 1, 0))}
                onReset={() => setSalatilFathiCount1(0)}
                isCompleted={salatilFathiCount1 >= 3}
                targetCount={3}
              />

              {/* Step 5: La Ilaha Illallah */}
              <HaylalaStepCard
                stepNumber={5}
                title="La Ilaha Illallah (1000/1200/1600 times)"
                arabic="لَا إِلَٰهَ إِلَّا اللَّهُ"
                transliteration="La ilaha illal-lah"
                english="There is no god but Allah"
                count={laIlahaCount}
                onIncrement={() => setLaIlahaCount(prev => Math.min(prev + 1, 1600))}
                onDecrement={() => setLaIlahaCount(prev => Math.max(prev - 1, 0))}
                onReset={() => setLaIlahaCount(0)}
                isCompleted={laIlahaCount >= 1000}
                targetCount={1000}
              />

              {/* Step 6: Sayidina Muhammad Rasulullah */}
              <HaylalaStepCard
                stepNumber={6}
                title="Sayidina Muhammad Rasulullah"
                arabic="سَيِّدِنَا مُحَمَّدٌ رَسُولُ اللَّهِ"
                transliteration="Sayyidina Muhammad Rasulullah"
                english="Our master Muhammad is the Messenger of Allah"
                count={sayidinaMuhammadCount}
                onIncrement={() => setSayidinaMuhammadCount(prev => Math.min(prev + 1, 1))}
                onDecrement={() => setSayidinaMuhammadCount(prev => Math.max(prev - 1, 0))}
                onReset={() => setSayidinaMuhammadCount(0)}
                isCompleted={sayidinaMuhammadCount >= 1}
                targetCount={1}
              />

              {/* Step 7: Auzubillah (Second) */}
              <HaylalaStepCard
                stepNumber={7}
                title="Seeking Refuge (Second)"
                arabic="أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ"
                transliteration="Auzubil-lahi minach-chaytani-rajim"
                english="I take refuge in God against the cursed satan"
                count={1}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onReset={() => {}}
                isCompleted={true}
                targetCount={1}
              />

              {/* Step 8: Suratul Fatiha (Second) */}
              <HaylalaStepCard
                stepNumber={8}
                title="Suratul Fatiha (Second)"
                arabic="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                transliteration="Bismillahi ar-Rahman ar-Raheem"
                english="Recite Suratul Fatiha"
                count={1}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onReset={() => {}}
                isCompleted={true}
                targetCount={1}
              />

              {/* Step 9: Salatil Fathi (Second) */}
              <HaylalaStepCard
                stepNumber={9}
                title="Salatil Fathi (3 times - Second)"
                arabic="اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَىٰ صِرَاطِكَ الْمُسْتَقِيمِ"
                transliteration="Allahumma salli 'ala Sayyidina Muhammadini l-Fatihi lima ughliq(a), wa l-khatimi lima sabaq(a), nasiri l-haqqi bi l-haqq(i), wa l-hadi ila siratika l-mustaqim(i)"
                english="O Allah, send prayers upon our master Muhammad, the opener of what was closed, and the seal of what had preceded, the helper of the truth by the Truth, and the guide to Your straight path"
                count={salatilFathiCount2}
                onIncrement={() => setSalatilFathiCount2(prev => Math.min(prev + 1, 3))}
                onDecrement={() => setSalatilFathiCount2(prev => Math.max(prev - 1, 0))}
                onReset={() => setSalatilFathiCount2(0)}
                isCompleted={salatilFathiCount2 >= 3}
                targetCount={3}
              />

              {/* Step 10: Closing Dua */}
              <HaylalaStepCard
                stepNumber={10}
                title="Closing Dua"
                arabic="إِنَّ اللَّهَ وَمَلَيِكَتَهُ يُصَلَوْنَ عَلَ النَّبيِّ يَأْيِهَا الذِينَ ءَامَنُواْ صَلّوا عَليهِ وَسَلِمُوا تَسَلِيمًا"
                transliteration="Innal laha wa mala-ikatahu yuçalluna 'Alan-nabiyyi ya ayyuhal-lazina amanu çallu 'alayhi wa sallimu taslima"
                english="Indeed, Allah and His angels send blessings upon the Prophet. O you who believe, send blessings upon him and greet him with peace"
                count={1}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onReset={() => {}}
                isCompleted={true}
                targetCount={1}
              />
            </div>

            {/* Reset All Button */}
            <button 
              className="reset-all-button"
              onClick={resetAllHaylalaCounters}
            >
              <span>↻</span>
              <span>Reset All Counters</span>
            </button>
          </div>
        </div>

        {/* Friday Info Card */}
        <div className="info-card">
          <div className="info-content">
            <span>ℹ️</span>
            <div className="info-text">
              <h3 className="info-title">Friday - The Best Day</h3>
              <p className="info-description">
                Friday is the best day of the week. Engage in special dhikr and prayers to receive Allah's blessings.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-container">
          {[
            { key: 'all', label: 'All', icon: '☰' },
            { key: 'friday', label: 'Friday', icon: '📅' },
            { key: 'general', label: 'General', icon: '●' },
            { key: 'surah', label: 'Surah', icon: '📖' },
          ].map((filter) => (
            <button
              key={filter.key}
              className={`filter-button ${selectedCategory === filter.key ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(filter.key as any)}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Zikr Items */}
        <div className="section">
          <h2 className="section-title">Friday Dhikr</h2>
          {filteredZikr.map(item => renderZikrCard(item))}
        </div>

        {/* Friday Duas */}
        <div className="section">
          <h2 className="section-title">Friday Duas</h2>
          {fridayDuas.map(item => renderDuaCard(item))}
        </div>

        {/* Friday Reminder */}
        <div className="reminder-card">
          <div 
            className="reminder-gradient"
            style={{
              background: `linear-gradient(135deg, #9C27B0, #BA68C8)`,
            }}
          >
            <span>💡</span>
            <div className="reminder-content">
              <h3 className="reminder-title">Friday Reminder</h3>
              <p className="reminder-text">
                "The best day on which the sun has risen is Friday; on it Adam was created, on it he was made to enter Paradise, and on it he was expelled from it."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Haylala Information Modal */}
      {showHaylalaInfo && (
        <div className="modal-overlay" onClick={() => setShowHaylalaInfo(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Information</h3>
              <button 
                className="modal-close-button"
                onClick={() => setShowHaylalaInfo(false)}
              >
                <span>✕</span>
              </button>
            </div>
            
            <div className="modal-scroll-view">
              <p className="modal-text">
                <strong>When to Perform:</strong><br />
                The Haylala (other names: Hadra, 'Asru) is the Friday's dhikr to perform between 'Asr and Maghreb Prayers.
              </p>
              
              <p className="modal-text">
                <strong>How to Perform:</strong><br />
                Like the Wadhifa, the Friday's Hadra must be performed in congregation whenever it is possible, arranging the ranks properly, reciting loud. If there is no congregation to join, do it alone.
              </p>
              
              <p className="modal-text">
                <strong>Important Timing:</strong><br />
                It is performed only the Friday, and only between 'Asr and Maghreb Prayers, the best time is just before the Azan of the Maghreb Prayer. If not accomplished during this lapse of time, we can't make up for it.
              </p>
              
              <p className="modal-text">
                <strong>Warning:</strong><br />
                Seyyidina Ahmed Tijani (may ALLAH be satisfied with him) said that if it is not performed during this period (i.e. between the 'Asr and Maghreb Prayers of the Friday) without a valid excuse, the follower has to know that he has missed a huge blessing that he will not be able to make up.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

