// src/components/ConfidenceSlider.tsx
import React, { useRef, useEffect } from 'react';
import { ConfidenceSliderProps } from '../core/domain/UI';
import '../styles/ConfidenceSlider.css';

// A slider component that implements confidence-based scoring
export default function ConfidenceSlider({ value, onChange, disabled = false }: ConfidenceSliderProps) {
  const sliderRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.classList.add('slider-pulse');
      
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.classList.remove('slider-pulse');
        }
      }, 500);
    }
  }, [value]);
  
  const getConfidenceText = (): string => {
    if (value < 33) return 'Not sure';
    if (value < 66) return 'Somewhat sure';
    return 'Very sure';
  };
  
  return (
    <div className="confidence-slider-container">
      <label htmlFor="confidence-slider">How confident are you in your answer?</label>
      <div className="confidence-level">
        <div className="confidence-label">{getConfidenceText()}</div>
      </div>
      <input
        ref={sliderRef}
        id="confidence-slider"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        disabled={disabled}
        className="slider"
      />
      <div className="slider-labels">
        <span>Not sure</span>
        <span>Somewhat sure</span>
        <span>Very sure</span>
      </div>
    </div>
  );
}
