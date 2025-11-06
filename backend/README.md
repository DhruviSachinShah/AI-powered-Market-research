# AI-Driven Qualitative Market Research Platform - Backend

A Node.js backend service for conducting AI-powered qualitative market research interviews using OpenAI GPT-4, MongoDB, and Socket.io for real-time communication.

## Features

- 🤖 **AI-Powered Interviews**: GPT-4 conducts natural conversations with adaptive questioning
- 📊 **Real-time Analysis**: Responses are analyzed for relevance, depth, consistency, and sentiment
- 🔄 **Follow-up Questions**: AI automatically probes deeper when responses are vague or incomplete
- 📈 **Analytics API**: Comprehensive insights and scoring breakdowns
- 🚀 **Real-time Communication**: WebSocket-based chat interface
- 🐳 **Dockerized**: Full containerized deployment with Docker Compose

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for WebSocket communication
- **AI**: OpenAI GPT-4 via LangChain
- **Deployment**: Docker, Docker Compose

## Quick Start

### Prerequisites
- Docker and Docker Compose
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd market-research-backend
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Add your OpenAI API key**
   ```bash
   # Edit .env file
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

4. **Start the application**
   ```bash
   docker compose up --build
   ```

5. **Access the application**
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017
   - Health Check: http://localhost:5000/health

## API Endpoints

### Interviews
- `GET /api/interviews` - Get all interviews
- `GET /api/interviews/:id` - Get interview by ID
- `GET /api/interviews/email/:email` - Get interviews by email
- `POST /api/interviews` - Create new interview
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Delete interview

### Analytics
- `GET /api/analytics/interview/:id` - Get interview analytics
- `GET /api/analytics/aggregate` - Get aggregate analytics
- `GET /api/analytics/template/:templateId` - Get template analytics
- `GET /api/analytics/export/:id` - Export interview data

### Health
- `GET /health` - Health check endpoint

## Socket Events

### Client to Server
- `start-interview` - Start new interview
- `user-response` - Send user response
- `follow-up-response` - Send follow-up response
- `end-interview` - End interview

### Server to Client
- `question` - Receive new question
- `follow-up-question` - Receive follow-up question
- `interview-complete` - Interview completed
- `interview-ended` - Interview ended
- `error` - Error occurred

## Development

### Local Development

1. **Start MongoDB**
   ```bash
   docker compose up mongodb
   ```

2. **Start Backend**
   ```bash
   npm install
   npm run dev
   ```

### Environment Variables

```bash
PORT=5000
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/market_research?authSource=admin
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Docker Commands

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild specific service
docker compose up -d --build backend
```

## Project Structure

```
backend/
├── src/
│   ├── models/         # MongoDB schemas
│   ├── services/       # AI & scoring services
│   ├── controllers/    # API controllers
│   ├── routes/         # Express routes
│   ├── socket/         # Socket.io handlers
│   ├── config/         # Configuration
│   └── server.ts       # Main server file
├── Dockerfile
├── docker-compose.yml
├── mongo-init.js
└── package.json
```

## Scoring Algorithm

Each response is scored on four dimensions:

- **Relevance (40%)**: How well the response addresses the question
- **Depth (25%)**: Level of detail and specificity
- **Consistency (20%)**: Alignment with previous responses
- **Sentiment Alignment (15%)**: Match with expected sentiment

## AI Capabilities

- **Natural Conversation**: GPT-4 conducts human-like interviews
- **Context Awareness**: Remembers previous answers and adapts questions
- **Adaptive Probing**: Generates follow-up questions based on response quality
- **Real-time Analysis**: Analyzes responses as they come in
- **Intelligent Questioning**: Uses different probing strategies (depth, clarification, examples, comparison)

## Database Schema

### Interview Schema
```typescript
{
  _id: ObjectId,
  respondentName: string,
  respondentEmail: string,
  templateId: ObjectId,
  status: 'in-progress' | 'completed' | 'abandoned',
  startedAt: Date,
  completedAt: Date?,
  responses: [ResponseSchema],
  overallScore: number,
  insights: {
    keyThemes: string[],
    sentiment: 'positive' | 'neutral' | 'negative',
    completionRate: number
  },
  metadata: {
    duration: number,
    questionCount: number,
    followUpCount: number
  }
}
```

### Response Schema
```typescript
{
  questionId: string,
  questionText: string,
  questionType: 'initial' | 'follow-up',
  userAnswer: string,
  aiProbe: string?,
  scores: {
    relevance: number,
    depth: number,
    consistency: number,
    sentimentAlignment: number,
    composite: number
  },
  vectorEmbedding: number[],
  timestamp: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please open an issue in the repository.
