
import type { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999/api';

class InterviewService {

  // Generate follow-up question
  async generateFollowupQuestion(interviewId: string, currentQuestion: string, userResponse: string): Promise<ApiResponse<{ followup_question: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/followups/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId,
          currentQuestion,
          userResponse
        }),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: data.success,
        data: { followup_question: data.followup_question }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to generate follow-up question',
        data: undefined
      };
    }
  }
}

export const interviewService = new InterviewService();