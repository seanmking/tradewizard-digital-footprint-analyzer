import React, { useState } from 'react';

interface WebsiteInputProps {
  onAdd: (url: string) => void;
}

const WebsiteInput: React.FC<WebsiteInputProps> = ({ onAdd }) => {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Validate URL format
  const validateUrl = (input: string): boolean => {
    // Simple URL validation regex
    const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    
    return urlRegex.test(input);
  };
  
  // Handle input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    
    // Clear error when user types
    if (error) {
      setError(null);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedUrl = url.trim();
    
    // Validate input
    if (!trimmedUrl) {
      setError('Please enter a website URL');
      return;
    }
    
    if (!validateUrl(trimmedUrl)) {
      setError('Please enter a valid website URL');
      return;
    }
    
    // Format URL (add https:// if missing)
    let formattedUrl = trimmedUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    // Call the onAdd callback
    onAdd(formattedUrl);
    
    // Clear the input
    setUrl('');
  };
  
  return (
    <div className="website-input">
      <h3>Add a Website</h3>
      <p className="input-description">
        Enter your business website URL. We'll analyze it to extract business information 
        and product details automatically.
      </p>
      
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="E.g., www.yourbusiness.com"
            className={`url-input ${error ? 'error' : ''}`}
          />
          <button 
            type="submit" 
            className="add-button"
            disabled={!url.trim()}
          >
            Add
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="input-tips">
          <h4>Tips:</h4>
          <ul>
            <li>Your primary business website will provide the most complete information</li>
            <li>E-commerce sites with product listings are especially valuable</li>
            <li>Include your most up-to-date site for best results</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default WebsiteInput; 