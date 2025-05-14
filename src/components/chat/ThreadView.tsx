import React, { useState } from 'react';
import { ChatMessage } from '../../types';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { AttachedFile } from '../../types';

interface ThreadViewProps {
  message: ChatMessage | null;
  onClose: () => void;
}

const ThreadView: React.FC<ThreadViewProps> = ({ message, onClose }) => {
  const [replies, setReplies] = useState<ChatMessage[]>([
    {
      id: 101,
      sender: 'Isabella Rodriguez',
      content: 'I really like the optimizations you made. The API response time is much better now.',
      timestamp: '10:32 AM',
      reactions: ['👍'],
      hasThread: false,
    },
    {
      id: 102,
      sender: 'William Chen',
      content: 'Could you explain how you achieved the 30% speed improvement?',
      timestamp: '10:35 AM',
      reactions: [],
      hasThread: false,
    },
    {
      id: 103,
      sender: 'Alexander Mitchell',
      content: 'I implemented query caching and optimized the database indexes. I\'ll send more details later.',
      timestamp: '10:37 AM',
      reactions: ['🚀', '💡'],
      hasThread: false,
    }
  ]);

  const handleSendReply = (content: string, attachments: AttachedFile[]) => {
    const newReply: ChatMessage = {
      id: Date.now(),
      sender: 'Alexander Mitchell', // Assuming current user
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      reactions: [],
      hasThread: false,
      attachments: attachments.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file.file)
      }))
    };
    
    setReplies([...replies, newReply]);
  };

  if (!message) return null;

  return (
    <div className="w-[280px] bg-white border-l border-gray-200 flex flex-col h-full animate-slideInRight">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Thread</h3>
        <button
          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">{message.sender}</span>
            <span className="text-sm text-gray-500">{message.timestamp}</span>
          </div>
          <p className="text-gray-700">{message.content}</p>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
        </div>
        
        {replies.map(reply => (
          <MessageItem
            key={reply.id}
            message={reply}
            onViewThread={() => {}} // No nested threads
          />
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-200">
        <MessageInput onSendMessage={handleSendReply} />
      </div>
    </div>
  );
};

export default ThreadView;