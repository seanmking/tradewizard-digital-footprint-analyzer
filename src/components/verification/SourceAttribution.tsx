import React from 'react';
import styles from './verification.module.css';

interface SourceAttributionProps {
  source: string;
  url?: string;
  timestamp?: string;
}

const SourceAttribution: React.FC<SourceAttributionProps> = ({ 
  source, 
  url, 
  timestamp 
}) => {
  return (
    <div className={styles['source-attribution']}>
      <span className={styles['source-icon']}>ℹ</span>
      <span>Source: {source}</span>
      {url && (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles['source-link']}
        >
          View
        </a>
      )}
      {timestamp && (
        <span className={styles['timestamp']}>
          {new Date(timestamp).toLocaleDateString()}
        </span>
      )}
    </div>
  );
};

export default SourceAttribution; 