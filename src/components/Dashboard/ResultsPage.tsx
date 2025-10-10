import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { IAnalytics } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<IAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAnalytics(id);
    }
  }, [id]);

  const fetchAnalytics = async (interviewId: string) => {
    try {
      setIsLoading(true);
      const data = await ApiService.getInterviewAnalytics(interviewId);
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load interview results');
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Results
            </h2>
            <p className="text-red-600 mb-4">{error || 'Interview not found'}</p>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => id && fetchAnalytics(id)}
              >
                Retry
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const scoreBreakdownData = [
    { name: 'Relevance', score: analytics.scoreBreakdown.averageRelevance * 100 },
    { name: 'Depth', score: analytics.scoreBreakdown.averageDepth * 100 },
    { name: 'Consistency', score: analytics.scoreBreakdown.averageConsistency * 100 },
    { name: 'Sentiment', score: analytics.scoreBreakdown.averageSentiment * 100 }
  ];

  const sentimentTrendData = analytics.sentimentTrend.map((item, index) => ({
    question: `Q${item.questionIndex}`,
    sentiment: item.sentimentScore * 100,
    composite: item.compositeScore * 100
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Interview Results
              </h1>
              <p className="text-gray-600 mt-2">
                {analytics.respondentName} - {analytics.templateTitle}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => navigate('/')}
              >
                Start New Interview
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card padding="small">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(analytics.overallScore)}`}>
                {(analytics.overallScore * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </Card>
          
          <Card padding="small">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {analytics.responseCount}
              </div>
              <div className="text-sm text-gray-600">Responses</div>
            </div>
          </Card>
          
          <Card padding="small">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {analytics.averageResponseLength}
              </div>
              <div className="text-sm text-gray-600">Avg Words</div>
            </div>
          </Card>
          
          <Card padding="small">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getSentimentColor(analytics.insights.sentiment)}`}>
                {analytics.insights.sentiment}
              </div>
              <div className="text-sm text-gray-600">Sentiment</div>
            </div>
          </Card>
        </div>

        {/* Score Breakdown Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Score Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sentiment Trend Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Response Quality Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Line type="monotone" dataKey="composite" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="sentiment" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Key Themes */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Key Themes Identified
          </h3>
          <div className="flex flex-wrap gap-2">
            {analytics.insights.keyThemes.map((theme, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {theme}
              </span>
            ))}
          </div>
        </Card>

        {/* Interview Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Interview Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{Math.floor(analytics.metadata.duration / 60)}m {analytics.metadata.duration % 60}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Questions:</span>
                <span className="font-medium">{analytics.metadata.questionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Follow-ups:</span>
                <span className="font-medium">{analytics.metadata.followUpCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Rate:</span>
                <span className="font-medium">{(analytics.completionRate * 100).toFixed(0)}%</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Score Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Relevance:</span>
                <span className="font-medium">{(analytics.scoreBreakdown.averageRelevance * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Depth:</span>
                <span className="font-medium">{(analytics.scoreBreakdown.averageDepth * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Consistency:</span>
                <span className="font-medium">{(analytics.scoreBreakdown.averageConsistency * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sentiment Alignment:</span>
                <span className="font-medium">{(analytics.scoreBreakdown.averageSentiment * 100).toFixed(0)}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
