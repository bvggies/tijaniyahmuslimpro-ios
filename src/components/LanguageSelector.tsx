import React, { useState } from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import './LanguageSelector.css';

interface LanguageSelectorProps {
  style?: React.CSSProperties;
  compact?: boolean;
}

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ style, compact = false }) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = languageOptions.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setModalVisible(false);
  };

  if (compact) {
    return (
      <div className="language-selector-compact" style={style}>
        <button
          className="language-selector-compact-button"
          onClick={() => setModalVisible(true)}
          aria-label="Change language"
        >
          <span className="language-selector-compact-flag">{currentLanguage?.flag}</span>
        </button>

        {modalVisible && (
          <div className="language-selector-modal-overlay" onClick={() => setModalVisible(false)}>
            <div 
              className={`language-selector-modal ${isRTL ? 'rtl' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="language-selector-modal-header">
                <button
                  className="language-selector-close-button"
                  onClick={() => setModalVisible(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
                <h2 className="language-selector-modal-title">{t('settings.language')}</h2>
                <div className="language-selector-placeholder" />
              </div>

              <div className="language-selector-list">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    className={`language-selector-option ${
                      option.code === language ? 'selected' : ''
                    }`}
                    onClick={() => handleLanguageChange(option.code)}
                  >
                    <div className="language-selector-info">
                      <span className="language-selector-flag">{option.flag}</span>
                      <div className="language-selector-text">
                        <div className={`language-selector-name ${
                          option.code === language ? 'selected' : ''
                        }`}>
                          {option.nativeName}
                        </div>
                        <div className={`language-selector-code ${
                          option.code === language ? 'selected' : ''
                        }`}>
                          {option.name}
                        </div>
                      </div>
                    </div>
                    {option.code === language && (
                      <span className="language-selector-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="language-selector-container" style={style}>
      <button
        className="language-selector-button"
        onClick={() => setModalVisible(true)}
      >
        <div className="language-selector-content">
          <span className="language-selector-flag">{currentLanguage?.flag}</span>
          <div className="language-selector-text">
            <div className="language-selector-title">{t('settings.language')}</div>
            <div className="language-selector-subtitle">
              {currentLanguage?.nativeName}
            </div>
          </div>
          <span className="language-selector-chevron">›</span>
        </div>
      </button>

      {modalVisible && (
        <div className="language-selector-modal-overlay" onClick={() => setModalVisible(false)}>
          <div 
            className={`language-selector-modal ${isRTL ? 'rtl' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="language-selector-modal-header">
              <button
                className="language-selector-close-button"
                onClick={() => setModalVisible(false)}
                aria-label="Close"
              >
                ✕
              </button>
              <h2 className="language-selector-modal-title">{t('settings.language')}</h2>
              <div className="language-selector-placeholder" />
            </div>

            <div className="language-selector-list">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  className={`language-selector-option ${
                    option.code === language ? 'selected' : ''
                  }`}
                  onClick={() => handleLanguageChange(option.code)}
                >
                  <div className="language-selector-info">
                    <span className="language-selector-flag">{option.flag}</span>
                    <div className="language-selector-text">
                      <div className={`language-selector-name ${
                        option.code === language ? 'selected' : ''
                      }`}>
                        {option.nativeName}
                      </div>
                      <div className={`language-selector-code ${
                        option.code === language ? 'selected' : ''
                      }`}>
                        {option.name}
                      </div>
                    </div>
                  </div>
                  {option.code === language && (
                    <span className="language-selector-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

