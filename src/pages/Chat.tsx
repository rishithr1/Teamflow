import React, { useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { ChatMessage, AttachedFile, RecentChat } from '../types';
import ChatSidebar from '../components/chat/ChatSidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import ThreadView from '../components/chat/ThreadView';
import { useNavigate } from 'react-router-dom';

const Chat: React.FC = () => {
  const { messages, sendMessage, teamMembers } = useWebSocket();
  const navigate = useNavigate();
  
  const [showThreadView, setShowThreadView] = useState<boolean>(false);
  const [searchMessages, setSearchMessages] = useState<string>("");
  const [showPinnedMessages, setShowPinnedMessages] = useState<boolean>(false);
  const [activeThreadMessage, setActiveThreadMessage] = useState<ChatMessage | null>(null);
  
  const recentChats: RecentChat[] = [
    { id: 1, name: "Project Alpha Discussion", type: "group", unread: 3 },
    { id: 2, name: "Backend Team", type: "group", unread: 0 },
    { id: 3, name: "Emily Thompson", type: "direct", unread: 1 },
    { id: 4, name: "Design Review", type: "group", unread: 5 },
  ];
  
  const handleSendMessage = (content: string, attachments: AttachedFile[]) => {
    const newMessage: Omit<ChatMessage, 'id'> = {
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
    
    sendMessage(newMessage);
  };
  
  const handleViewThread = (messageId: number) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setActiveThreadMessage(message);
      setShowThreadView(true);
    }
  };
  
  const handleSelectChat = (chatId: number) => {
    // In a real app, this would load the selected chat
    console.log(`Selected chat ID: ${chatId}`);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <ChatSidebar 
        teamMembers={teamMembers}
        recentChats={recentChats}
        onSelectChat={handleSelectChat}
        onBackToDashboard={() => navigate('/')}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Backend Team Chat
            </h1>
            <span className="text-sm text-gray-500">
              {teamMembers.filter(m => m.status === 'online').length} online
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className={`p-2 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors ${showPinnedMessages ? 'text-blue-500' : ''}`}
              onClick={() => setShowPinnedMessages(!showPinnedMessages)}
              title={showPinnedMessages ? 'Show all messages' : 'Show pinned messages only'}
            >
              <i className="fas fa-thumbtack"></i>
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                value={searchMessages}
                onChange={(e) => setSearchMessages(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
        </div>
        
        <MessageList 
          messages={messages} 
          onViewThread={handleViewThread} 
          searchQuery={searchMessages}
          showPinnedOnly={showPinnedMessages}
        />
        
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
      
      {/* Thread View */}
      {showThreadView && (
        <ThreadView 
          message={activeThreadMessage} 
          onClose={() => setShowThreadView(false)} 
        />
      )}
    </div>
  );
};

export default Chat;