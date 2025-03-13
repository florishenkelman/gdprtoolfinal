import React from 'react';
import { Loader } from 'lucide-react';
import './Common.css'; // CSS file for styles

// Button component with different variants
export const Button = ({
                         children,
                         variant = 'primary',
                         size = 'md',
                         isLoading = false,
                         ...props
                       }) => {
  const buttonClass = `btn ${variant} ${size} ${isLoading ? 'loading' : ''}`;

  return (
      <button className={buttonClass} disabled={isLoading} {...props}>
        {isLoading && <Loader className="btn-loader" />}
        {children}
      </button>
  );
};

// Input component
export const Input = ({ label, error, ...props }) => {
  return (
      <div className="input-group">
        {label && <label className="input-label">{label}</label>}
        <input
            className={`input-field ${error ? 'input-error' : ''}`}
            {...props}
        />
        {error && <p className="input-error-text">{error}</p>}
      </div>
  );
};

// Select component
export const Select = ({ label, options, error, ...props }) => {
  return (
      <div className="select-group">
        {label && <label className="select-label">{label}</label>}
        <select className={`select-field ${error ? 'select-error' : ''}`} {...props}>
          {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
          ))}
        </select>
        {error && <p className="select-error-text">{error}</p>}
      </div>
  );
};

// Alert component
export const Alert = ({ type = 'info', message }) => {
  return <div className={`alert alert-${type}`}>{message}</div>;
};

// Loading component
export const Loading = ({ size = 'md' }) => {
  return (
      <div className="loading-container">
        <Loader className={`loading-icon loading-${size}`} />
      </div>
  );
};

export default {
  Button,
  Input,
  Select,
  Alert,
  Loading,
};