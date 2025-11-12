import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UpgradePrompt from '../components/UpgradePrompt';
import IslamicBackground from '../components/IslamicBackground';
import { colors } from '../utils/theme';
import './LessonsScreen.css';

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
  content: {
    type: 'video' | 'text' | 'quiz' | 'audio';
    title: string;
    duration?: string;
  }[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  thumbnail: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
}

const LessonsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'lessons' | 'progress'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const courses: Course[] = [
    {
      id: '1',
      title: 'Quran Reading Basics',
      description: 'Learn to read the Holy Quran with proper pronunciation and tajweed rules',
      instructor: 'Shaykh Ahmad Tijani',
      totalLessons: 12,
      completedLessons: 0,
      progress: 0,
      thumbnail: '📖',
      category: 'Quran',
      level: 'Beginner',
      rating: 4.8,
      students: 1250,
    },
    {
      id: '2',
      title: 'Islamic Prayer Guide',
      description: 'Complete guide to performing Salah with proper postures and recitations',
      instructor: 'Imam Abdullah Maikano',
      totalLessons: 8,
      completedLessons: 0,
      progress: 0,
      thumbnail: '🕌',
      category: 'Prayer',
      level: 'Beginner',
      rating: 4.9,
      students: 2100,
    },
    {
      id: '3',
      title: 'Tijaniyya Tariqa',
      description: 'Understanding the spiritual path and practices of Tijaniyya',
      instructor: 'Shaykh Ibrahim Niasse',
      totalLessons: 15,
      completedLessons: 0,
      progress: 0,
      thumbnail: '🕊️',
      category: 'Spirituality',
      level: 'Intermediate',
      rating: 4.7,
      students: 890,
    },
    {
      id: '4',
      title: 'Islamic History',
      description: 'Journey through Islamic civilization and its contributions',
      instructor: 'Dr. Amina Hassan',
      totalLessons: 20,
      completedLessons: 0,
      progress: 0,
      thumbnail: '🏛️',
      category: 'History',
      level: 'Intermediate',
      rating: 4.6,
      students: 1560,
    },
    {
      id: '5',
      title: 'Arabic Language',
      description: 'Learn Arabic grammar, vocabulary, and conversation',
      instructor: 'Ustadh Muhammad Ali',
      totalLessons: 25,
      completedLessons: 0,
      progress: 0,
      thumbnail: '📚',
      category: 'Language',
      level: 'Beginner',
      rating: 4.5,
      students: 3200,
    },
    {
      id: '6',
      title: 'Fiqh Fundamentals',
      description: 'Understanding Islamic jurisprudence and legal principles',
      instructor: 'Qadi Ahmad Sukayrij',
      totalLessons: 18,
      completedLessons: 0,
      progress: 0,
      thumbnail: '⚖️',
      category: 'Fiqh',
      level: 'Advanced',
      rating: 4.8,
      students: 750,
    },
  ];

  const lessons: Lesson[] = [
    {
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
        { type: 'video', title: 'Arabic Alphabet Introduction', duration: '8 min' },
        { type: 'text', title: 'Letter Recognition Guide' },
        { type: 'quiz', title: 'Alphabet Quiz' },
      ],
    },
    {
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
        { type: 'video', title: 'Short Vowels Introduction', duration: '10 min' },
        { type: 'text', title: 'Vowel Recognition Guide' },
        { type: 'quiz', title: 'Vowels Quiz' },
      ],
    },
    {
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
        { type: 'video', title: 'Double Vowels Introduction', duration: '8 min' },
        { type: 'text', title: 'Tanween Guide' },
        { type: 'quiz', title: 'Tanween Quiz' },
      ],
    },
    {
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
        { type: 'video', title: 'Fathatain Introduction', duration: '6 min' },
        { type: 'text', title: 'Fathatain Usage Guide' },
        { type: 'quiz', title: 'Fathatain Quiz' },
      ],
    },
    {
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
        { type: 'video', title: 'Kasratain Introduction', duration: '6 min' },
        { type: 'text', title: 'Kasratain Usage Guide' },
        { type: 'quiz', title: 'Kasratain Quiz' },
      ],
    },
    {
      id: 'basic-tajweed',
      title: 'Basic Tajweed Rules',
      description: 'Essential rules for proper Quran recitation',
      category: 'Quran',
      duration: '20 min',
      level: 'Beginner',
      progress: 0,
      isCompleted: false,
      isLocked: true,
      thumbnail: '🎵',
      content: [
        { type: 'video', title: 'Tajweed Basics', duration: '12 min' },
        { type: 'audio', title: 'Practice Recitation', duration: '5 min' },
        { type: 'quiz', title: 'Tajweed Test' },
      ],
    },
    {
      id: 'wudu',
      title: 'Wudu (Ablution)',
      description: 'Step-by-step guide to performing ablution',
      category: 'Prayer',
      duration: '12 min',
      level: 'Beginner',
      progress: 0,
      isCompleted: false,
      isLocked: false,
      thumbnail: '💧',
      content: [
        { type: 'video', title: 'Wudu Demonstration', duration: '8 min' },
        { type: 'text', title: 'Wudu Steps Guide' },
        { type: 'quiz', title: 'Wudu Knowledge Check' },
      ],
    },
  ];

  const handleCoursePress = (course: Course) => {
    if (authState.isGuest) {
      setShowUpgradePrompt(true);
      return;
    }
    setSelectedCourse(course);
    // Navigate to course details or start course
  };

  const handleLessonPress = (lesson: Lesson) => {
    if (authState.isGuest) {
      setShowUpgradePrompt(true);
      return;
    }
    if (lesson.isLocked) {
      window.alert('Lesson Locked\nComplete previous lessons to unlock this one.');
      return;
    }
    navigate(`/lesson/${lesson.id}`);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCourseCard = (course: Course) => (
    <div
      key={course.id}
      className="lessons-course-card"
      onClick={() => handleCoursePress(course)}
    >
      <div className="lessons-course-gradient">
        <div className="lessons-course-header">
          <span className="lessons-course-thumbnail">{course.thumbnail}</span>
          <div className="lessons-course-info">
            <h3 className="lessons-course-title">{course.title}</h3>
            <p className="lessons-course-instructor">by {course.instructor}</p>
            <p className="lessons-course-description">{course.description}</p>
          </div>
        </div>
        
        <div className="lessons-course-stats">
          <div className="lessons-stat-item">
            <span>📖</span>
            <span>{course.totalLessons} lessons</span>
          </div>
          <div className="lessons-stat-item">
            <span>⭐</span>
            <span>{course.rating}</span>
          </div>
          <div className="lessons-stat-item">
            <span>👥</span>
            <span>{course.students}</span>
          </div>
        </div>

        <div className="lessons-course-footer">
          <div className="lessons-level-badge">
            <span>{course.level}</span>
          </div>
          <div className="lessons-category-badge">
            <span>{course.category}</span>
          </div>
        </div>

        {course.progress > 0 && (
          <div className="lessons-progress-container">
            <div className="lessons-progress-bar">
              <div className="lessons-progress-fill" style={{ width: `${course.progress}%` }}></div>
            </div>
            <p className="lessons-progress-text">{course.progress}% Complete</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLessonCard = (lesson: Lesson) => (
    <div
      key={lesson.id}
      className={`lessons-lesson-card ${lesson.isLocked ? 'lessons-locked-card' : ''}`}
      onClick={() => handleLessonPress(lesson)}
    >
      <div className="lessons-lesson-header">
        <span className="lessons-lesson-thumbnail">{lesson.thumbnail}</span>
        <div className="lessons-lesson-info">
          <h3 className="lessons-lesson-title">{lesson.title}</h3>
          <p className="lessons-lesson-description">{lesson.description}</p>
          <div className="lessons-lesson-meta">
            <span className="lessons-lesson-duration">{lesson.duration}</span>
            <span className="lessons-lesson-level">{lesson.level}</span>
          </div>
        </div>
        <div className="lessons-lesson-status">
          {lesson.isCompleted ? (
            <span>✓</span>
          ) : lesson.isLocked ? (
            <span>🔒</span>
          ) : (
            <span>▶</span>
          )}
        </div>
      </div>

      {lesson.progress > 0 && (
        <div className="lessons-lesson-progress">
          <div className="lessons-progress-bar">
            <div className="lessons-progress-fill" style={{ width: `${lesson.progress}%` }}></div>
          </div>
          <span className="lessons-progress-text">{lesson.progress}%</span>
        </div>
      )}
    </div>
  );

  return (
    <IslamicBackground opacity={1.0}>
      <div className="lessons-container">
        {/* Header */}
        <div className="lessons-header">
          <h1 className="lessons-header-title">Islamic Lessons</h1>
          <p className="lessons-header-subtitle">Learn and grow in your Islamic knowledge</p>
        </div>

        {/* Search Bar */}
        <div className="lessons-search-container">
          <div className="lessons-search-bar">
            <span>🔍</span>
            <input
              type="text"
              className="lessons-search-input"
              placeholder="Search courses and lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="lessons-tab-container">
          <button
            className={`lessons-tab ${activeTab === 'courses' ? 'lessons-active-tab' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button
            className={`lessons-tab ${activeTab === 'lessons' ? 'lessons-active-tab' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            Lessons
          </button>
          <button
            className={`lessons-tab ${activeTab === 'progress' ? 'lessons-active-tab' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Progress
          </button>
        </div>

        {/* Content */}
        <div className="lessons-content">
          {activeTab === 'courses' && (
            <div className="lessons-courses-container">
              {filteredCourses.map(renderCourseCard)}
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="lessons-lessons-container">
              {filteredLessons.map(renderLessonCard)}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="lessons-progress-tab-container">
              <div className="lessons-progress-card">
                <h2 className="lessons-progress-title">Learning Progress</h2>
                <div className="lessons-progress-stats">
                  <div className="lessons-progress-stat">
                    <span className="lessons-progress-stat-number">0</span>
                    <span className="lessons-progress-stat-label">Courses Completed</span>
                  </div>
                  <div className="lessons-progress-stat">
                    <span className="lessons-progress-stat-number">0</span>
                    <span className="lessons-progress-stat-label">Lessons Completed</span>
                  </div>
                  <div className="lessons-progress-stat">
                    <span className="lessons-progress-stat-number">0h</span>
                    <span className="lessons-progress-stat-label">Study Time</span>
                  </div>
                </div>
              </div>

              <div className="lessons-achievements-card">
                <h2 className="lessons-achievements-title">Achievements</h2>
                <div className="lessons-achievement-item">
                  <span>🏆</span>
                  <span className="lessons-achievement-text">First Lesson</span>
                  <span className="lessons-achievement-status">Locked</span>
                </div>
                <div className="lessons-achievement-item">
                  <span>🥇</span>
                  <span className="lessons-achievement-text">Course Completion</span>
                  <span className="lessons-achievement-status">Locked</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade Prompt */}
        {showUpgradePrompt && (
          <UpgradePrompt
            visible={showUpgradePrompt}
            onClose={() => setShowUpgradePrompt(false)}
            onSignUp={() => {
              setShowUpgradePrompt(false);
              navigate('/register');
            }}
            onSignIn={() => {
              setShowUpgradePrompt(false);
              navigate('/login');
            }}
            feature="Islamic Lessons"
          />
        )}
      </div>
    </IslamicBackground>
  );
};

export default LessonsScreen;

