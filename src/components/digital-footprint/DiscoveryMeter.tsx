import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface DiscoveryMeterProps {
  score: number;
  thresholds: number[];
}

const DiscoveryMeter: React.FC<DiscoveryMeterProps> = ({ score, thresholds }) => {
  const controls = useAnimation();
  const prevScore = useRef<number>(0);
  
  useEffect(() => {
    // Animate the meter if score has changed
    if (score !== prevScore.current) {
      controls.start({
        width: `${score * 100}%`,
        transition: {
          type: 'spring',
          damping: 12,
          stiffness: 100,
        }
      });
      prevScore.current = score;
    }
  }, [score, controls]);
  
  // Determine which threshold we're at
  const currentThresholdIndex = thresholds.findIndex(t => score < t);
  const thresholdLevel = currentThresholdIndex === -1 
    ? thresholds.length 
    : currentThresholdIndex;
  
  // Get relevant label and color based on score
  const getThresholdInfo = () => {
    if (score < thresholds[0]) {
      return { label: 'Starting', color: '#f0ad4e' };
    } else if (score < thresholds[1]) {
      return { label: 'Good', color: '#5bc0de' };
    } else if (score < thresholds[2]) {
      return { label: 'Great', color: '#5cb85c' };
    } else {
      return { label: 'Excellent', color: '#28a745' };
    }
  };
  
  const { label, color } = getThresholdInfo();
  
  return (
    <div className="discovery-meter">
      <div className="meter-header">
        <h4>Business Discovery Progress</h4>
        <span className="score-display">{Math.round(score * 100)}%</span>
      </div>
      
      <div className="meter-container">
        {/* Threshold markers */}
        <div className="thresholds">
          {thresholds.map((threshold, idx) => (
            <div 
              key={`threshold-${idx}`} 
              className="threshold-marker"
              style={{ left: `${threshold * 100}%` }}
            >
              <div className="marker-line" />
              <div className="marker-dot" />
            </div>
          ))}
        </div>
        
        {/* Meter background */}
        <div className="meter-background">
          {/* Colored segments based on thresholds */}
          <div className="meter-segments">
            <div className="segment" style={{ width: `${thresholds[0] * 100}%`, background: '#f0ad4e' }} />
            <div className="segment" style={{ width: `${(thresholds[1] - thresholds[0]) * 100}%`, background: '#5bc0de' }} />
            <div className="segment" style={{ width: `${(thresholds[2] - thresholds[1]) * 100}%`, background: '#5cb85c' }} />
            <div className="segment" style={{ width: `${(1 - thresholds[2]) * 100}%`, background: '#28a745' }} />
          </div>
          
          {/* Animated progress bar */}
          <motion.div 
            className="meter-progress"
            style={{ width: 0, background: color }}
            animate={controls}
          />
        </div>
      </div>
      
      <div className="meter-labels">
        <div className="label-item" style={{ opacity: thresholdLevel >= 0 ? 1 : 0.5 }}>
          <span className="dot" style={{ background: '#f0ad4e' }} />
          <span className="text">Starting</span>
        </div>
        <div className="label-item" style={{ opacity: thresholdLevel >= 1 ? 1 : 0.5 }}>
          <span className="dot" style={{ background: '#5bc0de' }} />
          <span className="text">Good</span>
        </div>
        <div className="label-item" style={{ opacity: thresholdLevel >= 2 ? 1 : 0.5 }}>
          <span className="dot" style={{ background: '#5cb85c' }} />
          <span className="text">Great</span>
        </div>
        <div className="label-item" style={{ opacity: thresholdLevel >= 3 ? 1 : 0.5 }}>
          <span className="dot" style={{ background: '#28a745' }} />
          <span className="text">Excellent</span>
        </div>
      </div>
      
      <div className="current-status">
        <div className="status-label">Current discovery status:</div>
        <div className="status-value" style={{ color }}>
          {label}
          {label === 'Excellent' && <span className="status-emoji">🎉</span>}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryMeter; 