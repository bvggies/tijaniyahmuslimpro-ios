import React from 'react';
import './IslamicBackground.css';

interface IslamicBackgroundProps {
  children: React.ReactNode;
  opacity?: number;
}

const IslamicBackground: React.FC<IslamicBackgroundProps> = ({ children, opacity = 0.15 }) => {
  return (
    <div className="islamic-background-container">
      {/* Central Islamic Mandala */}
      <div className="islamic-background-mandala" style={{ opacity }}>
        <div className="mandala-outer"></div>
        <div className="mandala-middle"></div>
        <div className="mandala-inner"></div>
        <div className="mandala-center"></div>
      </div>

      {/* Corner Geometric Patterns */}
      <div className="corner-pattern corner-pattern-1" style={{ opacity }}>
        <div className="corner-shape corner-shape-1"></div>
        <div className="corner-shape corner-shape-2"></div>
        <div className="corner-shape corner-shape-3"></div>
      </div>

      <div className="corner-pattern corner-pattern-2" style={{ opacity }}>
        <div className="corner-shape corner-shape-4"></div>
        <div className="corner-shape corner-shape-5"></div>
        <div className="corner-shape corner-shape-6"></div>
      </div>

      <div className="corner-pattern corner-pattern-3" style={{ opacity }}>
        <div className="corner-shape corner-shape-7"></div>
        <div className="corner-shape corner-shape-8"></div>
        <div className="corner-shape corner-shape-9"></div>
      </div>

      <div className="corner-pattern corner-pattern-4" style={{ opacity }}>
        <div className="corner-shape corner-shape-10"></div>
        <div className="corner-shape corner-shape-11"></div>
        <div className="corner-shape corner-shape-12"></div>
      </div>

      {/* Floating Islamic Elements */}
      <div className="floating-elements" style={{ opacity }}>
        <div className="floating-circle floating-circle-1"></div>
        <div className="floating-circle floating-circle-2"></div>
        <div className="floating-circle floating-circle-3"></div>
        <div className="floating-circle floating-circle-4"></div>
        <div className="floating-circle floating-circle-5"></div>
        <div className="floating-circle floating-circle-6"></div>
      </div>

      {/* Content */}
      <div className="islamic-background-content">
        {children}
      </div>
    </div>
  );
};

export default IslamicBackground;

