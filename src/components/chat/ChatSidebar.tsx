import React, { useState } from 'react';
import { TeamMember, RecentChat } from '../../types';
import Avatar from '../common/Avatar';

interface ChatSidebarProps {
  teamMembers: TeamMember[];
  recentChats: RecentChat[];
  onSelectChat: (chatId: number) => void;
  onBackToDashboard: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  teamMembers, 
  recentChats, 
  onSelectChat,
  onBackToDashboard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter team members based on search query
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onBackToDashboard}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-server text-xl"></i>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Backend Team</h2>
            <p className="text-sm text-gray-500">
              {teamMembers.length} members
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {recentChats.length > 0 && (
          <>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Recent Chats
            </h3>
            {recentChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer mb-2 transition-all duration-300 hover:translate-x-1"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <i className={`fas ${chat.type === "group" ? "fa-users" : "fa-user"} text-gray-500`}></i>
                  </div>
                  <span className="text-sm text-gray-700">{chat.name}</span>
                </div>
                {chat.unread > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                    {chat.unread}
                  </span>
                )}
              </div>
            ))}
            <div className="border-t border-gray-200 my-4"></div>
          </>
        )}
        
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Team Members
        </h3>
        
        {filteredMembers.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No members match your search</p>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer mb-2 transition-all duration-300"
            >
              <Avatar name={member.name} status={member.status} />
              <div>
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;