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
export declare class HealthService {
    static checkHealth(): Promise<HealthCheckResult>;
    static checkDatabaseConnection(): Promise<boolean>;
}
//# sourceMappingURL=healthService.d.ts.map