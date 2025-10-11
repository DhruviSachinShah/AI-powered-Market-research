import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, RotateCcw, Volume2, VolumeX, Settings, Download } from 'lucide-react';
import Avatar3D from './Avatar3D';
import SpeechToText from './SpeechToText';
import type { InterviewQuestion, InterviewResponse, InterviewSession, AvatarState } from '../../types';
import { interviewService } from '../../services/interviewService';
import { sendResponseWithRetry } from '../../services/interviewApi';

const InterviewPage: React.FC = () => {
  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [avatarState, setAvatarState] = useState<AvatarState>({
    isSpeaking: false,
    isListening: false,
    currentAnimation: 'idle',
    emotion: 'neutral'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(0.8);

  // Refs
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Sample interview questions
  const sampleQuestions: InterviewQuestion[] = [
    {
      id: '1',
      question: "Hello! Welcome to your interview. Could you please introduce yourself and tell us about your background?",
      type: 'general',
      category: 'Introduction',
      expectedDuration: 120
    },
    {
      id: '2',
      question: "Can you describe a challenging project you worked on and how you overcame the obstacles?",
      type: 'behavioral',
      category: 'Problem Solving',
      expectedDuration: 180
    },
    {
      id: '3',
      question: "How do you handle working under pressure and tight deadlines?",
      type: 'situational',
      category: 'Work Style',
      expectedDuration: 150
    },
    {
      id: '4',
      question: "What are your strengths and areas where you'd like to improve?",
      type: 'general',
      category: 'Self Assessment',
      expectedDuration: 120
    },
    {
      id: '5',
      question: "Do you have any questions for us about the role or the company?",
      type: 'general',
      category: 'Questions',
      expectedDuration: 90
    }
  ];

  // Initialize session
  useEffect(() => {
    const newSession: InterviewSession = {
      id: `session_${Date.now()}`,
      startTime: new Date(),
      questions: sampleQuestions,
      responses: [],
      status: 'active'
    };
    setSession(newSession);
  }, []);

  // Text-to-speech functionality
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.volume = speechVolume;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setAvatarState(prev => ({
          ...prev,
          isSpeaking: true,
          currentAnimation: 'speaking',
          emotion: 'encouraging'
        }));
      };
      
      utterance.onend = () => {
        setAvatarState(prev => ({
          ...prev,
          isSpeaking: false,
          currentAnimation: 'idle',
          emotion: 'neutral'
        }));
      };
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle question progression
  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Interview completed
      if (session) {
        const completedSession = { ...session, status: 'completed' as const, endTime: new Date() };
        setSession(completedSession);
        interviewService.saveSession(completedSession);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestartInterview = () => {
    setCurrentQuestionIndex(0);
    if (session) {
      const restartedSession = { ...session, responses: [], status: 'active' as const };
      setSession(restartedSession);
      interviewService.saveSession(restartedSession);
    }
    window.speechSynthesis.cancel();
  };

  const handleDownloadSession = () => {
    if (session) {
      interviewService.downloadSession(session.id);
    }
  };

  // Send response to backend
  const sendResponseToBackend = async (response: InterviewResponse) => {
    if (!session) return;
    
    try {
      const currentQuestion = sampleQuestions[currentQuestionIndex];
      const success = await sendResponseWithRetry(
        response,
        session.id,
        currentQuestion.question,
        currentQuestion.type,
        currentQuestion.category
      );
      
      if (success) {
        console.log('Response sent to backend successfully');
        // You could show a success notification here
      } else {
        console.warn('Failed to send response to backend after retries');
        // You could show a warning notification here
      }
    } catch (error) {
      console.error('Error sending response to backend:', error);
      // You could show an error notification here
    }
  };

  // Handle speech-to-text
  const handleListeningStart = () => {
    setIsListening(true);
    setAvatarState(prev => ({
      ...prev,
      isListening: true,
      currentAnimation: 'listening',
      emotion: 'neutral'
    }));
  };

  const handleListeningStop = () => {
    setIsListening(false);
    setAvatarState(prev => ({
      ...prev,
      isListening: false,
      currentAnimation: 'idle',
      emotion: 'neutral'
    }));
  };

  const handleTranscriptionComplete = (transcript: string, duration: number, confidence: number) => {
    if (session) {
      const response: InterviewResponse = {
        questionId: sampleQuestions[currentQuestionIndex].id,
        response: transcript,
        transcript: transcript,
        duration,
        timestamp: new Date(),
        confidence,
        isComplete: true
      };

      const updatedSession = {
        ...session,
        responses: [...session.responses, response]
      };

      setSession(updatedSession);
      // Auto-save session
      interviewService.saveSession(updatedSession);
      
      // Send to backend (we'll implement this next)
      sendResponseToBackend(response);
    }
  };

  // Auto-speak current question
  useEffect(() => {
    if (session && sampleQuestions[currentQuestionIndex]) {
      const currentQuestion = sampleQuestions[currentQuestionIndex];
      speakText(currentQuestion.question);
    }
  }, [currentQuestionIndex, session, speechRate, speechVolume]);

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100;

  if (!session || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Interview Session</h1>
              <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {sampleQuestions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownloadSession}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Download Session Data"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="text-sm text-gray-600">
                {session.startTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div 
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Avatar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-96">
              <Avatar3D avatarState={avatarState} />
            </div>
          </div>

          {/* Controls and Question Section */}
          <div className="space-y-6">
            {/* Current Question */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {currentQuestion.category}
                </span>
                <span className="text-sm text-gray-500">
                  {currentQuestion.expectedDuration}s expected
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {currentQuestion.question}
              </h3>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => speakText(currentQuestion.question)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {avatarState.isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{avatarState.isSpeaking ? 'Stop' : 'Repeat'}</span>
                </button>
              </div>
            </div>

            {/* Speech-to-Text */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Response</h4>
              <SpeechToText
                onTranscriptionComplete={handleTranscriptionComplete}
                isListening={isListening}
                onListeningStart={handleListeningStart}
                onListeningStop={handleListeningStop}
                maxDuration={currentQuestion.expectedDuration + 60}
                language="en-US"
              />
            </div>

            {/* Navigation Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <SkipForward className="w-4 h-4 rotate-180" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleRestartInterview}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <span>{currentQuestionIndex === sampleQuestions.length - 1 ? 'Finish' : 'Next'}</span>
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Session Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Session Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions Answered:</span>
                  <span className="font-medium">{session.responses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Duration:</span>
                  <span className="font-medium">
                    {Math.round((Date.now() - session.startTime.getTime()) / 1000 / 60)} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    session.status === 'active' ? 'text-green-600' : 
                    session.status === 'completed' ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speech Rate: {speechRate}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speech Volume: {Math.round(speechVolume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={speechVolume}
                    onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewPage;
