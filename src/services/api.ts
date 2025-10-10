import axios from 'axios';
import { IInterview, IInterviewTemplate, IAnalytics } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class ApiService {
  // Interview endpoints
  static async getAllInterviews(): Promise<IInterview[]> {
    const response = await api.get('/interviews');
    return response.data.data;
  }

  static async getInterviewById(id: string): Promise<IInterview> {
    const response = await api.get(`/interviews/${id}`);
    return response.data.data;
  }

  static async getInterviewsByEmail(email: string): Promise<IInterview[]> {
    const response = await api.get(`/interviews/email/${email}`);
    return response.data.data;
  }

  static async createInterview(data: {
    respondentName: string;
    respondentEmail: string;
    templateId: string;
  }): Promise<IInterview> {
    const response = await api.post('/interviews', data);
    return response.data.data;
  }

  static async updateInterview(id: string, data: Partial<IInterview>): Promise<IInterview> {
    const response = await api.put(`/interviews/${id}`, data);
    return response.data.data;
  }

  static async deleteInterview(id: string): Promise<void> {
    await api.delete(`/interviews/${id}`);
  }

  // Analytics endpoints
  static async getInterviewAnalytics(id: string): Promise<IAnalytics> {
    const response = await api.get(`/analytics/interview/${id}`);
    return response.data.data;
  }

  static async getAggregateAnalytics(): Promise<any> {
    const response = await api.get('/analytics/aggregate');
    return response.data.data;
  }

  static async getTemplateAnalytics(templateId: string): Promise<any> {
    const response = await api.get(`/analytics/template/${templateId}`);
    return response.data.data;
  }

  static async exportInterviewData(id: string, format: string = 'json'): Promise<any> {
    const response = await api.get(`/analytics/export/${id}?format=${format}`);
    return response.data;
  }

  // Template endpoints (we'll add these to the backend later)
  static async getAllTemplates(): Promise<IInterviewTemplate[]> {
    // This will be implemented when we add template routes to backend
    return [];
  }

  static async getTemplateById(id: string): Promise<IInterviewTemplate> {
    // This will be implemented when we add template routes to backend
    throw new Error('Template endpoints not implemented yet');
  }
}

export default api;
