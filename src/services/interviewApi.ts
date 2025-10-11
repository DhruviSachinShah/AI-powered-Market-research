import type { InterviewResponse, InterviewSession } from '../types';
import { API_CONFIG, getApiUrl, logApiCall } from '../config/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface InterviewResponsePayload {
  sessionId: string;
  questionId: string;
  transcript: string;
  duration: number;
  confidence: number;
  timestamp: string;
  questionText?: string;
  questionType?: string;
  questionCategory?: string;
}

interface SessionPayload {
  sessionId: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'paused';
  candidateInfo?: {
    name: string;
    email: string;
    position: string;
  };
}

class InterviewApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = getApiUrl(endpoint);
      logApiCall(options.method || 'GET', url, options.body);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Send individual response to backend
  async sendResponse(
    response: InterviewResponse,
    sessionId: string,
    questionText?: string,
    questionType?: string,
    questionCategory?: string
  ): Promise<ApiResponse<{ responseId: string }>> {
    const payload: InterviewResponsePayload = {
      sessionId,
      questionId: response.questionId,
      transcript: response.transcript,
      duration: response.duration,
      confidence: response.confidence || 0,
      timestamp: response.timestamp.toISOString(),
      questionText,
      questionType,
      questionCategory,
    };

    return this.makeRequest<{ responseId: string }>(API_CONFIG.ENDPOINTS.INTERVIEW_RESPONSES, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Send complete session to backend
  async sendSession(session: InterviewSession): Promise<ApiResponse<{ sessionId: string }>> {
    const payload: SessionPayload = {
      sessionId: session.id,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime?.toISOString(),
      status: session.status,
      candidateInfo: session.candidateInfo,
    };

    return this.makeRequest<{ sessionId: string }>(API_CONFIG.ENDPOINTS.INTERVIEW_SESSIONS, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Send all responses for a session
  async sendSessionResponses(
    session: InterviewSession
  ): Promise<ApiResponse<{ responsesSent: number }>> {
    const responses = session.responses.map(response => {
      const question = session.questions.find(q => q.id === response.questionId);
      return {
        sessionId: session.id,
        questionId: response.questionId,
        transcript: response.transcript,
        duration: response.duration,
        confidence: response.confidence || 0,
        timestamp: response.timestamp.toISOString(),
        questionText: question?.question,
        questionType: question?.type,
        questionCategory: question?.category,
      };
    });

    return this.makeRequest<{ responsesSent: number }>(API_CONFIG.ENDPOINTS.INTERVIEW_RESPONSES_BATCH, {
      method: 'POST',
      body: JSON.stringify({ responses }),
    });
  }

  // Get session analysis from backend
  async getSessionAnalysis(sessionId: string): Promise<ApiResponse<{
    overallScore: number;
    strengths: string[];
    areasForImprovement: string[];
    sentimentAnalysis: {
      overall: 'positive' | 'negative' | 'neutral';
      breakdown: Array<{
        questionId: string;
        sentiment: 'positive' | 'negative' | 'neutral';
        confidence: number;
      }>;
    };
    keywordAnalysis: Array<{
      keyword: string;
      frequency: number;
      relevance: number;
    }>;
    recommendations: string[];
  }>> {
    return this.makeRequest(`${API_CONFIG.ENDPOINTS.INTERVIEW_ANALYSIS}/${sessionId}/analysis`);
  }

  // Get real-time feedback for a response
  async getResponseFeedback(
    sessionId: string,
    questionId: string,
    transcript: string
  ): Promise<ApiResponse<{
    feedback: string;
    suggestions: string[];
    score: number;
    keywords: string[];
  }>> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.INTERVIEW_FEEDBACK, {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        questionId,
        transcript,
      }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.HEALTH);
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.healthCheck();
      return result.success;
    } catch {
      return false;
    }
  }
}

export const interviewApiService = new InterviewApiService();

// Utility function to send response with retry logic
export const sendResponseWithRetry = async (
  response: InterviewResponse,
  sessionId: string,
  questionText?: string,
  questionType?: string,
  questionCategory?: string,
  maxRetries: number = 3
): Promise<boolean> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await interviewApiService.sendResponse(
        response,
        sessionId,
        questionText,
        questionType,
        questionCategory
      );

      if (result.success) {
        console.log(`Response sent successfully on attempt ${attempt}`);
        return true;
      }

      console.warn(`Attempt ${attempt} failed:`, result.error);
      
      if (attempt === maxRetries) {
        console.error('All retry attempts failed');
        return false;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    } catch (error) {
      console.error(`Attempt ${attempt} error:`, error);
      
      if (attempt === maxRetries) {
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return false;
};
