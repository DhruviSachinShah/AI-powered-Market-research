import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import { IInterview } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<IInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getAllInterviews();
      setInterviews(data);
    } catch (err) {
      setError('Failed to load interviews');
      console.error('Error fetching interviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'abandoned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Interview Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                View and manage your market research interviews
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/')}
              size="large"
            >
              Start New Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <Button
              variant="outline"
              size="small"
              onClick={fetchInterviews}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {interviews.length === 0 ? (
          <Card className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No interviews yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start your first AI-powered market research interview to see results here.
              </p>
              <Button
                onClick={() => navigate('/')}
                size="large"
              >
                Start Your First Interview
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card padding="small">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {interviews.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Interviews</div>
                </div>
              </Card>
              
              <Card padding="small">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {interviews.filter(i => i.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </Card>
              
              <Card padding="small">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {interviews.filter(i => i.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </Card>
              
              <Card padding="small">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {interviews.length > 0 
                      ? (interviews.reduce((sum, i) => sum + i.overallScore, 0) / interviews.length).toFixed(2)
                      : '0.00'
                    }
                  </div>
                  <div className="text-sm text-gray-600">Avg Score</div>
                </div>
              </Card>
            </div>

            {/* Interviews List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Interviews
              </h2>
              
              {interviews.map((interview) => (
                <Card key={interview._id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {interview.respondentName}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
                          {interview.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Email: {interview.respondentEmail}</p>
                        <p>Started: {formatDate(interview.startedAt)}</p>
                        {interview.completedAt && (
                          <p>Completed: {formatDate(interview.completedAt)}</p>
                        )}
                        <p>Responses: {interview.responses.length}</p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className={`text-2xl font-bold ${getScoreColor(interview.overallScore)}`}>
                        {(interview.overallScore * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">Score</div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => navigate(`/results/${interview._id}`)}
                        >
                          View Results
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
