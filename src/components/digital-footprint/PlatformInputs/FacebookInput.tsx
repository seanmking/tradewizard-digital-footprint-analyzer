import React, { useState } from 'react';

interface FacebookInputProps {
  onAdd: (url: string) => void;
}

const FacebookInput: React.FC<FacebookInputProps> = ({ onAdd }) => {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Validate Facebook URL or page name
  const validateFacebookPage = (input: string): boolean => {
    // Allow either a full URL or just a page name
    const fbUrlRegex = /^(?:https?:\/\/)?(?:www\.|m\.|mobile\.|business\.)?facebook\.com\/(?:[\w.]+\/?|pages\/[\w.]+\/[\d]+\/?|groups\/[\w.]+\/?|[\w.]+)$/;
    const pageNameRegex = /^[\w.]{5,50}$/;
    
    return fbUrlRegex.test(input) || pageNameRegex.test(input);
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
      setError('Please enter a Facebook page URL or name');
      return;
    }
    
    if (!validateFacebookPage(trimmedUrl)) {
      setError('Please enter a valid Facebook page URL or name');
      return;
    }
    
    // Format URL if needed
    let formattedUrl = trimmedUrl;
    
    // If it's not a URL but a page name, convert to URL
    if (!trimmedUrl.includes('facebook.com')) {
      formattedUrl = `https://facebook.com/${trimmedUrl}`;
    } 
    // If it's a URL but missing https://, add it
    else if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      formattedUrl = `https://${trimmedUrl}`;
    }
    
    // Call the onAdd callback
    onAdd(formattedUrl);
    
    // Clear the input
    setUrl('');
  };
  
  return (
    <div className="facebook-input">
      <h3>Add a Facebook Business Page</h3>
      <p className="input-description">
        Enter your Facebook business page URL or page name. We'll analyze your page content
        to extract business information and product details.
      </p>
      
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="facebook.com/yourbusiness or yourbusiness"
            className={`fb-input ${error ? 'error' : ''}`}
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
        
        <div className="input-examples">
          <span>Examples: </span>
          <code>facebook.com/yourbusiness</code>
          <span> or </span>
          <code>yourbusiness</code>
        </div>
        
        <div className="input-tips">
          <h4>Tips:</h4>
          <ul>
            <li>Business pages with a Shop section provide better product information</li>
            <li>Ensure your page is public so we can access all relevant information</li>
            <li>Pages with complete About sections yield better business details</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default FacebookInput; 