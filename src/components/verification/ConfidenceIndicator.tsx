import React from 'react';
import styles from './verification.module.css';

interface ConfidenceIndicatorProps {
  confidence: number; // 0-100
  showLabel?: boolean;
  showValue?: boolean;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  showLabel = true,
  showValue = true
}) => {
  // Ensure confidence is within 0-100 range
  const normalizedConfidence = Math.max(0, Math.min(100, confidence));
  
  // Determine confidence level category
  const getConfidenceLevel = () => {
    if (normalizedConfidence >= 70) return 'high';
    if (normalizedConfidence >= 40) return 'medium';
    return 'low';
  };
  
  const confidenceLevel = getConfidenceLevel();
  
  return (
    <div className={styles['confidence-indicator']}>
      {showLabel && (
        <span className={styles['confidence-label']}>Confidence:</span>
      )}
      <div className={styles['confidence-bar']}>
        <div 
          className={`${styles['confidence-level']} ${styles[`confidence-${confidenceLevel}`]}`}
          style={{ width: `${normalizedConfidence}%` }}
        />
      </div>
      {showValue && (
        <span className={`${styles['confidence-value']} ${styles[`confidence-${confidenceLevel}-text`]}`}>
          {normalizedConfidence}%
        </span>
      )}
    </div>
  );
};

export default ConfidenceIndicator; 