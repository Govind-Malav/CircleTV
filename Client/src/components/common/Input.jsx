import React, { forwardRef } from 'react';

const Input = forwardRef((
  {
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    className = '',
    inputClassName = '',
    type = 'text',
    ...props
  },
  ref
) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={[
            'w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500',
            'transition-colors outline-none',
            'focus:border-violet-500 focus:ring-1 focus:ring-violet-500',
            error ? 'border-red-500' : 'border-gray-700',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            inputClassName,
          ].join(' ')}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
