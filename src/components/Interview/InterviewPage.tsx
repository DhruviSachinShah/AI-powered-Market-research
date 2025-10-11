import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, RotateCcw, Volume2, VolumeX, Settings, Mic, StopCircle } from 'lucide-react';
import Avatar3D from './Avatar3D';
import type { AvatarState } from '../../types';

interface InterviewQuestion {
  id: string;
  question: string;
  type: string;
  category: string;
  expectedDuration: number;
}

interface InterviewResponse {
  questionId: string;
  response: string;
  transcript: string;
  duration: number;
  timestamp: Date;
  confidence: number;
  isComplete: boolean;
}

interface InterviewSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  status: 'active' | 'completed' | 'paused';
}


const InterviewPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [avatarState, setAvatarState] = useState<AvatarState>({
    isSpeaking: false,
    isListening: false,
    currentAnimation: 'idle',
    emotion: 'neutral'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(0.8);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const fallbackQuestions: InterviewQuestion[] = [
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

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setAvatarState(prev => ({
          ...prev,
          isListening: false,
          currentAnimation: 'idle'
        }));
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Initialize session with real questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('http://localhost:9999/api/stdiq', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();

        const fetchedQuestions: InterviewQuestion[] =
          ((data.data?.[0]?.questions) || []).map((q: string, index: number) => ({
            id: `${index + 1}`,
            question: q,
            type: 'general',
            category: `Category ${index + 1}`,
            expectedDuration: 120,
          }));

        setSession({
          id: `session_${Date.now()}`,
          startTime: new Date(),
          questions: fetchedQuestions,
          responses: [],
          status: 'active',
        });
      } catch (error) {
        console.error('❌ Error fetching questions:', error);
        setSession({
          id: `session_${Date.now()}`,
          startTime: new Date(),
          questions: fallbackQuestions,
          responses: [],
          status: 'active',
        });
      }
    };

    fetchQuestions();
  }, []);

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

      // Store utterance reference for potential cancellation
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setAvatarState(prev => ({
        ...prev,
        isSpeaking: false,
        currentAnimation: 'idle'
      }));
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setCurrentTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      setAvatarState(prev => ({
        ...prev,
        isListening: true,
        currentAnimation: 'listening',
        emotion: 'concerned'
      }));
    }
  };

  // Auto-speak current question
  useEffect(() => {
    if (session && session.questions[currentQuestionIndex]) {
      const currentQuestion = session.questions[currentQuestionIndex];
      speakText(currentQuestion.question);
    }
  }, [currentQuestionIndex, session, speechRate, speechVolume]);

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);

      // Save the response
      if (currentTranscript.trim() && session) {
        const questionId = session.questions[currentQuestionIndex].id;
        setUserResponses(prev => ({
          ...prev,
          [questionId]: currentTranscript.trim()
        }));
      }
    }
  };

  const handleNextQuestion = () => {
    // Save current response if exists
    if (currentTranscript.trim() && session) {
      const questionId = session.questions[currentQuestionIndex].id;
      setUserResponses(prev => ({
        ...prev,
        [questionId]: currentTranscript.trim()
      }));
    }

    if (currentQuestionIndex < fallbackQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentTranscript('');
      stopSpeaking();
    } else {
      // Complete interview
      if (session) {
        setSession({
          ...session,
          status: 'completed',
          endTime: new Date()
        });
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setCurrentTranscript('');
      stopSpeaking();

      // Load previous response
      const prevQuestionId = fallbackQuestions[currentQuestionIndex - 1].id;
      setCurrentTranscript(userResponses[prevQuestionId] || '');
    }
  };

  const handleRestartInterview = () => {
    setCurrentQuestionIndex(0);
    setCurrentTranscript('');
    setUserResponses({});
    stopSpeaking();
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (session) {
      setSession({
        ...session,
        responses: [],
        status: 'active',
        startTime: new Date()
      });
    }
  };

  const submitAllResponses = async () => {
    console.log('Submitting all responses:', userResponses);

    try {
      const payload = {
        interview: "68e9af908b2b525f106f925a",
        ques:"68e9afc78b2b525f106f925c",
        responses: userResponses
      };

      const res = await fetch('http://localhost:9999/api/stdiqres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to submit');
      const data = await res.json();
      console.log('✅ Responses submitted:', data);
      alert('Interview submitted successfully!');
    } catch (error) {
      console.error('❌ Error submitting:', error);
      alert('Failed to submit responses');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;
  const isCompleted = session.status === 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Interview Session</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {session.questions.length}
              </p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

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
        {!isCompleted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 h-96">
                <Avatar3D avatarState={avatarState} />
              </div>
            </div>

            {/* Controls Section */}
            <div className="space-y-6">
              {/* Current Question */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {currentQuestion.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentQuestion.question}
                </h3>

                <button
                  onClick={() => avatarState.isSpeaking ? stopSpeaking() : speakText(currentQuestion.question)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors w-full justify-center"
                >
                  {avatarState.isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{avatarState.isSpeaking ? 'Stop' : 'Repeat Question'}</span>
                </button>
              </div>

              {/* Response Input */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Response</h4>

                <div className="mb-4">
                  <textarea
                    value={currentTranscript}
                    onChange={(e) => setCurrentTranscript(e.target.value)}
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your answer will appear here as you speak, or you can type it..."
                  />
                </div>

                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full justify-center ${isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                >
                  {isListening ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span>{isListening ? 'Stop Recording' : 'Start Recording'}</span>
                </button>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center gap-2">
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
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <span>{currentQuestionIndex === session.questions.length - 1 ? 'Finish' : 'Next'}</span>
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Completion Screen
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Interview Completed!</h2>
              <p className="text-gray-600 mb-8">Thank you for completing the interview.</p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Responses</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto text-left">
                  {session.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-white rounded-lg shadow">
                      <p className="font-medium text-gray-900 mb-2">Q{idx + 1}: {q.question}</p>
                      <p className="text-gray-700 pl-4 border-l-4 border-blue-500">
                        {userResponses[q.id] || <em className="text-gray-400">No response</em>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRestartInterview}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Start New Interview
                </button>
                <button
                  onClick={submitAllResponses}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Submit Responses
                </button>
              </div>
            </div>
          </div>
        )}
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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>

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
                    Volume: {Math.round(speechVolume * 100)}%
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

                <div className="pt-4 border-t">
                  <button
                    onClick={() => speakText('Audio test - this is working!')}
                    className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Test Audio
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="mt-6 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewPage;