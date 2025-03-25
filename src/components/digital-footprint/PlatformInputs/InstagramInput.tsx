import React, { useState } from 'react';

interface InstagramInputProps {
  onAdd: (handle: string) => void;
}

const InstagramInput: React.FC<InstagramInputProps> = ({ onAdd }) => {
  const [handle, setHandle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Validate Instagram handle format
  const validateInstagramHandle = (input: string): boolean => {
    // Instagram handle format: letters, numbers, periods, and underscores
    const handleRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    
    return handleRegex.test(input);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any @ symbol from the beginning
    const value = e.target.value.replace(/^@/, '');
    setHandle(value);
    
    // Clear error when user types
    if (error) {
      setError(null);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedHandle = handle.trim();
    
    // Validate input
    if (!trimmedHandle) {
      setError('Please enter an Instagram handle');
      return;
    }
    
    if (!validateInstagramHandle(trimmedHandle)) {
      setError('Please enter a valid Instagram handle');
      return;
    }
    
    // Call the onAdd callback
    onAdd(trimmedHandle);
    
    // Clear the input
    setHandle('');
  };
  
  return (
    <div className="instagram-input">
      <h3>Add an Instagram Business Profile</h3>
      <p className="input-description">
        Enter your business Instagram handle. We'll analyze your profile, posts, and captions
        to extract business information and product details.
      </p>
      
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-group">
          <div className="input-prefix">@</div>
          <input
            type="text"
            value={handle}
            onChange={handleInputChange}
            placeholder="yourbusiness"
            className={`handle-input ${error ? 'error' : ''}`}
          />
          <button 
            type="submit" 
            className="add-button"
            disabled={!handle.trim()}
          >
            Add
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="input-tips">
          <h4>Tips:</h4>
          <ul>
            <li>Use your business profile rather than a personal account</li>
            <li>Ensure your profile is set to public so we can access it</li>
            <li>Profiles with product posts and hashtags provide better results</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default InstagramInput; 