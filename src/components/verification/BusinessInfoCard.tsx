import React from 'react';
import EditableField from './EditableField';
import SourceAttribution from './SourceAttribution';
import ConfidenceIndicator from './ConfidenceIndicator';
import styles from './verification.module.css';

interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  verified: boolean;
}

interface BusinessInfoCardProps {
  businessInfo: BusinessInfo;
  onInfoChange: (field: keyof BusinessInfo, value: string) => void;
  onVerify: () => void;
  confidenceScore?: number;
  source?: {
    name: string;
    url?: string;
    timestamp?: string;
  };
}

const BusinessInfoCard: React.FC<BusinessInfoCardProps> = ({
  businessInfo,
  onInfoChange,
  onVerify,
  confidenceScore = 0,
  source
}) => {
  return (
    <div className={styles['business-card']}>
      <div className={styles['business-header']}>
        <h3 className={styles['business-name']}>{businessInfo.name}</h3>
        <div className={`${styles['verification-status']} ${businessInfo.verified ? styles['verified'] : styles['unverified']}`}>
          {businessInfo.verified ? 'Verified' : 'Unverified'}
        </div>
      </div>

      <div className={styles['info-section']}>
        <h4 className={styles['section-title']}>Business Information</h4>
        <EditableField
          label="Business Name"
          value={businessInfo.name}
          onChange={(value) => onInfoChange('name', value)}
        />
        <EditableField
          label="Address"
          value={businessInfo.address}
          onChange={(value) => onInfoChange('address', value)}
        />
        <EditableField
          label="Phone"
          value={businessInfo.phone}
          onChange={(value) => onInfoChange('phone', value)}
        />
        <EditableField
          label="Website"
          value={businessInfo.website}
          onChange={(value) => onInfoChange('website', value)}
        />
        <EditableField
          label="Description"
          value={businessInfo.description}
          onChange={(value) => onInfoChange('description', value)}
          multiline
        />
      </div>

      {confidenceScore > 0 && (
        <ConfidenceIndicator confidence={confidenceScore} />
      )}

      {source && (
        <SourceAttribution
          source={source.name}
          url={source.url}
          timestamp={source.timestamp}
        />
      )}

      <div className={styles['verification-actions']}>
        <button 
          className={`${styles['action-button']} ${styles['primary-button']}`}
          onClick={onVerify}
        >
          {businessInfo.verified ? 'Update Verification' : 'Verify Business'}
        </button>
        <button className={`${styles['action-button']} ${styles['secondary-button']}`}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default BusinessInfoCard; 