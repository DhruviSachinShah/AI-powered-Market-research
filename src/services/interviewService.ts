import api from './api';
import type { Interview, ApiResponse } from '../types';

class InterviewService {
  // Get all interviews
  async getAllInterviews(): Promise<ApiResponse<Interview[]>> {
    try {
      const response = await api.get('/interviews');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch interviews',
        data: undefined
      };
    }
  }

  // Get interview by ID
  async getInterviewById(interviewId: string): Promise<ApiResponse<Interview>> {
    try {
      const response = await api.get(`/interviews/${interviewId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch interview',
        data: undefined
      };
    }
  }

  // Get interviews by user ID
  async getInterviewsByUser(userId: string): Promise<ApiResponse<Interview[]>> {
    try {
      const response = await api.get(`/interviews/user/${userId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user interviews',
        data: undefined
      };
    }
  }

  // Get interviews by product ID
  async getInterviewsByProduct(productId: string): Promise<ApiResponse<Interview[]>> {
    try {
      const response = await api.get(`/interviews/product/${productId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch product interviews',
        data: undefined
      };
    }
  }

  // Create new interview
  async createInterview(interviewData: Omit<Interview, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Interview>> {
    try {
      const response = await api.post('/interviews', interviewData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create interview',
        data: undefined
      };
    }
  }

  // Update interview by ID
  async updateInterview(interviewId: string, interviewData: Partial<Omit<Interview, '_id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Interview>> {
    try {
      const response = await api.put(`/interviews/${interviewId}`, interviewData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update interview',
        data: undefined
      };
    }
  }

  // Delete interview by ID
  async deleteInterview(interviewId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete(`/interviews/${interviewId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete interview',
        data: undefined
      };
    }
  }
}

export const interviewService = new InterviewService();