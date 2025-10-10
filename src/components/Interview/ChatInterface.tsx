import React, { useEffect, useRef } from 'react';
import { useInterviewStore } from '../../stores/interviewStore';
import Card from '../ui/Card';

const ChatInterface: React.FC = () => {
  const { messages, isInterviewActive } = useInterviewStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getMessageIcon = (message: any) => {
    if (message.isAI) {
      return (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">AI</span>
        </div>
      );
    }
    
    return (
      <div className="flex-shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-semibold">You</span>
      </div>
    );
  };

  const getMessageStyle = (message: any) => {
    if (message.type === 'system') {
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
    
    if (message.isAI) {
      return 'bg-blue-50 border-blue-200 text-blue-900';
    }
    
    return 'bg-gray-50 border-gray-200 text-gray-900';
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-96 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Interview Conversation
        </h3>
        <div className="text-sm text-gray-500">
          {messages.length} messages
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Waiting for the interview to begin...</p>
            <p className="text-sm mt-2">
              The AI will ask you questions about your preferences and experiences.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${
                message.isAI ? 'justify-start' : 'justify-end'
              }`}
            >
              {message.isAI && getMessageIcon(message)}
              
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg border ${
                getMessageStyle(message)
              }`}>
                <div className="text-sm">
                  {message.content}
                </div>
                
                {message.probeReason && (
                  <div className="mt-2 text-xs text-gray-600 italic">
                    Probing for: {message.probeReason}
                  </div>
                )}
                
                <div className="mt-1 text-xs text-gray-500">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
              
              {!message.isAI && getMessageIcon(message)}
            </div>
          ))
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {isInterviewActive && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Interview active - Type your response below</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ChatInterface;
