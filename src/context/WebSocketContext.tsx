import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ChatMessage, TeamMember } from '../types';

// Mock WebSocket class to simulate real WebSocket behavior
class MockWebSocket {
  private callbacks: { [key: string]: ((event: any) => void)[] } = {};
  private url: string;
  private isConnected = false;
  
  constructor(url: string) {
    this.url = url;
    
    // Simulate connection
    setTimeout(() => {
      this.isConnected = true;
      this.triggerEvent('open', {});
    }, 500);
  }
  
  addEventListener(event: string, callback: (event: any) => void) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }
  
  removeEventListener(event: string, callback: (event: any) => void) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }
  
  send(data: string) {
    // For demo purposes, we'll echo back the message with a slight delay
    setTimeout(() => {
      try {
        const parsedData = JSON.parse(data);
        
        if (parsedData.type === 'message') {
          this.triggerEvent('message', {
            data: JSON.stringify({
              type: 'message',
              payload: parsedData.payload
            })
          });
        }
      } catch (e) {
        console.error('Error processing message:', e);
      }
    }, 300);
  }
  
  close() {
    this.isConnected = false;
    this.triggerEvent('close', {});
  }
  
  triggerEvent(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }
}

// WebSocket context types
interface WebSocketContextType {
  messages: ChatMessage[];
  sendMessage: (message: Omit<ChatMessage, 'id'>) => void;
  teamMembers: TeamMember[];
  updateTeamMember: (member: TeamMember) => void;
  connected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
  initialMessages: ChatMessage[];
  initialTeamMembers: TeamMember[];
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  initialMessages = [],
  initialTeamMembers = []
}) => {
  const [socket, setSocket] = useState<MockWebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    // Create WebSocket connection
    const ws = new MockWebSocket('wss://mock-teamflow-server.example');
    
    ws.addEventListener('open', () => {
      console.log('WebSocket connected');
      setConnected(true);
    });
    
    ws.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
          const newMessage = data.payload;
          setMessages(prev => [...prev, { ...newMessage, id: prev.length + 1 }]);
        } else if (data.type === 'team_update') {
          setTeamMembers(data.payload);
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });
    
    ws.addEventListener('close', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, []);
  
  const sendMessage = (message: Omit<ChatMessage, 'id'>) => {
    if (socket && connected) {
      const newMessage = {
        ...message,
        id: messages.length + 1
      };
      
      socket.send(JSON.stringify({
        type: 'message',
        payload: newMessage
      }));
      
      // Optimistically update local state
      setMessages(prev => [...prev, newMessage]);
    }
  };
  
  const updateTeamMember = (member: TeamMember) => {
    if (socket && connected) {
      socket.send(JSON.stringify({
        type: 'team_update',
        payload: member
      }));
      
      // Optimistically update local state
      setTeamMembers(prev => 
        prev.map(m => m.id === member.id ? member : m)
      );
    }
  };
  
  return (
    <WebSocketContext.Provider 
      value={{ 
        messages, 
        sendMessage, 
        teamMembers, 
        updateTeamMember, 
        connected 
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};