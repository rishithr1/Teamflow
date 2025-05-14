import React from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'busy' | 'away' | 'offline';
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className = '' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-red-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`w-3 h-3 rounded-full border-2 border-white ${getStatusColor()} ${className}`}
    ></div>
  );
};

export default StatusIndicator;