// Backend API Response Format
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

// User Types
export interface User {
  _id?: string;
  user_name: string;
  user_type: string;
  createdAt?: string;
  updatedAt?: string;
}

// Product Types
export interface Product {
  _id: string;
  prod_name: string;
  category: string;
  prod_desc: string;
  prod_price: number;
  target_audience: string;
  createdAt?: string;
  image?: string; // <-- Add this line
}

// Product for Insight Types
export interface ProductForInsight {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interview Types
export interface Interview {
  _id?: string;
  user: string; // User ID
  product: string; // Product ID
  createdAt?: string;
  updatedAt?: string;
}

// Followup Types
export interface Followup {
  _id?: string;
  interview: string; // Interview ID
  followup_ques: string;
  followup_response: string;
  createdAt?: string;
  updatedAt?: string;
}

// Standard Interview Questions Types
export interface Stdiq {
  _id?: string;
  product: string; // Product ID
  questions: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Standard Interview Questions Responses Types
export interface Stdiqres {
  _id?: string;
  interview: string; // Interview ID
  ques: string; // Question ID
  responses: Record<string, any>; // Dynamic responses object
  createdAt?: string;
  updatedAt?: string;
}

// Frontend Interview Types (for existing components)
export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'behavioral' | 'technical' | 'situational' | 'general';
  category: string;
  expectedDuration: number;
  followUpQuestions?: string[];
}

export interface InterviewResponse {
  questionId: string;
  response: string;
  transcript: string;
  duration: number;
  timestamp: Date;
  confidence?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  keywords?: string[];
  isComplete: boolean;
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
