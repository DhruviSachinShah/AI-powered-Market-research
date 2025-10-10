# Environment Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/market-research

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# AI Service Configuration (if needed)
OPENAI_API_KEY=your_openai_api_key_here
```

## Health Check Endpoints

The application now includes comprehensive health check endpoints:

- **Basic Health Check**: `GET /health`
  - Returns basic health status, uptime, and service status
  - HTTP 200 for healthy, HTTP 503 for unhealthy

- **Detailed Health Check**: `GET /health/detailed`
  - Returns detailed health information including database connection details
  - Includes memory usage statistics
  - HTTP 200 for healthy, HTTP 503 for unhealthy

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start MongoDB (if running locally):
   ```bash
   # Using Docker
   docker-compose up -d
   
   # Or start MongoDB service directly
   mongod
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Test health check:
   ```bash
   curl http://localhost:5000/health
   ```

## Docker Support

The application includes Docker configuration:
- `Dockerfile` for containerizing the application
- `docker-compose.yml` for running with MongoDB
- `mongo-init.js` for database initialization
