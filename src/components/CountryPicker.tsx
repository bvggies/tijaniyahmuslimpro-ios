import React, { useState } from 'react';
import { sortedCountries, Country } from '../data/countries';
import { colors } from '../utils/theme';

interface CountryPickerProps {
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
  placeholder?: string;
}

const CountryPicker: React.FC<CountryPickerProps> = ({
  selectedCountry,
  onCountrySelect,
  placeholder = 'Select Country',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = sortedCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCountryData = sortedCountries.find(
    (country) => country.name === selectedCountry
  );

  const handleCountrySelect = (country: Country) => {
    onCountrySelect(country.name);
    setIsVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      <div
        onClick={() => setIsVisible(true)}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        {selectedCountryData ? (
          <>
            <span style={{ fontSize: '20px', marginRight: '12px' }}>
              {selectedCountryData.flag}
            </span>
            <span
              style={{
                flex: 1,
                fontSize: '16px',
                color: colors.textPrimary,
                fontWeight: '500',
              }}
            >
              {selectedCountryData.name}
            </span>
          </>
        ) : (
          <span
            style={{
              flex: 1,
              fontSize: '16px',
              color: colors.textSecondary,
            }}
          >
            {placeholder}
          </span>
        )}
        <span style={{ fontSize: '16px', color: colors.textSecondary }}>▼</span>
      </div>

      {isVisible && (
        <div
          style={{
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
          }}
          onClick={() => setIsVisible(false)}
        >
          <div
            style={{
              background: colors.background,
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                borderBottom: `1px solid ${colors.divider}`,
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: colors.textPrimary,
                  margin: 0,
                }}
              >
                Select Country
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.textPrimary,
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: 0,
                  width: '32px',
                  height: '32px',
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${colors.divider}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: colors.surface,
                  borderRadius: '12px',
                  border: `1px solid ${colors.divider}`,
                  padding: '12px 16px',
                }}
              >
                <span style={{ fontSize: '20px', marginRight: '12px', color: colors.textSecondary }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    color: colors.textPrimary,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 20px 20px',
              }}
            >
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 4px',
                    borderBottom: `1px solid ${colors.divider}`,
                    cursor: 'pointer',
                    background:
                      selectedCountry === country.name
                        ? `${colors.accentTeal}10`
                        : 'transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCountry !== country.name) {
                      e.currentTarget.style.background = colors.surface;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCountry !== country.name) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '20px', marginRight: '12px' }}>
                    {country.flag}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: '16px',
                      color:
                        selectedCountry === country.name
                          ? colors.accentTeal
                          : colors.textPrimary,
                      fontWeight: selectedCountry === country.name ? '600' : 'normal',
                    }}
                  >
                    {country.name}
                  </span>
                  {selectedCountry === country.name && (
                    <span style={{ color: colors.accentTeal, fontSize: '20px' }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CountryPicker;

