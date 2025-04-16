import React from 'react';
import './FormInput.css';

const FormInput = ({ label, id, type = 'text', value, onChange, placeholder, error }) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="form-input-group">
            {label && <label htmlFor={inputId} className="form-input-label">{label}</label>}
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder || ''}
                className={`form-input ${error ? 'form-input-error' : ''}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : undefined}
            />
            {error && <span id={`${inputId}-error`} className="form-error-text">{error}</span>}
        </div>
    );
};

export default FormInput;