import React from 'react';
import StatusIndicator from './StatusIndicator';

interface AvatarProps {
  name: string;
  status?: 'online' | 'busy' | 'away' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  status, 
  size = 'md', 
  showStatus = true,
  className = ''
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'md':
        return 'w-10 h-10 text-sm';
      case 'lg':
        return 'w-12 h-12 text-base';
      default:
        return 'w-10 h-10 text-sm';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`${getSizeClasses()} rounded-full bg-gray-200 flex items-center justify-center relative text-gray-700 font-medium`}>
        {getInitials(name)}
      </div>
      {showStatus && status && (
        <StatusIndicator 
          status={status} 
          className="absolute bottom-0 right-0" 
        />
      )}
    </div>
  );
};

export default Avatar;