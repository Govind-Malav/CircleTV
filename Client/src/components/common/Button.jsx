import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 focus:ring-violet-500',
  secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 focus:ring-gray-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-500',
  outline: 'bg-transparent border border-violet-500 text-violet-400 hover:bg-violet-500/10 focus:ring-violet-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  icon: 'p-2',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  rounded = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
        rounded ? 'rounded-full' : 'rounded-lg',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;
