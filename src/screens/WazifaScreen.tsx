import React, { useState } from 'react';
import '../App.css';

const WazifaScreen: React.FC = () => {
  const [istighfarCount, setIstighfarCount] = useState(0);
  const [salatilFathiCount, setSalatilFathiCount] = useState(0);
  const [laIlahaCount, setLaIlahaCount] = useState(0);
  const [jawharatulKamalCount, setJawharatulKamalCount] = useState(0);
  const [showClosingDua, setShowClosingDua] = useState(false);

  const resetAllCounters = () => {
    setIstighfarCount(0);
    setSalatilFathiCount(0);
    setLaIlahaCount(0);
    setJawharatulKamalCount(0);
  };

  const isStepCompleted = (count: number, target: number) => count >= target;

  const DigitalCounter = ({ count, onIncrement, onDecrement, onReset, targetCount }: {
    count: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onReset: () => void;
    targetCount: number;
  }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      background: 'linear-gradient(135deg, #00BFA5 0%, #11C48D 100%)',
      borderRadius: '25px',
      padding: '8px 16px',
      marginTop: '16px',
    }}>
      <button
        onClick={onDecrement}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        −
      </button>
      <div style={{
        minWidth: '60px',
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: '24px',
        fontWeight: 'bold',
      }}>
        {count}/{targetCount}
      </div>
      <button
        onClick={onIncrement}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        +
      </button>
      <button
        onClick={onReset}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          fontSize: '20px',
          marginLeft: '8px',
        }}
      >
        ↻
      </button>
    </div>
  );

  const WazifaStepCard = ({
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
    targetCount,
    useWhiteYellow = false,
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
    useWhiteYellow?: boolean;
  }) => (
    <div className="card" style={{
      marginBottom: '16px',
      background: isCompleted ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.95)',
      borderLeft: isCompleted ? '4px solid #00BFA5' : '1px solid rgba(255, 255, 255, 0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: isCompleted ? '#11C48D' : '#00BFA5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '16px',
          color: '#FFFFFF',
          fontSize: '18px',
          fontWeight: 'bold',
        }}>
          {stepNumber}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: isCompleted ? '#00BFA5' : '#2C3E50',
            margin: 0,
            marginBottom: '4px',
          }}>
            {title}
          </h3>
          <p style={{ fontSize: '14px', color: '#7F8C8D', margin: 0 }}>
            {count}/{targetCount}
          </p>
        </div>
        {isCompleted && (
          <div style={{ color: '#00BFA5', fontSize: '24px' }}>✓</div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p className="arabic-text" style={{
          fontSize: '20px',
          color: useWhiteYellow ? '#FFFFFF' : '#1a365d',
          textAlign: 'right',
          marginBottom: '8px',
          lineHeight: '32px',
          fontWeight: '700',
        }}>
          {arabic}
        </p>
        <p style={{
          fontSize: '16px',
          color: '#4a5568',
          fontStyle: 'italic',
          marginBottom: '8px',
          lineHeight: '24px',
        }}>
          {transliteration}
        </p>
        <p style={{
          fontSize: '16px',
          color: useWhiteYellow ? '#FFD700' : '#B8860B',
          lineHeight: '24px',
          fontWeight: '500',
        }}>
          {english}
        </p>
      </div>

      <DigitalCounter
        count={count}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onReset={onReset}
        targetCount={targetCount}
      />
    </div>
  );

  return (
    <div className="App">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #00BFA5 0%, #11C48D 100%)',
        paddingTop: '40px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
        color: '#FFFFFF',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '32px' }}>📖</span>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Wazifa</h1>
            <p style={{ fontSize: '16px', margin: '4px 0 0', opacity: 0.9 }}>Daily Islamic Practice</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Introduction */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '12px' }}>
            The Wazifa Unfolding
          </h2>
          <p style={{ fontSize: '16px', color: '#BBE1D5', lineHeight: '24px' }}>
            The Wazifa is to be performed once or twice a day. Follow the steps below in order,
            using the counters to track your progress.
          </p>
        </div>

        {/* Niyyah */}
        <div className="card" style={{
          marginBottom: '20px',
          borderLeft: '4px solid #FFD54F',
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#FFD54F',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            Niyyah (Intention)
          </h3>
          <p className="arabic-text" style={{
            fontSize: '18px',
            color: '#E7F5F1',
            textAlign: 'right',
            marginBottom: '12px',
            lineHeight: '32px',
          }}>
            اللهم إني نويت أن أتقرب إليك بقرائة الوظيفة التجانية اللازمة في الطريقة التجانية إقتداء بسيد أحمد التجاني رضي اللّٰه عنه تعبدا للّه تعالى
          </p>
          <p style={{
            fontSize: '16px',
            color: '#BBE1D5',
            fontStyle: 'italic',
            marginBottom: '12px',
            lineHeight: '24px',
          }}>
            Allahumma nnii nawaytu an ataqarraba ilayka bi qiraa-atil wazeefati Tijaniyyah allaazimati fit-țareeqati Tijaniyyah iqtidaa-a bisayyidi Ahmad at-Tijani Radiyallahu anhu ta'abbudan lillahi ta'aalaa.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#E7F5F1',
            lineHeight: '24px',
            marginBottom: '12px',
          }}>
            O Allah, I intend to draw closer to You by reciting the obligatory Tijani Wazifa in the Tijani Tariqa, following our Master Ahmad al-Tijani, may Allah be pleased with him, as an act of devotion to Allah the Almighty.
          </p>
        </div>

        {/* Step 1: Auzubillah */}
        <WazifaStepCard
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
          useWhiteYellow={true}
        />

        {/* Step 2: Suratul Fatiha */}
        <WazifaStepCard
          stepNumber={2}
          title="Suratul Fatiha"
          arabic="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ (1) الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (2) الرَّحْمَٰنِ الرَّحِيمِ (3) مَالِكِ يَوْمِ الدِّينِ (4) إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (5) اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (6) صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ (7)"
          transliteration="Bismillahi ar-Rahman ar-Raheem (1) Alhamdulillahi rabbil alameen (2) Ar-Rahman ar-Raheem (3) Maliki yawmid-deen (4) Iyyaka na'budu wa iyyaka nasta'een (5) Ihdinas-siratal mustaqeem (6) Siratal-lazeena an'amta 'alayhim ghayril maghdoobi 'alayhim wa lad-dalleen (7)"
          english="In the name of Allah, the Entirely Merciful, the Especially Merciful. (1) [All] praise is [due] to Allah, Lord of the worlds. (2) The Entirely Merciful, the Especially Merciful. (3) Sovereign of the Day of Recompense. (4) It is You we worship and You we ask for help. (5) Guide us to the straight path. (6) The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray. (7)"
          count={1}
          onIncrement={() => {}}
          onDecrement={() => {}}
          onReset={() => {}}
          isCompleted={true}
          targetCount={1}
          useWhiteYellow={true}
        />

        {/* Step 3: Istighfar */}
        <WazifaStepCard
          stepNumber={3}
          title="Istighfar (30 times)"
          arabic="أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ"
          transliteration="Astaghfirullah Al 'Aziim alazii laa ilaaha illaa Huwal-Hayyul-Qayyoum"
          english="I ask forgiveness from ALLAH, The Great One, no God exists but Him, The Ever Living One, The Self Existing One"
          count={istighfarCount}
          onIncrement={() => setIstighfarCount(prev => Math.min(prev + 1, 30))}
          onDecrement={() => setIstighfarCount(prev => Math.max(prev - 1, 0))}
          onReset={() => setIstighfarCount(0)}
          isCompleted={isStepCompleted(istighfarCount, 30)}
          targetCount={30}
        />

        {/* After 30th Istighfar */}
        {isStepCompleted(istighfarCount, 30) && (
          <div className="card" style={{
            background: '#FFF8E1',
            borderLeft: '4px solid #E65100',
            marginBottom: '16px',
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#E65100',
              marginBottom: '12px',
            }}>
              After the 30th Istighfar:
            </h4>
            <p className="arabic-text" style={{
              fontSize: '16px',
              color: '#2E7D32',
              textAlign: 'right',
              marginBottom: '8px',
              lineHeight: '24px',
            }}>
              سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ وَسَلَامٌ عَلَى الْمُرْسَلِينَ وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </p>
            <p style={{
              fontSize: '14px',
              color: '#7B1FA2',
              fontStyle: 'italic',
              lineHeight: '20px',
            }}>
              "Glory be to your Lord, the Lord of Honor, far removed from what they describe. And peace be upon the messengers. And all praise is due to Allah, the Lord of the worlds."
            </p>
          </div>
        )}

        {/* Step 4: Salatil Fathi */}
        <WazifaStepCard
          stepNumber={4}
          title="Salatil Fathi (50 times)"
          arabic="اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَىٰ صِرَاطِكَ الْمُسْتَقِيمِ"
          transliteration="Allahumma salli 'ala Sayyidina Muhammadini l-Fatihi lima ughliq(a), wa l-khatimi lima sabaq(a), nasiri l-haqqi bi l-haqq(i), wa l-hadi ila siratika l-mustaqim(i)"
          english="O Allah, send prayers upon our master Muhammad, the opener of what was closed, and the seal of what had preceded, the helper of the truth by the Truth, and the guide to Your straight path"
          count={salatilFathiCount}
          onIncrement={() => setSalatilFathiCount(prev => Math.min(prev + 1, 50))}
          onDecrement={() => setSalatilFathiCount(prev => Math.max(prev - 1, 0))}
          onReset={() => setSalatilFathiCount(0)}
          isCompleted={isStepCompleted(salatilFathiCount, 50)}
          targetCount={50}
        />

        {/* After 50th Salatil Fathi */}
        {isStepCompleted(salatilFathiCount, 50) && (
          <div className="card" style={{
            background: '#FFF8E1',
            borderLeft: '4px solid #E65100',
            marginBottom: '16px',
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#E65100',
              marginBottom: '12px',
            }}>
              After the 50th Salatil Fathi:
            </h4>
            <p className="arabic-text" style={{
              fontSize: '16px',
              color: '#2E7D32',
              textAlign: 'right',
              marginBottom: '8px',
              lineHeight: '24px',
            }}>
              سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ وَسَلَامٌ عَلَى الْمُرْسَلِينَ وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </p>
            <p style={{
              fontSize: '14px',
              color: '#7B1FA2',
              fontStyle: 'italic',
              lineHeight: '20px',
            }}>
              "Glory be to your Lord, the Lord of Honor, far removed from what they describe. And peace be upon the messengers. And all praise is due to Allah, the Lord of the worlds."
            </p>
          </div>
        )}

        {/* Step 5: La Ilaha Illallah */}
        <WazifaStepCard
          stepNumber={5}
          title="La Ilaha Illallah (100 times)"
          arabic="لَا إِلَٰهَ إِلَّا اللَّهُ"
          transliteration="La ilaha illal-lah"
          english="There is no god but Allah"
          count={laIlahaCount}
          onIncrement={() => setLaIlahaCount(prev => Math.min(prev + 1, 100))}
          onDecrement={() => setLaIlahaCount(prev => Math.max(prev - 1, 0))}
          onReset={() => setLaIlahaCount(0)}
          isCompleted={isStepCompleted(laIlahaCount, 100)}
          targetCount={100}
        />

        {/* After 100th La Ilaha */}
        {isStepCompleted(laIlahaCount, 100) && (
          <div className="card" style={{
            background: '#FFF8E1',
            borderLeft: '4px solid #E65100',
            marginBottom: '16px',
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#E65100',
              marginBottom: '12px',
            }}>
              After the 100th La Ilaha Illallah:
            </h4>
            <p className="arabic-text" style={{
              fontSize: '16px',
              color: '#2E7D32',
              textAlign: 'right',
              marginBottom: '8px',
              lineHeight: '24px',
            }}>
              سَيِّدُنَا مُحَمَّدٌ رَسُولُ اللَّهِ عَلَيْهِ سَلَامُ اللَّهِ
            </p>
            <p style={{
              fontSize: '14px',
              color: '#7B1FA2',
              fontStyle: 'italic',
              lineHeight: '20px',
            }}>
              "Our master Muhammad is the Messenger of Allah, upon him be the peace of Allah"
            </p>
          </div>
        )}

        {/* Step 6: Jawharatul Kamal */}
        <WazifaStepCard
          stepNumber={6}
          title="Jawharatul Kamal (12 times)"
          arabic="اَللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ عَيْنِ الرَّحْمَةِ الرَّبَّانِيَّةِ وَالْيَاقُوتَةِ الْمُتَحَقِّقَةِ الْحَائِطَةِ بِمَرْكَزِ الْفُهُومِ والْمَعَانِي"
          transliteration="Allahumma salli wa sallim 'ala 'ayni r-rahmati r-rabbaniyyati wa l-yaqutati l-mutahaqqiqati l-ha'itati bi markazi l-fuhumi wa l-ma'ani"
          english="O Allah, send prayers and peace upon the eye of Divine Mercy and the realized ruby that encompasses the center of understandings and meanings"
          count={jawharatulKamalCount}
          onIncrement={() => setJawharatulKamalCount(prev => Math.min(prev + 1, 12))}
          onDecrement={() => setJawharatulKamalCount(prev => Math.max(prev - 1, 0))}
          onReset={() => setJawharatulKamalCount(0)}
          isCompleted={isStepCompleted(jawharatulKamalCount, 12)}
          targetCount={12}
        />

        {/* After 12th Jawharatul Kamal */}
        {isStepCompleted(jawharatulKamalCount, 12) && (
          <div className="card" style={{
            background: '#FFF8E1',
            borderLeft: '4px solid #E65100',
            marginBottom: '16px',
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#E65100',
              marginBottom: '12px',
            }}>
              After the 12th Jawharatul Kamal:
            </h4>
            <p className="arabic-text" style={{
              fontSize: '16px',
              color: '#2E7D32',
              textAlign: 'right',
              marginBottom: '8px',
              lineHeight: '24px',
            }}>
              إِنَّ اللَّهَ وَمَلَيِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ يَأَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا
            </p>
            <p style={{
              fontSize: '14px',
              color: '#7B1FA2',
              fontStyle: 'italic',
              lineHeight: '20px',
            }}>
              "Indeed, Allah and His angels send blessings upon the Prophet. O you who believe, send blessings upon him and greet him with peace."
            </p>
          </div>
        )}

        {/* Closing Dua Button */}
        {isStepCompleted(jawharatulKamalCount, 12) && (
          <button
            onClick={() => setShowClosingDua(true)}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: '25px',
              background: 'linear-gradient(135deg, #00BFA5 0%, #11C48D 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>📖</span>
            Read Closing Dua
          </button>
        )}

        {/* Reset All Button */}
        <button
          onClick={resetAllCounters}
          style={{
            width: '100%',
            padding: '12px 20px',
            borderRadius: '20px',
            background: 'transparent',
            border: '2px solid #00BFA5',
            color: '#00BFA5',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>↻</span>
          Reset All Counters
        </button>

        {/* Time Information */}
        <div className="card" style={{
          borderLeft: '4px solid #FFD54F',
          marginBottom: '16px',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '12px',
          }}>
            Time of Wazifa
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#BBE1D5',
            lineHeight: '24px',
            whiteSpace: 'pre-line',
          }}>
            • The Wazifa is to be performed once or twice a day{'\n'}
            • If performed twice daily: same time as Lazim{'\n'}
            • If performed once daily: from 'Asr Prayer to 'Asr Prayer of next day{'\n'}
            • Period of necessity extends to Maghrib Prayer of next day
          </p>
        </div>

        {/* Women's Guidelines */}
        <div className="card" style={{
          borderLeft: '4px solid #00BFA5',
          marginBottom: '20px',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '12px',
          }}>
            Guidelines for Women
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#BBE1D5',
            lineHeight: '24px',
            whiteSpace: 'pre-line',
          }}>
            • Women can attend the Wazeefa{'\n'}
            • Should not occupy the same room as men{'\n'}
            • If only one room available, sit at the back in discrete section{'\n'}
            • Must not recite aloud (as for the five daily Prayers)
          </p>
        </div>
      </div>

      {/* Closing Dua Modal */}
      {showClosingDua && (
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
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '20px',
            position: 'relative',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #114C45',
              paddingBottom: '16px',
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#E7F5F1',
                margin: 0,
              }}>
                Closing Dua
              </h2>
              <button
                onClick={() => setShowClosingDua(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#E7F5F1',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ color: '#E7F5F1' }}>
              <p className="arabic-text" style={{
                fontSize: '18px',
                textAlign: 'right',
                lineHeight: '32px',
                marginBottom: '20px',
              }}>
                دعاء ختم الوظيفة<br/><br/>
                اللّهُمَّ أَنْتَ الأَوَّلُ فَلَيْسَ قَبْلَكَ شَيئٌ وَأَنْتَ الآخِرُ فَلَيْسَ بَعْدَكَ شَيئُ وَأَنْتَ الظَّاهِرُ فَلَيسَ فَوْقَكَ شَيئٌ وَأَنتَ البَاطِنُ فَلَيسَ دُونَكَ شَيئٌ فَكُنْ لَنَا يَا أَوَّلُ يا آخرُ ياَظَاهِرُ  يا بَاطِنُ وَليًا وَنَصِيرَا أَنْتَ مَولَانَا فَنِعْمَ الْمَولَى وَنِعْمَ النَّصِيرُ الَّلهُمَّ إِنَا نَسْأَلُكَ بِفَاتِحِيَّةِ الْفَاتِحِ الْفَتْحَ التَّامَّ وَبِخَاتِمِيَّةِ الْخَاتِمِ حُسْنَ الْخِتَامِ الَّلهُمَ إِنَا نَسْأَلُكَ مِنَ الخَيرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ مَاعَلِمْنَا مِنْهُ وَمَالَم نَعْلَمْ وَنَعُوذُ بِكَ مِنَ شّرِ كلّهِ عاجلِهِ  وآجِالِه مَا عَلِمْنَا مِنْهُ وَمَالَمْ نَعٌلَمْ الَّلهُمَّ إِِنَّا نَسْأَلُكَ الْجَنَةَ وَمَاقرّبَ إلَيْهَا مِنْ قَولٍ وَعمَلٍ وَنَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْها مِنْ قَولٍ وَعَمَلٍ الَّلهُمَّ إِنَّا نَسْأَلُكَ الْعَفْو  ً وَالْعَافِيَةَ وَالْمُعَافَاةَ الدَّائِمَةَ فِي الدِّينِ وَالدُّنْيَا وَالْأٓخِرَة ِالَّلهُمَّ إِنَّا نَسْأَلُكَ رِضَاكَ وَرِضَى نَبِيِّكََ وَرِضَى الْأَشْيَاخِ وَرِضَى الْوَالِدَيْنِ الَّلهُمَّ اجْعَلْ مَا نُرِيدُ فِيمَا تُرِيْدُ الَّلهُمَّ اجْعَلْ فِي اخْتِيَارِكَ إخْتيارَناَ وَلَا تَجْعَلْ إِلَّا إِلَيْكَ اضْطِرَارَناَ<br/>
                يَاربّنا يَاخَالِقَ الْعَوَالِمِ - حُلْ بَيْنَنَا وَبَيْنَ كُلِّ ظَالِمِ<br/>
                واجْزِ لِكُلِّ مَنْ إِلَينَا أَحْسَنَا - وَجَازِهِ عَنَّا الجَزَاءَ الْأَحْسَنَا<br/>
                الَّلهُمَّ ارْفَعْ عَنَّا الْجَهْدَ وَالْجُوعَ وَالْعُرْيَ وَاكْشِفْ عَنَّا مِنَ الْبَلَاءِ مَا لَايَكْشِفُهُ غَيرُكَ رَبَّنَا ءَاتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ رَبَّنَا لَا تُؤاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأنَا رَبَّنَا وَلَا تَحْمِل عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الّذِينَ مِنْ قَبْلِنَا رَبَّنَا وَلَا تُحَمِلنَا مَالَاطَاقَةَ لَنَا بِهِ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا أَنْتَ مَولَانَا فَانْصُرنَا عَلَى الْقُومِ الكَافِرِينَ رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِِيمَانِ أَنْ آمِنُوا بِرَبِّكُمْ فَآمَنَّا رَبَّنَا فَاغْفِرْلَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِئَاتِنَا وَتَوَفَنَا مَعَ الْأَبْرَارِ رَبَّنَا وَآتِنَا مَاوَعَدْتَنَا عَلَى رُسُلِكَ وَلَا تُخْزِنَا يَومَ الْقِيَامَةِ إِنَّكَ لَا تُخٌلِفً الْمِيْعَادَ رَبَّنٰا ظَلَمْنٰا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَ مِنْ الْخَاسِرِيْنَ رَبَّنَا ءَاتِنَا مِنْ لَدُنْكَ رَحْمَةً وَ هَيِئْ لَنَا مِنْ أَمْرِنَا رَشَدَا رَبَنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِيَاتِنَا قُرةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِيْنَ إِِمَامَا الَّلهُمَّ اغْفِرْ لِحَيِنَا وَمَيِّتِنَا وَكَبِيرِنَا وَصَغِيْرِنَا وَذَكَرِنَا وَأُنٌثَانَا وَحُرِنَا وَعَبْدِنَا وحَاضِرِنَا وَغَائِبِنَا وَطَائِعِناَ وَعَاصِيْنَا
              </p>

              <div style={{
                background: 'rgba(46, 125, 50, 0.1)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
              }}>
                <h4 style={{ color: '#BBE1D5', marginBottom: '12px' }}>TRANSLITERATION</h4>
                <p style={{
                  fontSize: '16px',
                  color: '#BBE1D5',
                  fontStyle: 'italic',
                  lineHeight: '24px',
                }}>
                  Allâhumma antal awwalu fa laysa ablaka chay'un wa antal âkhiru fa laysa ba'daka chay'un wa antaz-zâhiru fa laysa fayqaka chay'un wa antal bâtinu fa laysa dünaka chay un. Fakun lana ya awwalu ya âqiru ya zâhiru ya bâtinu waliyyan wan-naçiran anta waliyuna fa ni'mal mawlâ wan-ni'man-naçiru. Allâhumma innâ nas'aluka bifâtihiyyatil fâtihi fathat-tâma wa bi khâtimiyatil khâtimi husnal khitâmi. Allâhumma innâ nas'alukal-khayra kullahû 'âjilahů wa âjilahû ma 'alimnâ minhu wa mâ lam na'lam, wa na'üdhu bika minach-charri kullihi 'ajilihi wa âjilihî ma 'alimnâ minhu wa mâ lam na'lam. Allâhumma innâ nas'alukal jannata wa mâ qarraba ilayha min qawlin wa 'amalin, wa na'üdhu bika minan-nâri wa mâ qarraba ilayha min qawlin wa 'amalin. Allâhumma innâ nas'alukal-'afwa wal 'âfiyata wal mu'âfâtad-dâ'imata fid-dîni wad-dunya wal-âkhirati. Allâhumma innâ nas'aluka ridâka wa ridâ nabiyyika sayyidina Muhammadin çallal-Lâhu 'alayhi was-sallam, wa ridâl-achyâkhi wa ridâl-walidayni. Allâhumma i'al mâ nuhibbu fi mâ tuhibbu wa tardâ. Allâhumma ij'al fi ikhtiyârika ikhtiyarana wa lâ taj'al illa ilayka idtirarana. Yâ rabbana yâ khâliqal-awâlimi hul baynana wa bayna kulli zalimi. Wajzi li kulli man ilaynâ ahsana wa jâzîhi 'annâ jazâ'al ahsanâ. Allâhumma irfa''annâl-jahda wal ju'a wal-'urya wakchif 'annâ minal balấ'i ma lâ yakchifuha ghayruka. Allâhumma farrij 'an ummati sayyidin Muhammadin çallal-Lâhu 'alayhi was-sallam. Rabban âtina fid-dunya hasanatan wa fil-âkhirati hasanatan waqina 'adhâban-nâri. Rabbana la tuwakhidhna in nasina aw akhta'nâ, rabbânâ wa lâ tahmil 'alayna içran kama hamaltahů 'alal-lazîna min qablina, rabbanâ wa lâ tuhammilnâ mâ la taqata lanâ bihi; wa'tu 'annâ waghfir lanâ warhamnâ anta mawlânâ fançurnâ'alal qawmil kâfirina. Rabbanâ lâ tuzigh qulûbanâ ba'da idh hadaytana wa hab lana min ladunka rahmatan innaka antal wahhab. Rabban innana sami'nâ munâdiyan yunâdi lil imâni an âminü bi rabbikum fa âmanna. Rabbanâ faghfir lana dhunûbanâ wa kafir 'anna sayyi'âtina wa tawaffanâ ma'al abrâri. Rabbanâ wa âtinâ mâ wa'adtan 'alâ rusulika wa lâ tukhzin waymal qiyâmati innâka la tukhliful mi ada. Rabbanâ zalamnâ anfusanâ wa in lam taghfir lan wa tarhamnâ la nakünana minal-khâsirina. Rabbanâ âtinâ min ladunka rahmatan wa hayyi' lanâ min amrinâ rachadan. Rabbanâ hab lanâ min azwâjina wa dhurriyyâtinâ qurrata a'yunin waj'alna lil muttaqina imâman. Allâhumma ighfir lihayyinâ wa mayyitinâ, wa kabîrinâ waç-çaghirinâ, wa dhakarinâ wa unsânâ, wa hurinâ wa 'abdinâ, wa hâdirinâ wa ghibinâ, wa tấ'i'inâ wa 'âsînâ. Amiin
                </p>
              </div>

              <div>
                <h4 style={{ color: '#BBE1D5', marginBottom: '12px' }}>ENGLISH TRANSLATION</h4>
                <p style={{
                  fontSize: '16px',
                  color: '#E7F5F1',
                  lineHeight: '24px',
                }}>
                  O, Allah! You are the First. There is nothing before You. And You are the Last. There is nothing after You. You are the Manifest. There is nothing above You. And You are the Hidden. There is nothing below You. Then be for us, o, First; o, Last; o, Apparent o, Hidden! a helping guardian. You are our Guardian and our Patron. And how excellent a Patron. How excellent a Helper. O, Allah! We ask You by the opening of the Opener a complete opening! And we ask You by the sealing of the Seal a good ending. O, Allah! We ask You for all good, the immediate and the delayed, that which we know and that which we do not know. And we seek refuge in You from all evil, the immediate and the delayed, that which we know and that which we do not know. O, Allah! We ask You for Paradise and words and deeds that draw one close to it. And we seek refuge in You from the Fire and words and deeds that draw one close to it. O, Allah! We ask You for perpetual pardon, well-being and freedom from affliction in the religion, this world and the Hereafter. O, Allah! We ask You for Your satisfaction, the satisfaction of Your Prophet, the satisfaction of our Shaykhs and the satisfaction of our parents. O, Allah! Cause that which we love to be among that which You love. O, Allah! Cause our choice to be among that which You choose. And do not make our destituteness for anyone except You. Our Lord! O, Creator of the Worlds, Separate between us and every oppressor, And reward on our behalf all those who treat us well, And give them on our behalf the best of rewards. O, Allah! Lift from us all strife, hunger and nakedness. And remove from us those afflictions that only You can remove. Our Lord! Give us good in this world and good in the Hereafter. And Save us from the punishment of the Fire. Our Lord! Do not seize us if we forget or commit mistakes. Our Lord! Do not place upon us a burden like the burdens You placed upon those who went before us. Our Lord! And do not place upon us a burden greater than we can bear. Pardon us, forgive us and have mercy on us. You are our Patron. So help us against the disbelieving people. Our Lord! Do not cause our hearts to deviate after You have guided us. And grant us from Yourself a mercy. Indeed, You are the One who Grants. Our Lord! We have heard a call calling to faith: "Believe in your Lord!" And we have believed, o, our Lord! So forgive us our sins and cover our faults. And cause us to die among the righteous. And, o, our Lord, grant us what You promised us through Your Messengers. And do not humiliate us on the Day of Judgement. Indeed, You never break Your promise. Our Lord! We have wrong ourselves and if You do not forgive us or have mercy on us, we will be among the losers. Our Lord! Grant us from Yourself a mercy. And prepare for us in our affair a good outcome. Our Lord! Grant us make our wives and children the coolness of our eyes and make us leaders of the God-fearing. O, Allah! Forgive those of us who are living and those passed away, the elders and the young, our males and females, those of us present and those who are absent, those who are free and those who are slaves, the obedient and the disobedient. Ameen thumma Ameen!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WazifaScreen;

