import React from 'react';

interface NotificationProps {
  notifications: Array<{
    type: 'mention' | 'deadline' | 'update';
    text: string;
    time: string;
    ai?: boolean;
  }>;
  onClose: () => void;
}

const Notifications: React.FC<NotificationProps> = ({ notifications, onClose }) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 animate-slideInRight">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <div className="flex space-x-2">
          <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
            AI Powered
          </span>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-300 hover:translate-x-1 ${notification.ai ? "border-l-2 border-blue-500" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full ${notification.ai ? "bg-blue-100" : "bg-gray-100"} flex items-center justify-center ${notification.ai ? "text-blue-500" : "text-gray-500"}`}
            >
              <i
                className={`fas ${
                  notification.type === "mention"
                    ? "fa-at"
                    : notification.type === "deadline"
                      ? "fa-clock"
                      : "fa-bell"
                }`}
              ></i>
            </div>
            <div>
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  {notification.text}
                </p>
                {notification.ai && (
                  <i className="fas fa-robot text-blue-500 ml-2 text-xs"></i>
                )}
              </div>
              <p className="text-xs text-gray-500">{notification.time}</p>
              {notification.ai && (
                <div className="mt-2 flex space-x-2">
                  <button className="text-xs bg-blue-50 text-blue-500 px-2 py-1 rounded rounded-button whitespace-nowrap hover:bg-blue-100 transition-all duration-300">
                    <i className="fas fa-check mr-1"></i> Mark as done
                  </button>
                  <button className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded rounded-button whitespace-nowrap hover:bg-gray-100 transition-all duration-300">
                    <i className="fas fa-clock mr-1"></i> Snooze
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;