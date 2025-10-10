export interface IResponse {
  questionId: string;
  questionText: string;
  questionType: 'initial' | 'follow-up';
  userAnswer: string;
  aiProbe?: string;
  scores: {
    relevance: number;
    depth: number;
    consistency: number;
    sentimentAlignment: number;
    composite: number;
  };
  vectorEmbedding: number[];
  timestamp: Date;
}

export interface IInterviewInsights {
  keyThemes: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  completionRate: number;
}

export interface IInterviewMetadata {
  duration: number; // seconds
  questionCount: number;
  followUpCount: number;
}

export interface IInterview {
  _id: string;
  respondentName: string;
  respondentEmail: string;
  templateId: string;
  status: 'in-progress' | 'completed' | 'abandoned';
  startedAt: Date;
  completedAt?: Date;
  responses: IResponse[];
  overallScore: number;
  insights: IInterviewInsights;
  metadata: IInterviewMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  id: string;
  text: string;
  order: number;
  expectedThemes: string[];
  expectedSentiment: string;
  probingStrategy: 'depth' | 'clarification' | 'example' | 'comparison';
}

export interface IInterviewTemplate {
  _id: string;
  title: string;
  description: string;
  targetAudience: string;
  questions: IQuestion[];
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  id: string;
  type: 'question' | 'answer' | 'follow-up' | 'system';
  content: string;
  timestamp: Date;
  isAI: boolean;
  questionId?: string;
  probeReason?: string;
}

export interface IStartInterviewData {
  respondentName: string;
  respondentEmail: string;
  templateId: string;
}

export interface IUserResponseData {
  questionId: string;
  answer: string;
}

export interface IScoreBreakdown {
  averageRelevance: number;
  averageDepth: number;
  averageConsistency: number;
  averageSentiment: number;
  overallScore: number;
  scoreTrend: number[];
}

export interface IAnalytics {
  interviewId: string;
  respondentName: string;
  templateTitle: string;
  overallScore: number;
  insights: IInterviewInsights;
  metadata: IInterviewMetadata;
  responseCount: number;
  averageResponseLength: number;
  scoreBreakdown: IScoreBreakdown;
  sentimentTrend: Array<{
    questionIndex: number;
    sentimentScore: number;
    compositeScore: number;
  }>;
  completionRate: number;
}
