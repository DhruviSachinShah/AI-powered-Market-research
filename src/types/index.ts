export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'behavioral' | 'technical' | 'situational' | 'general';
  category: string;
  expectedDuration: number; // in seconds
  followUpQuestions?: string[];
}

export interface InterviewResponse {
  questionId: string;
  response: string;
  transcript: string; // Speech-to-text result
  duration: number;
  timestamp: Date;
  confidence?: number; // Speech recognition confidence score
  sentiment?: 'positive' | 'negative' | 'neutral';
  keywords?: string[];
  isComplete: boolean; // Whether the response is complete
}

export interface InterviewSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  status: 'active' | 'completed' | 'paused';
  candidateInfo?: {
    name: string;
    email: string;
    position: string;
  };
}

export interface AvatarState {
  isSpeaking: boolean;
  isListening: boolean;
  currentAnimation: 'idle' | 'speaking' | 'listening' | 'thinking';
  emotion: 'neutral' | 'happy' | 'concerned' | 'encouraging';
}
