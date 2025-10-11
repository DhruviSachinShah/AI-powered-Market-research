import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { i } from 'framer-motion/client';

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
          `http://localhost:9999/api/interview-insights/${id}`
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

  if (loading) return <p className="text-center mt-12 text-gray-600">Loading insights...</p>;
  if (error) return <p className="text-center mt-12 text-red-600">{error}</p>;
  if (!insights) return <p className="text-center mt-12 text-gray-600">No insights available.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 py-10">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Interview Insights</h1>

        {/* Candidate & Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-indigo-50 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2 text-indigo-700">Candidate Info</h2>
            <p><strong>Name:</strong> {insights.respondentInfo.userName}</p>
            <p><strong>Type:</strong> {insights.respondentInfo.userType}</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2 text-indigo-700">Product Info</h2>
            <p><strong>Product:</strong> {insights.productInfo.productName}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Metadata</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><strong>Total Questions:</strong> {insights.metadata.totalQuestions}</div>
            <div><strong>Answered:</strong> {insights.metadata.answeredQuestions}</div>
            <div><strong>Completion:</strong> {insights.metadata.completionRate}%</div>
            <div><strong>AI Model:</strong> {insights.metadata.aiModel}</div>
          </div>
          <p className="mt-2 text-sm text-gray-500"><strong>Generated At:</strong> {new Date(insights.generatedAt).toLocaleString()}</p>
        </div>

        {/* Insights */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Insights</h2>
          <div className="space-y-4">
            {insights.insights.map((item, index) => (
              <div
                key={index}
                className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md shadow-sm"
              >
                <p className="font-semibold text-blue-800">{item.category}</p>
                <p className="mt-1 text-gray-700">{item.insight}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Sentiment: {item.sentiment}, Confidence: {item.confidence}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link to="/" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            ← Back to Interviews
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewInsightsPage;