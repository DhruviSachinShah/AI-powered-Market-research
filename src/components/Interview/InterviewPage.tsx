import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const InterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);

  // Sample questions - in a real app, these would come from an API
  const questions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths?",
    "Describe a challenging project you worked on.",
    "Where do you see yourself in 5 years?",
    "Do you have any questions for us?"
  ];

  const handleAnswerSubmit = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsInterviewComplete(true);
    }
  };

  const handleStartOver = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsInterviewComplete(false);
  };

  if (isInterviewComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Interview Complete!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for completing the interview. Your responses have been recorded.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleStartOver}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Over
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors"
            >
              View Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Interview Session #{id}
              </h1>
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {questions[currentQuestion]}
            </h2>
            <p className="text-gray-600 mb-6">
              Please provide a detailed answer. Take your time to think through your response.
            </p>
          </div>

          <AnswerForm onSubmit={handleAnswerSubmit} />
        </div>
      </div>
    </div>
  );
};

interface AnswerFormProps {
  onSubmit: (answer: string) => void;
}

const AnswerForm: React.FC<AnswerFormProps> = ({ onSubmit }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer:
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!answer.trim()}
        >
          Submit Answer
        </button>
      </div>
    </form>
  );
};

export default InterviewPage;
