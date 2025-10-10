"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = __importDefault(require("./config/database"));
const healthService_1 = require("./services/healthService");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Initialize Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
// Connect to MongoDB
(0, database_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const healthCheck = await healthService_1.HealthService.checkHealth();
        if (healthCheck.status === 'healthy') {
            res.status(200).json(healthCheck);
        }
        else {
            res.status(503).json(healthCheck);
        }
    }
    catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
            services: {
                mongodb: 'error',
                server: 'error'
            }
        });
    }
});
// Detailed health check endpoint
app.get('/health/detailed', async (req, res) => {
    try {
        const healthCheck = await healthService_1.HealthService.checkHealth();
        const dbConnection = await healthService_1.HealthService.checkDatabaseConnection();
        const detailedHealth = {
            ...healthCheck,
            database: {
                connection: dbConnection,
                state: mongoose_1.default.connection.readyState,
                host: mongoose_1.default.connection.host,
                port: mongoose_1.default.connection.port,
                name: mongoose_1.default.connection.name
            }
        };
        if (healthCheck.status === 'healthy' && dbConnection) {
            res.status(200).json(detailedHealth);
        }
        else {
            res.status(503).json(detailedHealth);
        }
    }
    catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Detailed health check failed'
        });
    }
});
// API Routes
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=server.js.map