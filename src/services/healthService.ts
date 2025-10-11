import api from './api';
import type { ApiResponse } from '../types';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime?: number;
  version?: string;
}

interface DetailedHealthResponse extends HealthResponse {
  database: {
    status: string;
    connection: boolean;
    responseTime?: number;
  };
  services: {
    [key: string]: {
      status: string;
      responseTime?: number;
    };
  };
}

class HealthService {
  // Basic health check
  async getHealth(): Promise<ApiResponse<HealthResponse>> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Health check failed',
        data: undefined
      };
    }
  }

  // Detailed health check with database info
  async getDetailedHealth(): Promise<ApiResponse<DetailedHealthResponse>> {
    try {
      const response = await api.get('/health/detailed');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Detailed health check failed',
        data: undefined
      };
    }
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.getHealth();
      return result.success;
    } catch {
      return false;
    }
  }
}

export const healthService = new HealthService();
