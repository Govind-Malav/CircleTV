import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = 'md', color = 'violet' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  const colors = { violet: 'border-violet-500', white: 'border-white', gray: 'border-gray-400' };
  
  const spinner = (
    <div className={`${sizes[size] || sizes.md} border-2 border-transparent ${colors[color] || colors.violet} border-t-current rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          {React.cloneElement(spinner, { className: `w-10 h-10 border-2 border-transparent ${colors[color] || colors.violet} border-t-current rounded-full animate-spin` })}
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
