import React, { useState, useRef } from 'react';
import { AttachedFile } from '../../types';
import { formatBytes } from '../../utils/formatters';

interface MessageInputProps {
  onSendMessage: (content: string, attachments: AttachedFile[]) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const emojis = ["👍", "❤️", "😊", "🎉", "👏", "🚀", "💡", "✅"];
  
  const handleSendMessage = () => {
    if (message.trim() !== '' || attachedFiles.length > 0) {
      onSendMessage(message, attachedFiles);
      setMessage('');
      setAttachedFiles([]);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        type: file.type,
        size: file.size,
        progress: 0,
        uploading: true,
      }));
      
      setAttachedFiles([...attachedFiles, ...newFiles]);
      
      // Simulate upload progress
      newFiles.forEach(fileObj => {
        const interval = setInterval(() => {
          setAttachedFiles(prev => 
            prev.map(f => 
              f.id === fileObj.id
                ? {
                    ...f,
                    progress: Math.min(f.progress + 10, 100),
                    uploading: f.progress + 10 < 100,
                  }
                : f
            )
          );
        }, 300);
        
        // Clear interval when component unmounts
        return () => clearInterval(interval);
      });
    }
  };
  
  const handleRemoveFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-end space-x-4">
        <div className="flex-1 bg-gray-50 rounded-lg p-4">
          <div className="mb-4 flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
              <i className="fas fa-bold"></i>
            </button>
            <button className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
              <i className="fas fa-italic"></i>
            </button>
            <button className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
              <i className="fas fa-link"></i>
            </button>
            <button className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
              <i className="fas fa-code"></i>
            </button>
          </div>
          
          <textarea
            placeholder="Type your message..."
            className="w-full border-none bg-transparent focus:outline-none resize-none"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          ></textarea>
          
          {attachedFiles.length > 0 && (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Attached files ({attachedFiles.length})
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <i
                        className={`fas ${
                          file.type.startsWith("image/")
                            ? "fa-image text-blue-500"
                            : file.type.includes("pdf")
                              ? "fa-file-pdf text-red-500"
                              : file.type.includes("word")
                                ? "fa-file-word text-blue-700"
                                : file.type.includes("excel") ||
                                  file.type.includes("sheet")
                                  ? "fa-file-excel text-green-600"
                                  : file.type.includes("zip") ||
                                    file.type.includes("archive")
                                    ? "fa-file-archive text-yellow-600"
                                    : file.type.includes("video")
                                      ? "fa-file-video text-purple-500"
                                      : file.type.includes("audio")
                                        ? "fa-file-audio text-green-500"
                                        : file.type.includes("code") ||
                                          file.type.includes("text")
                                          ? "fa-file-code text-gray-700"
                                          : "fa-file text-gray-500"
                        } text-lg`}
                      ></i>
                      <div className="truncate">
                        <div className="text-sm font-medium truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatBytes(file.size)}
                        </div>
                      </div>
                    </div>
                    {file.uploading ? (
                      <div className="w-24">
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-0.5">
                          {file.progress}%
                        </div>
                      </div>
                    ) : (
                      <button
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors rounded-button whitespace-nowrap"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <i className="far fa-smile"></i>
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200 z-10">
                <div className="grid grid-cols-4 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      className="text-xl hover:bg-gray-100 p-2 rounded cursor-pointer transition-colors"
                      onClick={() => {
                        setMessage(message + emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              ref={fileInputRef}
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer rounded-button whitespace-nowrap transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fas fa-paperclip"></i>
            </button>
          </div>
          
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg rounded-button whitespace-nowrap hover:bg-blue-600 transition-colors ${
              message.trim() === '' && attachedFiles.length === 0 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:bg-blue-600 cursor-pointer'
            }`}
            onClick={handleSendMessage}
            disabled={message.trim() === '' && attachedFiles.length === 0}
          >
            <i className="fas fa-paper-plane mr-2"></i>Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;