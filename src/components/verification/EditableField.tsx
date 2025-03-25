import React, { useState, useRef, useEffect } from 'react';
import styles from './verification.module.css';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  multiline?: boolean;
  placeholder?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  label,
  multiline = false,
  placeholder = 'Enter value...'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  useEffect(() => {
    setEditValue(value);
  }, [value]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };
  
  return (
    <div className={styles['editable-field']}>
      {label && <label className={styles['field-label']}>{label}</label>}
      
      {isEditing ? (
        <div className={styles['edit-container']}>
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={3}
              className={`${styles['field-input']} ${styles['multiline']}`}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={styles['field-input']}
            />
          )}
          <div className={styles['edit-actions']}>
            <button 
              onClick={handleSave} 
              className={styles['save-button']}
              title="Save changes"
            >
              ✓
            </button>
            <button 
              onClick={handleCancel} 
              className={styles['cancel-button']}
              title="Cancel"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className={styles['display-container']} onClick={handleEdit}>
          <div className={styles['field-value']}>
            {value || <span className={styles['placeholder']}>{placeholder}</span>}
          </div>
          <button 
            className={styles['edit-button']} 
            onClick={handleEdit}
            title="Edit"
          >
            ✎
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableField; 