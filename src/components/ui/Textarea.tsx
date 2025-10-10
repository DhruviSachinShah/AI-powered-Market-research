import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  showCharCount = false,
  maxLength,
  className = '',
  ...props
}) => {
  const currentLength = props.value?.toString().length || 0;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-vertical ${
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
        } ${className}`}
        maxLength={maxLength}
        {...props}
      />
      <div className="flex justify-between items-center">
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
        {showCharCount && maxLength && (
          <p className="text-sm text-gray-400 ml-auto">
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default Textarea;
