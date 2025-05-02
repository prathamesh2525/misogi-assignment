import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  const inputId = props.id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  const widthStyles = fullWidth ? 'w-full' : '';
  const errorStyles = error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';
  
  return (
    <div className={`${widthStyles} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          className={`bg-white appearance-none block ${widthStyles} px-3 py-2 border ${errorStyles} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
};

export default Input;