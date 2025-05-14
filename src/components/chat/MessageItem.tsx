import React, { useState } from 'react';
import { ChatMessage } from '../../types';
import { formatBytes } from '../../utils/formatters';
import Avatar from '../common/Avatar';

interface MessageItemProps {
  message: ChatMessage;
  onViewThread: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onViewThread }) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  
  const emojis = ["👍", "❤️", "😊", "🎉", "👏", "🚀", "💡", "✅"];
  
  const toggleReactionPicker = () => {
    setShowReactionPicker(!showReactionPicker);
  };
  
  return (
    <div className="mb-6 group animate-fadeIn">
      <div className="flex items-start space-x-3">
        <Avatar name={message.sender} status="online" />
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{message.sender}</span>
            <span className="text-sm text-gray-500">{message.timestamp}</span>
            {message.isPinned && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                <i className="fas fa-thumbtack mr-1"></i>Pinned
              </span>
            )}
          </div>
          
          <p className="mt-1 text-gray-700">{message.content}</p>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <div key={attachment.id} className="group">
                  {attachment.type.startsWith("image/") ? (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="max-w-xs rounded border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {attachment.name} ({formatBytes(attachment.size)})
                      </div>
                    </div>
                  ) : (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-2 border border-gray-200 rounded bg-gray-50 hover:bg-gray-100 max-w-xs transition-colors"
                    >
                      <i
                        className={`fas ${
                          attachment.type.includes("pdf")
                            ? "fa-file-pdf text-red-500"
                            : attachment.type.includes("word")
                              ? "fa-file-word text-blue-700"
                              : attachment.type.includes("excel") ||
                                attachment.type.includes("sheet")
                                ? "fa-file-excel text-green-600"
                                : "fa-file text-gray-500"
                        } text-lg mr-3`}
                      ></i>
                      <div className="overflow-hidden">
                        <div className="text-sm font-medium truncate">
                          {attachment.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatBytes(attachment.size)}
                        </div>
                      </div>
                      <i className="fas fa-download ml-3 text-gray-400 group-hover:text-gray-600"></i>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-2 flex items-center space-x-4">
            <div className="flex flex-wrap -space-x-1">
              {message.reactions.map((reaction, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  {reaction}
                </span>
              ))}
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
              <button 
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={toggleReactionPicker}
              >
                <i className="far fa-smile"></i>
              </button>
              
              {message.hasThread && (
                <button
                  className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer"
                  onClick={onViewThread}
                >
                  <i className="fas fa-reply mr-1"></i>
                  View thread
                </button>
              )}
              
              <button className="text-sm text-gray-500 hover:text-gray-700">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
          
          {showReactionPicker && (
            <div className="mt-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200 absolute">
              <div className="grid grid-cols-4 gap-2">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className="text-xl hover:bg-gray-100 p-2 rounded cursor-pointer transition-colors"
                    onClick={() => {
                      // Would add reaction functionality here
                      setShowReactionPicker(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;