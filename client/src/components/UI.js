import React from 'react';

/**
 * Card Component - Reusable container with Tailwind CSS - Responsive
 */
const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow border border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Button Component - Reusable button with Tailwind CSS - Responsive
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  const sizes = {
    sm: 'px-2 md:px-3 py-1 text-xs md:text-sm',
    md: 'px-3 md:px-4 py-2 text-sm md:text-base',
    lg: 'px-4 md:px-6 py-2 md:py-3 text-base md:text-lg',
  };

  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer whitespace-nowrap';
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizeClass} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? '⏳ Loading...' : children}
    </button>
  );
};

/**
 * Input Component - Reusable input with Tailwind CSS - Responsive
 */
const Input = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 md:px-4 py-2 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs md:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

/**
 * Select Component - Reusable select with Tailwind CSS - Responsive
 */
const Select = ({ 
  label, 
  error, 
  options = [], 
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 md:px-4 py-2 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        <option value="">Select {label || 'an option'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs md:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

/**
 * Badge Component - Reusable badge with Tailwind CSS
 */
const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variants[variant] || variants.primary} ${className}`}>
      {children}
    </span>
  );
};

/**
 * Modal Component - Reusable modal with Tailwind CSS - Responsive
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 gap-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none flex-shrink-0"
          >
            ×
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
};

export { Card, Button, Input, Select, Badge, Modal };
