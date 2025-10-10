import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    respondentName: '',
    respondentEmail: '',
    templateId: 'sample-template' // We'll use a hardcoded template for now
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.respondentName.trim() || !formData.respondentEmail.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, we'll navigate directly to the interview page
      // In a real app, we'd create the interview first
      navigate('/interview/new', { 
        state: { 
          respondentName: formData.respondentName,
          respondentEmail: formData.respondentEmail,
          templateId: formData.templateId
        }
      });
    } catch (err) {
      setError('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Market Research
          </h1>
          <p className="text-lg text-gray-600">
            Participate in an AI-powered qualitative research interview
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Start Your Interview
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                We'll ask you questions about your preferences and experiences. 
                The AI will adapt its questions based on your responses.
              </p>
            </div>

            <Input
              label="Your Name"
              name="respondentName"
              type="text"
              value={formData.respondentName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Email Address"
              name="respondentEmail"
              type="email"
              value={formData.respondentEmail}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              size="large"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Starting Interview...' : 'Start Interview'}
            </Button>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This interview typically takes 5-10 minutes to complete.
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              View Past Interviews
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
