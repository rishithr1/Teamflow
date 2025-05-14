import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: ChatMessage[];
  onViewThread: (messageId: number) => void;
  searchQuery?: string;
  showPinnedOnly?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onViewThread,
  searchQuery = '',
  showPinnedOnly = false
}) => {
  const messageListRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Filter messages based on search query and pinned status
  const filteredMessages = messages.filter(msg => {
    // Filter by pinned status if enabled
    if (showPinnedOnly && !msg.isPinned) {
      return false;
    }
    
    // Filter by search query if present
    if (searchQuery && !msg.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div ref={messageListRef} className="flex-1 overflow-y-auto p-6">
      {filteredMessages.length === 0 && (
        <div className="text-center text-gray-500 italic py-8">
          {searchQuery ? 'No messages match your search' : 'No messages yet'}
        </div>
      )}
      
      {filteredMessages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          onViewThread={() => onViewThread(message.id)} 
        />
      ))}
    </div>
  );
};

export default MessageList;