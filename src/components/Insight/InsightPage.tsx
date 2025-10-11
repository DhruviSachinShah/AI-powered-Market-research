import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { ProductForInsight } from '../../types';
import ProductInsightPage from './ProductInsight';

// --- SVG ICONS ---
const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 12a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22l-.394-1.433a2.25 2.25 0 00-1.423-1.423L13.25 19l1.433-.394a2.25 2.25 0 001.423-1.423L16.5 16l.394 1.183a2.25 2.25 0 001.423 1.423L19.75 19l-1.433.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

// --- INTERFACES ---
interface Interview {
  _id: string;
  user: string;
  product: string;
}

// --- DASHBOARD COMPONENT ---
const InsightPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('product-insight');
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [interviewDetails, setInterviewDetails] = useState<
    Array<{ id: string; userName: string; productName: string}>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sampleProduct: ProductForInsight = {
    id: '68e9aeab8b2b525f106f9256',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 299.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
    stock: 150,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  };

  // --- HANDLE URL TAB PARAM ---
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // --- FETCH INTERVIEWS ---
  useEffect(() => {
    if (activeTab !== 'interview-insight') return;
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:9999/api/interviews');
        if (!res.ok) throw new Error('Failed to fetch interviews');
        const result = await res.json();
        console.log('Fetched interviews:', result);
        if (!Array.isArray(result.data)) throw new Error('Invalid format: expected an array');
        setInterviews(result.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [activeTab]);

  // --- FETCH USER & PRODUCT NAMES ---
  useEffect(() => {
    if (interviews.length === 0) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const details = await Promise.all(
          interviews.map(async (interview) => {
            let userName = 'Unknown User';
            let productName = 'Unknown Product';

            // --- Fetch user ---
            try {
              const userRes = await fetch(`http://localhost:9999/api/users/${interview.user}`);
              if (userRes.ok) {
                const userData = await userRes.json();
                userName =
                  userData?.data?.user_name ||
                  userData?.user?.user_name ||
                  userData?.user_name ||
                  'Unknown User';
              }
            } catch (e) {
              console.warn('User fetch failed for', interview.user);
            }

            // --- Fetch product ---
            try {
              const prodRes = await fetch(`http://localhost:9999/api/products/${interview.product}`);
              if (prodRes.ok) {
                const prodData = await prodRes.json();
                productName =
                  prodData?.data?.prod_name ||
                  prodData?.product?.prod_name ||
                  prodData?.prod_name ||
                  'Unknown Product';
              }
            } catch (e) {
              console.warn('Product fetch failed for', interview.product);
            }

            return {
              id: interview._id,
              userName,
              productName,
            };
          })
        );
        setInterviewDetails(details);
      } catch (err) {
        console.error('Failed to fetch interview details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [interviews]);

  const handleInterviewClick = (id: string) => {
    navigate(`/interview/${id}?tab=insight`);
  };

  const renderInterviewInsight = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading interviews...</p>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 text-lg font-semibold">Error: {error}</p>
          </div>
        </div>
      );
    }
    
    if (!interviewDetails || interviewDetails.length === 0) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon />
            </div>
            <p className="text-gray-600 text-lg font-medium">No interviews found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {interviewDetails.map((item) => (
          <div
            key={item.id}
            onClick={() => handleInterviewClick(item.id)}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 p-6 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-200">
                      {item.userName}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 ml-13">
                  <BoxIcon />
                  <span className="ml-2">{item.productName}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Interview ID</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-semibold text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-lg border border-blue-200">
                    {item.id.substring(0, 8)}...
                  </span>
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <SparklesIcon />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                AI Insights Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Discover powerful insights from your data</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-2 mb-8">
          <nav className="flex space-x-2">
            {[
              { id: 'product-insight', name: 'Product Insights', icon: <BoxIcon />, color: 'blue' },
              { id: 'interview-insight', name: 'Interview Insights', icon: <UsersIcon />, color: 'purple' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2.5 py-3.5 px-5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-white' : ''}>
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
                {activeTab === tab.id && (
                  <ChartBarIcon />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="transition-all duration-300">
          {activeTab === 'product-insight' && (
            <div className="animate-fadeIn">
              <ProductInsightPage productId={sampleProduct.id} />
            </div>
          )}
          {activeTab === 'interview-insight' && (
            <div className="animate-fadeIn">
              {renderInterviewInsight()}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InsightPage;