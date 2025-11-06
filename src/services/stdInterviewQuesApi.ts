import type { InterviewQuestion } from '../types';
import { API_CONFIG, getApiUrl, logApiCall } from '../config/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

interface StdInterviewQuesResponse {
  _id: string;
  product: string;
  questions: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

class StdInterviewQuesApiService {
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
        data: data.data,
        count: data.count,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Get all questions (filtered by product ID on client side)
  async getAllQuestions(): Promise<ApiResponse<StdInterviewQuesResponse[]>> {
    return this.makeRequest<StdInterviewQuesResponse[]>(`${API_CONFIG.ENDPOINTS.STD_INTERVIEW_QUES}`);
  }

  // Convert database response to InterviewQuestion format
  convertToInterviewQuestions(
    dbResponse: StdInterviewQuesResponse,
    defaultDuration: number = 120
  ): InterviewQuestion[] {
    return dbResponse.questions.map((question, index) => ({
      id: `${dbResponse._id}_${index}`,
      question: question,
      type: 'general' as const,
      category: 'Standard Questions',
      expectedDuration: defaultDuration,
    }));
  }

  // Get questions for a product and convert to InterviewQuestion format
  async getInterviewQuestionsForProduct(
    productId: string,
    defaultDuration: number = 120
  ): Promise<ApiResponse<InterviewQuestion[]>> {
    try {
      const result = await this.getAllQuestions();
      
      console.log('API Response:', result);
      
      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || 'Failed to fetch questions',
        };
      }

      // Check if data is an array
      if (!Array.isArray(result.data)) {
        console.error('Expected array but got:', typeof result.data, result.data);
        return {
          success: false,
          error: 'Invalid data format: expected array',
        };
      }

      // Filter questions by product ID since the API returns all questions
      const questionSet = result.data.find(item => item.product === productId);
      if (!questionSet) {
        return {
          success: false,
          error: 'No questions found for this product',
        };
      }

      const interviewQuestions = this.convertToInterviewQuestions(questionSet, defaultDuration);
      
      return {
        success: true,
        data: interviewQuestions,
        count: interviewQuestions.length,
      };
    } catch (error) {
      console.error('Error in getInterviewQuestionsForProduct:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const stdInterviewQuesApiService = new StdInterviewQuesApiService();

// Utility function to get questions with fallback
export const getInterviewQuestionsWithFallback = async (
  productId: string,
  fallbackQuestions: InterviewQuestion[],
  defaultDuration: number = 120
): Promise<InterviewQuestion[]> => {
  try {
    const result = await stdInterviewQuesApiService.getInterviewQuestionsForProduct(
      productId,
      defaultDuration
    );
    
    if (result.success && result.data && result.data.length > 0) {
      console.log(`Loaded ${result.data.length} questions from database for product ${productId}`);
      return result.data;
    } else {
      console.warn('Failed to load questions from database, using fallback questions:', result.error);
      return fallbackQuestions;
    }
  } catch (error) {
    console.error('Error loading questions from database, using fallback questions:', error);
    return fallbackQuestions;
  }
};
