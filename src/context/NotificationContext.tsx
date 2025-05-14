import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Notification {
  id: number;
  type: 'mention' | 'deadline' | 'update';
  text: string;
  time: string;
  ai?: boolean;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'mention',
      text: '@John Doe mentioned you in Project Alpha discussion',
      time: '5m ago',
      read: false
    },
    {
      id: 2,
      type: 'deadline',
      text: 'Upcoming deadline: UI Design Review',
      time: '1h ago',
      ai: true,
      read: false
    },
    {
      id: 3,
      type: 'update',
      text: 'New version deployed to staging',
      time: '2h ago',
      read: false
    },
    {
      id: 4,
      type: 'deadline',
      text: 'AI Reminder: Project Alpha presentation due tomorrow',
      time: '10m ago',
      ai: true,
      read: false
    }
  ]);
  
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Calculate unread count whenever notifications change
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);
  
  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  const dismissNotification = (id: number) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== id)
    );
  };
  
  // Simulate new notifications occasionally
  useEffect(() => {
    const aiReminders = [
      'Remember to update the project timeline',
      'Weekly status report due in 2 hours',
      'Check the recent code changes from the dev team',
      'Prepare materials for tomorrow\'s client meeting'
    ];
    
    const interval = setInterval(() => {
      // 20% chance of new notification every 45 seconds
      if (Math.random() < 0.2) {
        const reminder = aiReminders[Math.floor(Math.random() * aiReminders.length)];
        addNotification({
          type: 'deadline',
          text: `AI Reminder: ${reminder}`,
          time: 'Just now',
          ai: true
        });
      }
    }, 45000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount,
        addNotification, 
        markAsRead, 
        markAllAsRead,
        dismissNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};