"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class HealthService {
    static async checkHealth() {
        const healthCheck = {
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
            const mongoState = mongoose_1.default.connection.readyState;
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
        }
        catch (error) {
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
    static async checkDatabaseConnection() {
        try {
            if (mongoose_1.default.connection.readyState === 1 && mongoose_1.default.connection.db) {
                // Test the connection with a simple operation
                await mongoose_1.default.connection.db.admin().ping();
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
}
exports.HealthService = HealthService;
//# sourceMappingURL=healthService.js.map