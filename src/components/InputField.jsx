'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  min,
  max,
  prefix,
  suffix,
  helper,
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState('');
  const [rawValue, setRawValue] = useState('');
  const inputRef = useRef(null);
  const isControlled = useRef(false);

  // Initialize values from props
  useEffect(() => {
    const initialValue = value || 0;
    const formatted = formatForDisplay(initialValue);
    setDisplayValue(formatted);
    setRawValue(String(initialValue));
  }, []);

  // Update when prop changes (controlled component)
  useEffect(() => {
    if (!isControlled.current) {
      const formatted = formatForDisplay(value || 0);
      setDisplayValue(formatted);
      setRawValue(String(value || 0));
    }
    isControlled.current = false;
  }, [value]);

  // Format number for display with commas
  const formatForDisplay = useCallback((val) => {
    if (val === '' || val === null || val === undefined) return '';
    
    const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
    if (isNaN(num)) return String(val);
    
    if (type === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
      }).format(num);
    }
    
    if (type === 'percentage') {
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
      }).format(num);
    }
    
    if (type === 'number') {
      // Add commas for large numbers
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 10 // Allow many decimal places
      }).format(num);
    }
    
    return String(val);
  }, [type]);

  // Parse display value back to raw number
  const parseDisplayValue = useCallback((display) => {
    if (display === '') return '';
    
    // Remove all commas for parsing
    const withoutCommas = display.replace(/,/g, '');
    
    if (type === 'number' || type === 'currency' || type === 'percentage') {
      // Parse as float, handling empty string
      const num = parseFloat(withoutCommas);
      return isNaN(num) ? '' : num.toString();
    }
    
    return display;
  }, [type]);

  const handleChange = useCallback((e) => {
    isControlled.current = true;
    const newDisplay = e.target.value;
    
    // Allow only numbers and decimal point for numeric types
    if (type === 'number' || type === 'currency' || type === 'percentage') {
      // Regex: allow numbers, single decimal point, and negative sign at start
      const numericRegex = /^-?\d*\.?\d*$/;
      const withoutCommas = newDisplay.replace(/,/g, '');
      
      if (withoutCommas === '' || numericRegex.test(withoutCommas)) {
        const parsedValue = parseDisplayValue(newDisplay);
        setRawValue(parsedValue);
        
        // Format the display with commas
        if (withoutCommas === '' || withoutCommas === '-') {
          setDisplayValue(withoutCommas);
        } else {
          const formatted = formatForDisplay(withoutCommas);
          setDisplayValue(formatted);
        }
        
        // Convert to number for parent callback
        const numValue = parsedValue === '' ? 0 : parseFloat(parsedValue);
        onChange(isNaN(numValue) ? 0 : numValue);
      }
    } else {
      // For text inputs
      setDisplayValue(newDisplay);
      setRawValue(newDisplay);
      onChange(newDisplay);
    }
  }, [type, onChange, formatForDisplay, parseDisplayValue]);

  // Handle increment/decrement
  const handleIncrement = useCallback(() => {
    isControlled.current = true;
    const current = parseFloat(rawValue) || 0;
    const newValue = current + 1;
    if (max === undefined || newValue <= max) {
      const formatted = formatForDisplay(newValue);
      setDisplayValue(formatted);
      setRawValue(String(newValue));
      onChange(newValue);
    }
  }, [rawValue, max, onChange, formatForDisplay]);

  const handleDecrement = useCallback(() => {
    isControlled.current = true;
    const current = parseFloat(rawValue) || 0;
    const newValue = current - 1;
    if (min === undefined || newValue >= min) {
      const formatted = formatForDisplay(newValue);
      setDisplayValue(formatted);
      setRawValue(String(newValue));
      onChange(newValue);
    }
  }, [rawValue, min, onChange, formatForDisplay]);

  // Handle focus - show raw value for easier editing
  const handleFocus = useCallback(() => {
    isControlled.current = true;
    if (type === 'number' || type === 'currency' || type === 'percentage') {
      setDisplayValue(rawValue);
    }
  }, [type, rawValue]);

  // Handle blur - format the value
  const handleBlur = useCallback(() => {
    isControlled.current = true;
    if (type === 'number' || type === 'currency' || type === 'percentage' && rawValue !== '') {
      const formatted = formatForDisplay(rawValue);
      setDisplayValue(formatted);
    }
  }, [type, rawValue, formatForDisplay]);

  const getInputType = () => {
    if (type === 'currency' || type === 'percentage') return 'text'; // Use text to handle formatting
    if (type === 'number') return 'text'; // Use text for number formatting too
    return type;
  };

  const hasNumberControls = type === 'number' || type === 'currency' || type === 'percentage';

  // Calculate input value with proper cursor position handling
  const getInputValue = () => {
    return displayValue;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-base font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {prefix}
          </span>
        )}

        <input
          ref={inputRef}
          id={id}
          type={getInputType()}
          value={getInputValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={min}
          max={max}
          className={`
            w-full px-3 py-3 border border-slate-300 rounded-lg text-base
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${prefix ? 'pl-8' : ''}
            ${hasNumberControls ? 'pr-20' : suffix ? 'pr-10' : ''}
            min-h-[44px]
          `}
          placeholder={type === 'currency' ? '0' : ''}
          inputMode={type === 'number' || type === 'currency' || type === 'percentage' ? 'decimal' : 'text'}
        />

        {hasNumberControls && (
          <>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors min-h-[44px]"
                aria-label="Decrease"
              >
                <span className="text-slate-500 text-lg">−</span>
              </button>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors min-h-[44px]"
                aria-label="Increase"
              >
                <span className="text-slate-500 text-lg">+</span>
              </button>
            </div>

            {type === 'percentage' && (
              <span className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-500">
                %
              </span>
            )}
          </>
        )}

        {suffix && !hasNumberControls && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {suffix}
          </span>
        )}
      </div>

      {helper && (
        <p className="text-xs text-slate-500 break-words">
          {helper}
        </p>
      )}
    </div>
  );
}