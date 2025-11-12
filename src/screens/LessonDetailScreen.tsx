import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UpgradePrompt from '../components/UpgradePrompt';
import IslamicBackground from '../components/IslamicBackground';
import { colors } from '../utils/theme';
import './LessonDetailScreen.css';

interface LessonContent {
  id: string;
  type: 'text' | 'image' | 'example' | 'practice' | 'quiz';
  title?: string;
  content: string;
  arabicText?: string;
  transliteration?: string;
  translation?: string;
  imageUrl?: string;
  examples?: string[];
  practiceQuestions?: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  isCompleted: boolean;
  isLocked: boolean;
  thumbnail: string;
  content: LessonContent[];
}

const LessonDetailScreen: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (lessonId) {
      const lessonData = getLessonData(lessonId);
      setLesson(lessonData);
    }
  }, [lessonId]);

  const getLessonData = (id: string): Lesson => {
    const lessons: { [key: string]: Lesson } = {
      'arabic-alphabet': {
        id: 'arabic-alphabet',
        title: 'Arabic Alphabet Names',
        description: 'Learn the names and pronunciation of all 28 Arabic letters',
        category: 'Arabic Language',
        duration: '25 min',
        level: 'Beginner',
        progress: 0,
        isCompleted: false,
        isLocked: false,
        thumbnail: '🔤',
        content: [
          {
            id: 'intro',
            type: 'text',
            content: 'Welcome to the Arabic Alphabet! The Arabic alphabet consists of 28 letters, and each letter has a name. Learning the names of the letters is the first step in mastering Arabic reading and writing.',
          },
          {
            id: 'alphabet-chart',
            type: 'text',
            title: 'Arabic Alphabet Chart',
            content: 'Here is the complete Arabic alphabet with all 28 letters:\n\nأ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي\n\nEach letter has a specific name and sound. Let\'s learn them one by one.',
          },
          {
            id: 'letter-names',
            type: 'example',
            title: 'Letter Names and Pronunciation',
            content: 'Each Arabic letter has a specific name. Here are the names of all 28 letters:',
            examples: [
              'أ (Alif) - First letter of the alphabet',
              'ب (Ba) - Like "b" in "book"',
              'ت (Ta) - Like "t" in "table"',
              'ث (Tha) - Like "th" in "think"',
              'ج (Jim) - Like "j" in "jump"',
              'ح (Ha) - Harsh "h" sound',
              'خ (Kha) - Like "ch" in "Bach"',
              'د (Dal) - Like "d" in "door"',
              'ذ (Dhal) - Like "th" in "that"',
              'ر (Ra) - Like "r" in "red"',
              'ز (Zay) - Like "z" in "zebra"',
              'س (Seen) - Like "s" in "sun"',
              'ش (Sheen) - Like "sh" in "ship"',
              'ص (Sad) - Emphatic "s" sound',
              'ض (Dad) - Emphatic "d" sound',
              'ط (Ta) - Emphatic "t" sound',
              'ظ (Za) - Emphatic "z" sound',
              'ع (Ayn) - Guttural sound',
              'غ (Ghayn) - Like French "r"',
              'ف (Fa) - Like "f" in "fish"',
              'ق (Qaf) - Deep "k" sound',
              'ك (Kaf) - Like "k" in "key"',
              'ل (Lam) - Like "l" in "love"',
              'م (Meem) - Like "m" in "mother"',
              'ن (Noon) - Like "n" in "nose"',
              'ه (Ha) - Like "h" in "house"',
              'و (Waw) - Like "w" in "water"',
              'ي (Ya) - Like "y" in "yes"',
            ],
          },
          {
            id: 'examples',
            type: 'example',
            title: 'Letter Examples',
            content: 'Let\'s practice with some examples:',
            examples: [
              'أ (Alif) - like "a" in "apple"',
              'ب (Ba) - like "b" in "book"',
              'ت (Ta) - like "t" in "table"',
              'ث (Tha) - like "th" in "think"',
              'ج (Jim) - like "j" in "jump"',
            ],
          },
          {
            id: 'practice',
            type: 'practice',
            title: 'Practice Exercise',
            content: 'Match the Arabic letter with its name:',
            practiceQuestions: [
              {
                question: 'What is the name of the letter أ?',
                options: ['Alif', 'Ba', 'Ta', 'Tha'],
                correct: 0,
              },
              {
                question: 'What is the name of the letter ب?',
                options: ['Alif', 'Ba', 'Ta', 'Tha'],
                correct: 1,
              },
            ],
          },
        ],
      },
      'short-vowels': {
        id: 'short-vowels',
        title: 'Arabic Short Vowels',
        description: 'Learn the three short vowels: Fatha, Kasra, and Damma',
        category: 'Arabic Language',
        duration: '20 min',
        level: 'Beginner',
        progress: 0,
        isCompleted: false,
        isLocked: false,
        thumbnail: '🔤',
        content: [
          {
            id: 'intro',
            type: 'text',
            content: 'Arabic short vowels are essential for proper pronunciation. There are three main short vowels: Fatha, Kasra, and Damma. These vowels are written as small marks above or below the letters.',
          },
          {
            id: 'fatha',
            type: 'example',
            title: 'Fatha (َ) - Short "a" Sound',
            content: 'Fatha is a short "a" sound, written as a small diagonal line above the letter. It sounds like the "a" in "cat" or "bat".',
            examples: [
              'بَ (ba) - "ba" sound like in "bat"',
              'تَ (ta) - "ta" sound like in "cat"',
              'جَ (ja) - "ja" sound like in "jam"',
              'دَ (da) - "da" sound like in "dad"',
              'كَ (ka) - "ka" sound like in "cat"',
            ],
          },
          {
            id: 'kasra',
            type: 'example',
            title: 'Kasra (ِ) - Short "i" Sound',
            content: 'Kasra is a short "i" sound, written as a small diagonal line below the letter. It sounds like the "i" in "bit" or "sit".',
            examples: [
              'بِ (bi) - "bi" sound like in "bit"',
              'تِ (ti) - "ti" sound like in "sit"',
              'جِ (ji) - "ji" sound like in "gym"',
              'دِ (di) - "di" sound like in "did"',
              'كِ (ki) - "ki" sound like in "kit"',
            ],
          },
          {
            id: 'damma',
            type: 'example',
            title: 'Damma (ُ) - Short "u" Sound',
            content: 'Damma is a short "u" sound, written as a small "w" shape above the letter. It sounds like the "u" in "put" or "book".',
            examples: [
              'بُ (bu) - "bu" sound like in "book"',
              'تُ (tu) - "tu" sound like in "put"',
              'جُ (ju) - "ju" sound like in "jug"',
              'دُ (du) - "du" sound like in "dude"',
              'كُ (ku) - "ku" sound like in "cook"',
            ],
          },
          {
            id: 'practice',
            type: 'practice',
            title: 'Practice Exercise',
            content: 'Identify the vowel sound:',
            practiceQuestions: [
              {
                question: 'What sound does بَ make?',
                options: ['ba', 'bi', 'bu', 'be'],
                correct: 0,
              },
              {
                question: 'What sound does بِ make?',
                options: ['ba', 'bi', 'bu', 'be'],
                correct: 1,
              },
            ],
          },
        ],
      },
      'double-vowels': {
        id: 'double-vowels',
        title: 'The Double Vowel-Marks',
        description: 'Learn about Tanween: Fathatain, Kasratain, and Dammatain',
        category: 'Arabic Language',
        duration: '18 min',
        level: 'Beginner',
        progress: 0,
        isCompleted: false,
        isLocked: false,
        thumbnail: '🔤',
        content: [
          {
            id: 'intro',
            type: 'text',
            content: 'Double vowel marks (Tanween) are used to indicate indefinite nouns in Arabic. There are three types: Fathatain, Kasratain, and Dammatain.',
          },
          {
            id: 'fathatain',
            type: 'example',
            title: 'Fathatain (ً)',
            content: 'Fathatain indicates an indefinite noun with "an" sound, written as two Fatha marks.',
            examples: [
              'بَيْتاً (baytan) - "a house"',
              'كِتَاباً (kitaban) - "a book"',
              'قَلَماً (qalaman) - "a pen"',
            ],
          },
          {
            id: 'kasratain',
            type: 'example',
            title: 'Kasratain (ٍ)',
            content: 'Kasratain indicates an indefinite noun with "in" sound, written as two Kasra marks.',
            examples: [
              'بَيْتٍ (baytin) - "a house" (in genitive)',
              'كِتَابٍ (kitabin) - "a book" (in genitive)',
              'قَلَمٍ (qalamin) - "a pen" (in genitive)',
            ],
          },
          {
            id: 'dammatain',
            type: 'example',
            title: 'Dammatain (ٌ)',
            content: 'Dammatain indicates an indefinite noun with "un" sound, written as two Damma marks.',
            examples: [
              'بَيْتٌ (baytun) - "a house" (in nominative)',
              'كِتَابٌ (kitabun) - "a book" (in nominative)',
              'قَلَمٌ (qalamun) - "a pen" (in nominative)',
            ],
          },
          {
            id: 'practice',
            type: 'practice',
            title: 'Practice Exercise',
            content: 'Identify the Tanween type:',
            practiceQuestions: [
              {
                question: 'What type of Tanween is in كِتَاباً?',
                options: ['Fathatain', 'Kasratain', 'Dammatain', 'None'],
                correct: 0,
              },
              {
                question: 'What type of Tanween is in كِتَابٌ?',
                options: ['Fathatain', 'Kasratain', 'Dammatain', 'None'],
                correct: 2,
              },
            ],
          },
        ],
      },
      'fathatain': {
        id: 'fathatain',
        title: 'Short Vowel Marks - Fathatain',
        description: 'Detailed study of Fathatain and its usage',
        category: 'Arabic Language',
        duration: '15 min',
        level: 'Beginner',
        progress: 0,
        isCompleted: false,
        isLocked: false,
        thumbnail: '🔤',
        content: [
          {
            id: 'intro',
            type: 'text',
            content: 'Fathatain (ً) is one of the three Tanween marks in Arabic. It consists of two Fatha marks and indicates an indefinite noun in the accusative case.',
          },
          {
            id: 'usage',
            type: 'text',
            title: 'When to Use Fathatain',
            content: 'Fathatain is used when:\n• The noun is indefinite (not specific)\n• The noun is in the accusative case (object of a verb)\n• The noun is the object of a preposition',
          },
          {
            id: 'examples',
            type: 'example',
            title: 'Examples with Fathatain',
            content: 'Here are more examples of Fathatain usage:',
            examples: [
              'رَأَيْتُ بَيْتاً (ra\'aytu baytan) - "I saw a house"',
              'قَرَأْتُ كِتَاباً (qara\'tu kitaban) - "I read a book"',
              'كَتَبْتُ رِسَالَةً (katabtu risalatan) - "I wrote a letter"',
            ],
          },
          {
            id: 'practice',
            type: 'practice',
            title: 'Practice Exercise',
            content: 'Complete the sentence with Fathatain:',
            practiceQuestions: [
              {
                question: 'رَأَيْتُ _____ (I saw a car)',
                options: ['سَيَّارَةً', 'سَيَّارَةٌ', 'سَيَّارَةٍ', 'سَيَّارَةْ'],
                correct: 0,
              },
            ],
          },
        ],
      },
      'kasratain': {
        id: 'kasratain',
        title: 'Short Vowel Marks - Kasratain',
        description: 'Detailed study of Kasratain and its usage',
        category: 'Arabic Language',
        duration: '15 min',
        level: 'Beginner',
        progress: 0,
        isCompleted: false,
        isLocked: false,
        thumbnail: '🔤',
        content: [
          {
            id: 'intro',
            type: 'text',
            content: 'Kasratain (ٍ) is one of the three Tanween marks in Arabic. It consists of two Kasra marks and indicates an indefinite noun in the genitive case.',
          },
          {
            id: 'usage',
            type: 'text',
            title: 'When to Use Kasratain',
            content: 'Kasratain is used when:\n• The noun is indefinite (not specific)\n• The noun is in the genitive case (after prepositions)\n• The noun is part of an idafa construction',
          },
          {
            id: 'examples',
            type: 'example',
            title: 'Examples with Kasratain',
            content: 'Here are more examples of Kasratain usage:',
            examples: [
              'فِي بَيْتٍ (fi baytin) - "in a house"',
              'مِنْ كِتَابٍ (min kitabin) - "from a book"',
              'إِلَى مَدْرَسَةٍ (ila madrasatin) - "to a school"',
            ],
          },
          {
            id: 'practice',
            type: 'practice',
            title: 'Practice Exercise',
            content: 'Complete the sentence with Kasratain:',
            practiceQuestions: [
              {
                question: 'فِي _____ (in a car)',
                options: ['سَيَّارَةً', 'سَيَّارَةٌ', 'سَيَّارَةٍ', 'سَيَّارَةْ'],
                correct: 2,
              },
            ],
          },
        ],
      },
    };

    return lessons[id] || lessons['arabic-alphabet'];
  };

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const checkAnswers = () => {
    if (!lesson) return;
    
    const currentContent = lesson.content[currentContentIndex];
    if (currentContent.type !== 'practice') return;

    let correct = 0;
    const total = currentContent.practiceQuestions?.length || 0;
    
    currentContent.practiceQuestions?.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correct++;
      }
    });

    const percentage = Math.round((correct / total) * 100);
    
    window.alert(`Quiz Results\n\nYou got ${correct} out of ${total} correct (${percentage}%)`);
  };

  const renderContent = (content: LessonContent) => {
    switch (content.type) {
      case 'text':
        return (
          <div className="lesson-detail-content-card">
            <p className="lesson-detail-content-text" style={{ whiteSpace: 'pre-line' }}>{content.content}</p>
          </div>
        );

      case 'image':
        return (
          <div className="lesson-detail-content-card">
            {content.title && <h3 className="lesson-detail-content-title">{content.title}</h3>}
            <p className="lesson-detail-content-text">{content.content}</p>
            {content.imageUrl && (
              <div className="lesson-detail-image-container">
                <img src={content.imageUrl} alt={content.title} className="lesson-detail-image" />
              </div>
            )}
          </div>
        );

      case 'example':
        return (
          <div className="lesson-detail-content-card">
            {content.title && <h3 className="lesson-detail-content-title">{content.title}</h3>}
            <p className="lesson-detail-content-text">{content.content}</p>
            {content.examples?.map((example, index) => (
              <div key={index} className="lesson-detail-example-item">
                <p className="lesson-detail-example-text">{example}</p>
              </div>
            ))}
          </div>
        );

      case 'practice':
        return (
          <div className="lesson-detail-content-card">
            {content.title && <h3 className="lesson-detail-content-title">{content.title}</h3>}
            <p className="lesson-detail-content-text">{content.content}</p>
            {content.practiceQuestions?.map((question, qIndex) => (
              <div key={qIndex} className="lesson-detail-question-container">
                <p className="lesson-detail-question-text">{question.question}</p>
                {question.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    className={`lesson-detail-option-button ${userAnswers[qIndex] === oIndex ? 'lesson-detail-selected-option' : ''}`}
                    onClick={() => handleAnswer(qIndex, oIndex)}
                  >
                    <span className={userAnswers[qIndex] === oIndex ? 'lesson-detail-selected-option-text' : ''}>
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            ))}
            <button className="lesson-detail-check-button" onClick={checkAnswers}>
              Check Answers
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!lesson) {
    return (
      <div className="lesson-detail-loading-container">
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (authState.isGuest) {
    return (
      <div className="lesson-detail-container">
        <UpgradePrompt
          visible={true}
          onClose={() => navigate(-1)}
          onSignUp={() => navigate('/register')}
          onSignIn={() => navigate('/login')}
          feature="Lesson Details"
        />
      </div>
    );
  }

  return (
    <IslamicBackground opacity={1.0}>
      <div className="lesson-detail-container">
        {/* Header */}
        <div className="lesson-detail-header">
          <button className="lesson-detail-back-button" onClick={() => navigate(-1)}>
            <span>←</span>
          </button>
          <div className="lesson-detail-header-content">
            <h1 className="lesson-detail-header-title">{lesson.title}</h1>
            <p className="lesson-detail-header-subtitle">{lesson.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="lesson-detail-progress-container">
          <div className="lesson-detail-progress-bar">
            <div
              className="lesson-detail-progress-fill"
              style={{ width: `${((currentContentIndex + 1) / lesson.content.length) * 100}%` }}
            ></div>
          </div>
          <p className="lesson-detail-progress-text">
            {currentContentIndex + 1} of {lesson.content.length}
          </p>
        </div>

        {/* Content */}
        <div className="lesson-detail-content">
          {renderContent(lesson.content[currentContentIndex])}
        </div>

        {/* Navigation */}
        <div className="lesson-detail-navigation-container">
          <button
            className={`lesson-detail-nav-button ${currentContentIndex === 0 ? 'lesson-detail-disabled-button' : ''}`}
            onClick={() => setCurrentContentIndex(Math.max(0, currentContentIndex - 1))}
            disabled={currentContentIndex === 0}
          >
            <span>←</span>
            <span>Previous</span>
          </button>

          <button
            className={`lesson-detail-nav-button ${currentContentIndex === lesson.content.length - 1 ? 'lesson-detail-disabled-button' : ''}`}
            onClick={() => setCurrentContentIndex(Math.min(lesson.content.length - 1, currentContentIndex + 1))}
            disabled={currentContentIndex === lesson.content.length - 1}
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </IslamicBackground>
  );
};

export default LessonDetailScreen;

