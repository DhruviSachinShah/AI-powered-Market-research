# AI-Driven Qualitative Market Research Platform - Frontend

A React TypeScript frontend application for conducting AI-powered qualitative market research interviews with real-time chat interface and comprehensive analytics dashboard.

## Features

- 🤖 **AI-Powered Interviews**: Real-time chat interface with GPT-4
- 📊 **Analytics Dashboard**: Comprehensive insights and scoring breakdowns
- 🔄 **Real-time Communication**: WebSocket-based chat interface
- 📈 **Data Visualization**: Charts and graphs using Recharts
- 🎨 **Modern UI**: Built with Tailwind CSS and custom components
- 🚀 **Responsive Design**: Works on desktop and mobile devices
- 🐳 **Dockerized**: Full containerized deployment with Docker Compose

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Real-time**: Socket.io-client
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Deployment**: Docker, Nginx

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Backend API running on port 5000

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd market-research-frontend
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Configure API endpoints**
   ```bash
   # Edit .env file
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start the application**
   ```bash
   docker compose up --build
   ```

5. **Access the application**
   - Frontend: http://localhost:3000

## Development

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173

### Environment Variables

```bash
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   │   ├── Interview/  # Interview flow components
│   │   ├── Dashboard/  # Analytics dashboard
│   │   └── ui/         # Reusable UI components
│   ├── stores/         # Zustand state management
│   ├── services/       # API and Socket services
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── package.json
```

## Components

### Interview Components
- **InterviewPage**: Main interview interface
- **ChatInterface**: Real-time chat display
- **ResponseInput**: User input form

### Dashboard Components
- **DashboardPage**: Overview of all interviews
- **ResultsPage**: Detailed interview results and analytics

### UI Components
- **Button**: Customizable button component
- **Card**: Container component
- **Input**: Form input component
- **Textarea**: Multi-line input component
- **LoadingSpinner**: Loading indicator

## State Management

The application uses Zustand for state management with the following store:

```typescript
interface InterviewState {
  currentInterview: IInterview | null;
  messages: IMessage[];
  isConnected: boolean;
  isInterviewActive: boolean;
  isLoading: boolean;
  error: string | null;
  // ... actions
}
```

## API Integration

### REST API
- **ApiService**: Handles HTTP requests to backend
- **Endpoints**: Interviews, analytics, health checks

### WebSocket
- **SocketService**: Manages real-time communication
- **Events**: Interview flow, questions, responses

## Routing

The application uses React Router with the following routes:

- `/` - Landing page
- `/interview/:id` - Active interview interface
- `/results/:id` - Post-interview analytics
- `/dashboard` - Interview dashboard

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable UI components
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme support (future enhancement)

## Docker Commands

```bash
# Start application
docker compose up

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild
docker compose up --build
```

## Build Process

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## Performance Optimization

- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Vite's built-in optimizations
- **Image Optimization**: Optimized assets
- **Caching**: Nginx caching for static assets

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

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
