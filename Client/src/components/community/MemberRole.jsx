import React from 'react';

const MemberRole = ({ role, size = 'sm' }) => {
  const getRoleStyles = () => {
    switch (role) {
      case 'admin':
        return {
          bg: 'bg-yellow-500 bg-opacity-20',
          text: 'text-yellow-500',
          icon: '👑',
          label: 'Admin'
        };
      case 'moderator':
        return {
          bg: 'bg-blue-500 bg-opacity-20',
          text: 'text-blue-500',
          icon: '🛡️',
          label: 'Moderator'
        };
      default:
        return {
          bg: 'bg-gray-700 bg-opacity-50',
          text: 'text-gray-400',
          icon: null,
          label: 'Member'
        };
    }
  };
  
  const styles = getRoleStyles();
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${styles.bg} ${styles.text} ${sizeClasses[size]}`}>
      {styles.icon && <span>{styles.icon}</span>}
      <span>{styles.label}</span>
    </span>
  );
};

export default MemberRole;