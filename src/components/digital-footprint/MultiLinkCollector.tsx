import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WebsiteInput from './PlatformInputs/WebsiteInput';
import InstagramInput from './PlatformInputs/InstagramInput';
import FacebookInput from './PlatformInputs/FacebookInput';
import DocumentUploader from './PlatformInputs/DocumentUploader';
import ProcessingVisualization from './ProcessingVisualization';
import DiscoveryMeter from './DiscoveryMeter';

interface MultiLinkCollectorProps {
  onComplete: (results: ExtractionResultSummary[]) => void;
  onAnalysisStart: () => void;
  businessId?: string;
}

interface DigitalSource {
  type: 'website' | 'instagram' | 'facebook' | 'document';
  value: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  result?: ExtractionResultSummary;
}

interface ExtractionResultSummary {
  sourceType: string;
  sourceUrl: string;
  businessName?: string;
  productCount: number;
  confidence: number;
  id: string;
}

const MultiLinkCollector: React.FC<MultiLinkCollectorProps> = ({ 
  onComplete, 
  onAnalysisStart,
  businessId 
}) => {
  const [sources, setSources] = useState<DigitalSource[]>([]);
  const [activeTab, setActiveTab] = useState<string>('website');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [discoveryScore, setDiscoveryScore] = useState<number>(0);
  
  // Add a new digital source
  const addSource = (type: 'website' | 'instagram' | 'facebook' | 'document', value: string) => {
    setSources(prev => [
      ...prev,
      {
        type,
        value,
        status: 'pending'
      }
    ]);
  };
  
  // Remove a source
  const removeSource = (index: number) => {
    setSources(prev => prev.filter((_, i) => i !== index));
  };
  
  // Start the analysis process
  const startAnalysis = async () => {
    if (sources.length === 0) {
      return;
    }
    
    onAnalysisStart();
    setIsProcessing(true);
    
    // Process each source
    const results: ExtractionResultSummary[] = [];
    
    for (let i = 0; i < sources.length; i++) {
      // Update status to processing
      setSources(prev => {
        const updated = [...prev];
        updated[i] = { ...updated[i], status: 'processing' };
        return updated;
      });
      
      // Calculate progress
      setOverallProgress(((i + 0.5) / sources.length) * 100);
      
      try {
        // Call the extraction API
        const result = await extractDataFromSource(sources[i], businessId);
        
        // Update source with result
        setSources(prev => {
          const updated = [...prev];
          updated[i] = { 
            ...updated[i], 
            status: 'completed',
            result
          };
          return updated;
        });
        
        // Add to results
        results.push(result);
        
        // Update discovery score
        updateDiscoveryScore(result);
      } catch (error) {
        // Handle error
        setSources(prev => {
          const updated = [...prev];
          updated[i] = { 
            ...updated[i], 
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          };
          return updated;
        });
      }
      
      // Update progress to completion for this source
      setOverallProgress(((i + 1) / sources.length) * 100);
    }
    
    setIsProcessing(false);
    onComplete(results);
  };
  
  // Extract data from a source
  const extractDataFromSource = async (
    source: DigitalSource, 
    businessId?: string
  ): Promise<ExtractionResultSummary> => {
    // This would be an API call to the backend
    const apiUrl = `/api/extract/${source.type}`;
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, return mock data
    return {
      sourceType: source.type,
      sourceUrl: source.value,
      businessName: source.type === 'website' ? 'Example Business' : undefined,
      productCount: Math.floor(Math.random() * 10) + 1,
      confidence: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
      id: `extract-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  };
  
  // Update discovery score based on new extraction result
  const updateDiscoveryScore = (result: ExtractionResultSummary) => {
    // Increase discovery score based on confidence and product count
    const increment = (result.confidence * 0.6) + (Math.min(result.productCount, 10) * 0.04);
    setDiscoveryScore(prev => Math.min(prev + increment, 1.0));
  };
  
  return (
    <div className="multi-link-collector">
      <h2 className="title">Add your business's digital footprint</h2>
      <p className="description">
        Help us understand your business better by sharing your online presence.
        Add your website, social media profiles, or upload documents about your products.
      </p>
      
      {/* Tab navigation for different source types */}
      <div className="source-tabs">
        <button 
          className={`tab ${activeTab === 'website' ? 'active' : ''}`}
          onClick={() => setActiveTab('website')}
        >
          Website
        </button>
        <button 
          className={`tab ${activeTab === 'instagram' ? 'active' : ''}`}
          onClick={() => setActiveTab('instagram')}
        >
          Instagram
        </button>
        <button 
          className={`tab ${activeTab === 'facebook' ? 'active' : ''}`}
          onClick={() => setActiveTab('facebook')}
        >
          Facebook
        </button>
        <button 
          className={`tab ${activeTab === 'document' ? 'active' : ''}`}
          onClick={() => setActiveTab('document')}
        >
          Document
        </button>
      </div>
      
      {/* Input components based on active tab */}
      <div className="source-input">
        {activeTab === 'website' && <WebsiteInput onAdd={(url: string) => addSource('website', url)} />}
        {activeTab === 'instagram' && <InstagramInput onAdd={(handle: string) => addSource('instagram', handle)} />}
        {activeTab === 'facebook' && <FacebookInput onAdd={(url: string) => addSource('facebook', url)} />}
        {activeTab === 'document' && <DocumentUploader onAdd={(fileId: string) => addSource('document', fileId)} />}
      </div>
      
      {/* List of added sources */}
      <div className="sources-list">
        <h3>Added Sources</h3>
        {sources.length === 0 ? (
          <p className="empty-state">No sources added yet. Add at least one source above.</p>
        ) : (
          <ul>
            {sources.map((source, index) => (
              <motion.li 
                key={`${source.type}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`source-item ${source.status}`}
              >
                <div className="source-info">
                  <span className="source-type">{source.type}</span>
                  <span className="source-value">{source.value}</span>
                </div>
                <div className="source-status">
                  {source.status === 'pending' && <span className="status">Pending</span>}
                  {source.status === 'processing' && <span className="status processing">Processing...</span>}
                  {source.status === 'completed' && <span className="status completed">Completed</span>}
                  {source.status === 'failed' && <span className="status failed">Failed: {source.error}</span>}
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeSource(index)}
                  disabled={isProcessing}
                >
                  ✕
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Analysis progress and visualization */}
      {isProcessing && (
        <div className="processing-container">
          <ProcessingVisualization 
            sources={sources}
            progress={overallProgress}
          />
        </div>
      )}
      
      {/* Discovery meter */}
      <div className="discovery-meter-container">
        <DiscoveryMeter 
          score={discoveryScore}
          thresholds={[0.3, 0.6, 0.9]}
        />
        <p className="discovery-help">
          {discoveryScore < 0.3 && "Add more sources to improve your business profile."}
          {discoveryScore >= 0.3 && discoveryScore < 0.6 && "Good start! Add more sources for better insights."}
          {discoveryScore >= 0.6 && discoveryScore < 0.9 && "Great progress! Your business profile is taking shape."}
          {discoveryScore >= 0.9 && "Excellent! We have a comprehensive view of your business."}
        </p>
      </div>
      
      {/* Action buttons */}
      <div className="actions">
        <button 
          className="analyze-btn"
          onClick={startAnalysis}
          disabled={sources.length === 0 || isProcessing}
        >
          {isProcessing ? 'Analyzing...' : 'Analyze Digital Footprint'}
        </button>
      </div>
    </div>
  );
};

export default MultiLinkCollector; 