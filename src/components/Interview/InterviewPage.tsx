import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, RotateCcw, Volume2, VolumeX, Settings, Mic, StopCircle, Check, Clock, User, Award, ChevronRight, X } from 'lucide-react';
import BrainAnimation from './BrainAnimation';
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

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

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
        ques: "68e9afc78b2b525f106f925c",
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading your interview...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;
  const isCompleted = session.status === 'completed';

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col overflow-hidden">
      {/* Compact Professional Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Interview Session
                </h1>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <p className="text-xs text-gray-600">
                    Question {currentQuestionIndex + 1} of {session.questions.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Compact Progress Bar */}
              <div className="w-32 bg-gray-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 lg:px-6 py-4 overflow-hidden">
        {!isCompleted ? (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Avatar Section - Left Side */}
            <div className="lg:col-span-7 flex flex-col">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-4 flex-1 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30" />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <BrainAnimation avatarState={avatarState} />
                </div>
                
                {/* Status Indicator */}
                <div className="absolute top-3 right-3 z-20">
                  <motion.div
                    animate={{
                      scale: avatarState.isSpeaking || avatarState.isListening ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`px-3 py-1 rounded-full text-xs font-medium shadow-md ${
                      avatarState.isSpeaking 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : avatarState.isListening
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {avatarState.isSpeaking ? '🎙️ Speaking' : avatarState.isListening ? '👂 Listening' : '💭 Idle'}
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Controls Section - Right Side */}
            <div className="lg:col-span-5 flex flex-col space-y-3">
              {/* Current Question Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 flex-shrink-0"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-semibold rounded-full">
                    {currentQuestion.category}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    ~{Math.floor(currentQuestion.expectedDuration / 60)}m
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-3 leading-relaxed line-clamp-3">
                  {currentQuestion.question}
                </h3>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => avatarState.isSpeaking ? stopSpeaking() : speakText(currentQuestion.question)}
                  className="flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 w-full shadow-md text-sm font-medium"
                >
                  {avatarState.isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{avatarState.isSpeaking ? 'Stop Audio' : 'Repeat Question'}</span>
                </motion.button>
              </motion.div>

              {/* Response Input Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 flex-1 flex flex-col"
              >
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center mr-2">
                    <Mic className="w-3 h-3 text-white" />
                  </div>
                  Your Response
                </h4>

                <div className="flex-1 flex flex-col">
                  <textarea
                    value={currentTranscript}
                    onChange={(e) => setCurrentTranscript(e.target.value)}
                    className="flex-1 min-h-[120px] p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-800 placeholder-gray-400 text-sm"
                    placeholder="Click 'Start Recording' to speak, or type your answer here..."
                  />
                  {currentTranscript && (
                    <p className="text-xs text-gray-500 mt-2">
                      {currentTranscript.split(' ').length} words
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={isListening ? stopListening : startListening}
                  className={`mt-3 flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg transition-all duration-200 w-full font-medium shadow-md text-sm ${
                    isListening
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                  }`}
                >
                  {isListening ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isListening ? 'Stop Recording' : 'Start Recording'}</span>
                </motion.button>
              </motion.div>

              {/* Navigation Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 flex-shrink-0"
              >
                <div className="grid grid-cols-3 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex flex-col items-center justify-center space-y-1 px-3 py-3 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:from-gray-50 disabled:to-gray-100 disabled:cursor-not-allowed text-gray-700 disabled:text-gray-400 rounded-xl transition-all duration-200 font-medium"
                  >
                    <SkipForward className="w-4 h-4 rotate-180" />
                    <span className="text-xs">Previous</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRestartInterview}
                    className="flex flex-col items-center justify-center space-y-1 px-3 py-3 bg-gradient-to-br from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 text-yellow-700 rounded-xl transition-all duration-200 font-medium"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-xs">Restart</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextQuestion}
                    className="flex flex-col items-center justify-center space-y-1 px-3 py-3 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-200 font-medium shadow-md"
                  >
                    {currentQuestionIndex === session.questions.length - 1 ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span className="text-xs">{currentQuestionIndex === session.questions.length - 1 ? 'Finish' : 'Next'}</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          // Completion Screen - Compact
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex flex-col overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 flex flex-col border border-gray-100 overflow-hidden">
              <div className="text-center mb-6 flex-shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Award className="w-8 h-8 text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Interview Completed!
                </h2>
                <p className="text-gray-600 text-sm">
                  Excellent work! Your responses have been recorded successfully.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100 flex-1 flex flex-col overflow-hidden">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                  Your Responses Summary
                </h3>
                <div className="space-y-3 flex-1 overflow-y-auto text-left pr-2">
                  {session.questions.map((q, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={q.id}
                      className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start space-x-3 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs">Q{idx + 1}</span>
                        </div>
                        <p className="font-semibold text-gray-900 leading-relaxed text-sm">{q.question}</p>
                      </div>
                      <div className="pl-9">
                        <p className="text-gray-700 leading-relaxed text-sm pl-3 border-l-2 border-blue-500 bg-blue-50/50 p-2 rounded-r-md">
                          {userResponses[q.id] || <em className="text-gray-400">No response recorded</em>}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-3 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRestartInterview}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-200 font-medium shadow-md flex items-center space-x-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Start New Interview</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={submitAllResponses}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md flex items-center space-x-2 text-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Responses</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Settings Modal - Compact */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Audio Settings
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSettings(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Speech Rate: <span className="text-blue-600">{speechRate}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Volume: <span className="text-blue-600">{Math.round(speechVolume * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={speechVolume}
                    onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Quiet</span>
                    <span>Loud</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => speakText('Audio test - this is working perfectly!')}
                    className="w-full px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 font-medium shadow-md flex items-center justify-center space-x-2 text-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Test Audio</span>
                  </motion.button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSettings(false)}
                className="mt-4 w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md text-sm"
              >
                Close Settings
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewPage;