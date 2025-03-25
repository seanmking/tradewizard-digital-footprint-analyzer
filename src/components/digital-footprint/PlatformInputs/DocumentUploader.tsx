import React, { useState, useRef } from 'react';

interface DocumentUploaderProps {
  onAdd: (fileId: string) => void;
}

interface UploadStatus {
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onAdd }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  
  // Max file size in bytes (10MB)
  const maxFileSize = 10 * 1024 * 1024;
  
  // Validate file
  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported. Please upload PDF, Word, Excel, PowerPoint, or text documents.';
    }
    
    if (file.size > maxFileSize) {
      return 'File too large. Maximum size is 10MB.';
    }
    
    return null;
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      
      if (validationError) {
        setError(validationError);
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0] || null;
    
    if (droppedFile) {
      const validationError = validateFile(droppedFile);
      
      if (validationError) {
        setError(validationError);
        setFile(null);
        return;
      }
      
      setFile(droppedFile);
      setError(null);
    }
  };
  
  // Trigger file input click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Upload file
  const handleUpload = async () => {
    if (!file) return;
    
    // Reset status
    setUploadStatus({
      progress: 0,
      status: 'uploading'
    });
    
    try {
      // Simulate file upload with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadStatus({
          progress: i,
          status: 'uploading'
        });
      }
      
      // Simulate file processing
      setUploadStatus({
        progress: 100,
        status: 'processing',
        message: 'Processing document...'
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Complete the upload
      setUploadStatus({
        progress: 100,
        status: 'complete',
        message: 'Document ready for analysis!'
      });
      
      // Generate a mock file ID
      const fileId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Call the onAdd callback with the file ID
      onAdd(fileId);
      
      // Reset the form
      setFile(null);
      setUploadStatus(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      // Handle errors
      setUploadStatus({
        progress: 0,
        status: 'error',
        message: 'Upload failed. Please try again.'
      });
    }
  };
  
  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className="document-uploader">
      <h3>Upload Business Documents</h3>
      <p className="input-description">
        Upload documents containing information about your business and products.
        We'll extract relevant details to enhance your business profile.
      </p>
      
      {/* File drag & drop area */}
      <div 
        className={`dropzone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept={allowedTypes.join(',')}
        />
        
        {!file ? (
          <div className="dropzone-content">
            <div className="dropzone-icon">📄</div>
            <p>Drag & drop your document here or <span className="browse-link">browse</span></p>
            <p className="file-types">PDF, Word, Excel, PowerPoint, or text documents (max 10MB)</p>
          </div>
        ) : (
          <div className="file-preview">
            <div className="file-icon">
              {file.type.includes('pdf') && '📕'}
              {file.type.includes('word') && '📘'}
              {file.type.includes('excel') && '📗'}
              {file.type.includes('presentation') && '📙'}
              {file.type.includes('text') && '📃'}
            </div>
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{formatFileSize(file.size)}</span>
            </div>
          </div>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Upload status */}
      {uploadStatus && (
        <div className="upload-status">
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadStatus.progress}%` }}
            />
          </div>
          <div className="status-text">
            {uploadStatus.status === 'uploading' && `Uploading... ${uploadStatus.progress}%`}
            {uploadStatus.status === 'processing' && uploadStatus.message}
            {uploadStatus.status === 'complete' && uploadStatus.message}
            {uploadStatus.status === 'error' && uploadStatus.message}
          </div>
        </div>
      )}
      
      {/* Action button */}
      {file && !uploadStatus && (
        <button 
          className="upload-button"
          onClick={handleUpload}
        >
          Upload Document
        </button>
      )}
      
      <div className="input-tips">
        <h4>Tips:</h4>
        <ul>
          <li>Product catalogs and brochures provide valuable product details</li>
          <li>Company profiles help us understand your business better</li>
          <li>Price lists and specification sheets enhance product information</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUploader; 