import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999/api';

interface InsightItem {
  category: string;
  insight: string;
  sentiment: string;
  confidence: string;
}

interface RespondentInfo {
  userId: string;
  userName: string;
  userType: string;
}

interface ProductInfo {
  productId: string;
  productName: string;
}

interface Metadata {
  totalQuestions: number;
  answeredQuestions: number;
  completionRate: string;
  aiModel: string;
}

interface InterviewInsightsData {
  insights: InsightItem[];
  respondentInfo: RespondentInfo;
  productInfo: ProductInfo;
  metadata: Metadata;
  generatedAt: string;
}

const InterviewInsightsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [insights, setInsights] = useState<InterviewInsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `${API_BASE_URL}/interview-insights/${id}`
        );

        const data = response.data.data;
        const report = data?.interviewReport;

        if (!report) throw new Error('No interview report found');

        setInsights(report);
      } catch (err: any) {
        console.error('Error fetching interview insights:', err);
        setError(err.response?.data?.message || 'Failed to fetch interview insights.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <Link to="/insight" className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <p className="text-center text-lg text-gray-600">No insights available.</p>
      </div>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    const s = sentiment.toLowerCase();
    if (s.includes('positive')) return 'bg-green-50 border-green-500';
    if (s.includes('negative')) return 'bg-red-50 border-red-500';
    if (s.includes('neutral')) return 'bg-gray-50 border-gray-400';
    return 'bg-blue-50 border-blue-500';
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    const s = sentiment.toLowerCase();
    if (s.includes('positive')) return 'bg-green-100 text-green-700';
    if (s.includes('negative')) return 'bg-red-100 text-red-700';
    if (s.includes('neutral')) return 'bg-gray-100 text-gray-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/insight" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-2">
            Interview Insights
          </h1>
          <p className="text-gray-600 text-lg">AI-powered analysis and key findings</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Respondent</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-900">{insights.respondentInfo.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold text-gray-900">{insights.respondentInfo.userType}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Product</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-900">{insights.productInfo.productName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Section */}
          <div className="p-8 border-t border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Interview Metrics</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">{insights.metadata.totalQuestions}</div>
                <div className="text-sm text-gray-600 font-medium">Total Questions</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">{insights.metadata.answeredQuestions}</div>
                <div className="text-sm text-gray-600 font-medium">Answered</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-1">{insights.metadata.completionRate}%</div>
                <div className="text-sm text-gray-600 font-medium">Completion</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl">
                <div className="text-sm font-bold text-indigo-600 mb-1">{insights.metadata.aiModel}</div>
                <div className="text-sm text-gray-600 font-medium">AI Model</div>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Generated on {new Date(insights.generatedAt).toLocaleString()}
            </div>
          </div>

          {/* Insights Section */}
          <div className="p-8 bg-gray-50">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Key Insights</h2>
            </div>
            
            <div className="space-y-4">
              {insights.insights.map((item, index) => (
                <div
                  key={index}
                  className={`p-6 border-l-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white ${getSentimentColor(item.sentiment)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-800">{item.category}</h3>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentBadgeColor(item.sentiment)}`}>
                        {item.sentiment}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {item.confidence}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item.insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="mt-8 text-center">
          <Link 
            to="/products" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewInsightsPage;