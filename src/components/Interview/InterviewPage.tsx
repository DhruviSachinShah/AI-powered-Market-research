import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../stores/interviewStore';
import ChatInterface from './Interview/ChatInterface';
import ResponseInput from './Interview/ResponseInput';
import Card from './ui/Card';
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';

const InterviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isConnected,
    isInterviewActive,
    isLoading,
    error,
    startInterview,
    endInterview,
    resetInterview
  } = useInterviewStore();

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Get interview data from navigation state
    const interviewData = location.state as {
      respondentName: string;
      respondentEmail: string;
      templateId: string;
    };

    if (!interviewData && !hasStarted) {
      // Redirect to landing page if no data
      navigate('/', { replace: true });
      return;
    }

    if (interviewData && !hasStarted && isConnected) {
      // Start the interview
      startInterview(interviewData);
      setHasStarted(true);
    }
  }, [location.state, hasStarted, isConnected, startInterview, navigate]);

  const handleEndInterview = () => {
    endInterview('User ended interview');
    navigate('/dashboard');
  };

  const handleInterviewComplete = () => {
    // Navigate to results page when interview completes
    // The interview ID will be available in the store
    navigate('/dashboard');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Interview Error
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  resetInterview();
                  navigate('/');
                }}
              >
                Back to Home
              </Button>
              <Button
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              AI Market Research Interview
            </h1>
            <p className="text-sm text-gray-600">
              {isInterviewActive ? 'Interview in progress' : 'Preparing interview...'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            
            {isInterviewActive && (
              <Button
                variant="outline"
                size="small"
                onClick={handleEndInterview}
              >
                End Interview
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>

          {/* Response Input */}
          <div className="lg:col-span-1">
            <ResponseInput />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-sm mx-auto">
            <div className="text-center">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-600">
                AI is thinking...
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
