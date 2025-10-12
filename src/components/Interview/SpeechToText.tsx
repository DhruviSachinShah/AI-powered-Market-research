import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, RotateCcw, AlertCircle } from 'lucide-react';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechToTextProps {
  onTranscriptionComplete: (transcript: string, duration: number, confidence: number) => void;
  isListening: boolean;
  onListeningStart: () => void;
  onListeningStop: () => void;
  maxDuration?: number; // in seconds
  language?: string;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({
  onTranscriptionComplete,
  isListening,
  onListeningStart,
  onListeningStop,
  maxDuration = 300, // 5 minutes default
  language = 'en-US'
}) => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [duration, setDuration] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      setupRecognition();
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      startListening();
    } else {
      stopListening();
    }
  }, [isListening]);

  const setupRecognition = () => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      setDuration(0);
      setConfidence(0);
      startTimeRef.current = Date.now();
      
      // Start duration timer
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);
        
        if (elapsed >= maxDuration) {
          stopListening();
        }
      }, 1000);
    };

    recognition.onresult = (event: { resultIndex: any; results: string | any[]; }) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let totalConfidence = 0;
      let resultCount = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          finalTranscript += transcript;
          totalConfidence += result[0].confidence || 0;
          resultCount++;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript('');
        if (resultCount > 0) {
          setConfidence(totalConfidence / resultCount);
        }
      } else {
        setInterimTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: { error: any; }) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      stopListening();
    };

    recognition.onend = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      const finalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const finalTranscript = transcript + interimTranscript;
      
      if (finalTranscript.trim()) {
        onTranscriptionComplete(finalTranscript, finalDuration, confidence);
      }
      
      onListeningStop();
    };
  };

  const startListening = () => {
    if (!recognitionRef.current || !isSupported) return;
    
    try {
      recognitionRef.current.start();
      onListeningStart();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Failed to start speech recognition');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTranscription = () => {
    setTranscript('');
    setInterimTranscript('');
    setDuration(0);
    setConfidence(0);
    setError(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-800">Speech Recognition Not Supported</h3>
          <p className="text-sm text-red-600 mt-2">
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Status Display */}
      <div className="flex items-center space-x-4">
        <div className={`w-4 h-4 rounded-full ${
          isListening ? 'bg-green-500 animate-pulse' : 
          transcript ? 'bg-blue-500' : 'bg-gray-300'
        }`} />
        <span className="text-sm font-medium">
          {isListening ? 'Listening...' : transcript ? 'Transcription Complete' : 'Ready to listen'}
        </span>
        <span className="text-sm text-gray-500">
          {formatTime(duration)} / {formatTime(maxDuration)}
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center space-x-4">
        {!isListening ? (
          <button
            onClick={() => onListeningStart()}
            className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200 shadow-lg"
          >
            <Mic className="w-5 h-5" />
            <span>Start Listening</span>
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 shadow-lg"
          >
            <Square className="w-5 h-5" />
            <span>Stop Listening</span>
          </button>
        )}

        {transcript && (
          <button
            onClick={resetTranscription}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Transcript Display */}
      {(transcript || interimTranscript) && (
        <div className="w-full max-w-2xl">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Your Response:</h4>
              {confidence > 0 && (
                <span className="text-xs text-gray-500">
                  Confidence: {Math.round(confidence * 100)}%
                </span>
              )}
            </div>
            <div className="text-gray-900 leading-relaxed">
              {transcript && (
                <span className="text-gray-900">{transcript}</span>
              )}
              {interimTranscript && (
                <span className="text-gray-500 italic">{interimTranscript}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {isListening && (
        <div className="w-full max-w-md">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(duration / maxDuration) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 max-w-md">
        <p>
          {isListening 
            ? "Speak clearly into your microphone. Your speech will be transcribed in real-time."
            : "Click 'Start Listening' to begin speaking your response."
          }
        </p>
      </div>
    </div>
  );
};

export default SpeechToText;
