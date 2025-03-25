import React from 'react';
import { motion } from 'framer-motion';

interface DigitalSource {
  type: 'website' | 'instagram' | 'facebook' | 'document';
  value: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  result?: any;
}

interface ProcessingVisualizationProps {
  sources: DigitalSource[];
  progress: number;
}

const ProcessingVisualization: React.FC<ProcessingVisualizationProps> = ({ 
  sources, 
  progress 
}) => {
  // Count completed and processing sources
  const completedCount = sources.filter(s => s.status === 'completed').length;
  const processingCount = sources.filter(s => s.status === 'processing').length;
  
  // Get currently processing source
  const currentSource = sources.find(s => s.status === 'processing');
  
  return (
    <div className="processing-visualization">
      <div className="progress-container">
        <div className="progress-bar-container">
          <motion.div 
            className="progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="progress-text">
          <span>{Math.round(progress)}%</span>
          <span>{completedCount} of {sources.length} sources processed</span>
        </div>
      </div>
      
      {currentSource && (
        <div className="current-source">
          <h4>Currently processing:</h4>
          <div className="source-card">
            <div className="source-icon">
              {currentSource.type === 'website' && <span>🌐</span>}
              {currentSource.type === 'instagram' && <span>📸</span>}
              {currentSource.type === 'facebook' && <span>👤</span>}
              {currentSource.type === 'document' && <span>📄</span>}
            </div>
            <div className="source-details">
              <span className="source-type">{currentSource.type}</span>
              <span className="source-value">{currentSource.value}</span>
            </div>
            <motion.div 
              className="processing-indicator"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </div>
          
          <div className="extraction-steps">
            <div className="step completed">
              <span className="step-number">1</span>
              <span className="step-name">Downloading content</span>
            </div>
            <div className="step active">
              <span className="step-number">2</span>
              <span className="step-name">Analyzing structure</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-name">Extracting entities</span>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <span className="step-name">Classifying products</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="insights-preview">
        <h4>Insights discovered so far:</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <span className="insight-label">Business entities</span>
            <span className="insight-value">{completedCount > 0 ? completedCount + 1 : 0}</span>
          </div>
          <div className="insight-card">
            <span className="insight-label">Products identified</span>
            <span className="insight-value">{completedCount * 3}</span>
          </div>
          <div className="insight-card">
            <span className="insight-label">Locations found</span>
            <span className="insight-value">{completedCount > 0 ? 1 : 0}</span>
          </div>
          <div className="insight-card">
            <span className="insight-label">Contact methods</span>
            <span className="insight-value">{completedCount > 0 ? completedCount + 1 : 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingVisualization; 