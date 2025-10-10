import React, { useState } from 'react';
import { useInterviewStore } from '../../stores/interviewStore';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';

const ResponseInput: React.FC = () => {
  const { 
    isInterviewActive, 
    isLoading, 
    isWaitingForFollowUp,
    sendResponse,
    endInterview 
  } = useInterviewStore();

  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!response.trim() || isLoading || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      sendResponse(response.trim());
      setResponse('');
    } catch (error) {
      console.error('Error sending response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEndInterview = () => {
    if (window.confirm('Are you sure you want to end this interview? Your progress will be saved.')) {
      endInterview('User ended interview');
    }
  };

  const isDisabled = !isInterviewActive || isLoading || isSubmitting || !response.trim();

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your Response
          </h3>
          <p className="text-sm text-gray-600">
            {isWaitingForFollowUp 
              ? 'Please provide more detail about your previous answer.'
              : 'Share your thoughts and experiences in detail.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isWaitingForFollowUp
                ? 'Please elaborate on your previous answer...'
                : 'Type your response here...'
            }
            showCharCount
            maxLength={1000}
            rows={6}
            disabled={!isInterviewActive || isLoading}
            className="resize-none"
          />

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={isDisabled}
              isLoading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Sending...' : 'Send Response'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleEndInterview}
              disabled={!isInterviewActive}
            >
              End Interview
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Press Enter to send (Shift+Enter for new line)</p>
          <p>• Be specific and provide examples when possible</p>
          <p>• The AI may ask follow-up questions for clarity</p>
        </div>

        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-blue-700">
                AI is analyzing your response...
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResponseInput;
