import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to InterviewPro
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Ace your next interview with AI-powered practice questions,<br />
          instant feedback, and performance analytics.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Link
            to="/interview/1"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Interview
          </Link>
          <Link
            to="/dashboard"
            className="text-blue-600 hover:underline font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
