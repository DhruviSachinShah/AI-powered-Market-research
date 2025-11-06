import mongoose from 'mongoose';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    mongodb: 'connected' | 'disconnected' | 'connecting' | 'error';
    server: 'running' | 'error';
  };
  memory?: {
    used: number;
    total: number;
    percentage: number;
  };
}

export class HealthService {
  static async checkHealth(): Promise<HealthCheckResult> {
    const healthCheck: HealthCheckResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        mongodb: 'disconnected',
        server: 'running'
      }
    };

    try {
      // Check MongoDB connection
      const mongoState = mongoose.connection.readyState;
      switch (mongoState) {
        case 1:
          healthCheck.services.mongodb = 'connected';
          break;
        case 0:
          healthCheck.services.mongodb = 'disconnected';
          break;
        case 2:
          healthCheck.services.mongodb = 'connecting';
          break;
        default:
          healthCheck.services.mongodb = 'error';
      }

      // Add memory usage information
      const memUsage = process.memoryUsage();
      healthCheck.memory = {
        used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
      };

      // Determine overall health status
      if (healthCheck.services.mongodb !== 'connected') {
        healthCheck.status = 'unhealthy';
      }

      return healthCheck;
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        services: {
          mongodb: 'error',
          server: 'error'
        }
      };
    }
  }

  static async checkDatabaseConnection(): Promise<boolean> {
    try {
      if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        // Test the connection with a simple operation
        await mongoose.connection.db.admin().ping();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
