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
              console.warn('User fetch failed for', interview.userId);
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
    if (loading) return <p>Loading interviews...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!interviewDetails || interviewDetails.length === 0) return <p>No interviews found.</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {interviewDetails.map((item) => (
          <div
            key={item.id}
            onClick={() => handleInterviewClick(item.id)}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{item.userName}</h3>
                <p className="text-sm text-gray-500 mt-1">Product: {item.productName}</p>
              </div>
            </div>
            <div className="text-sm space-y-2 border-t border-slate-200 pt-4 mt-4">
              <div className="flex justify-between items-center text-slate-600">
                <span>Interview ID:</span>
                <span className="font-mono text-xs font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {item.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-2 mb-8">
          <nav className="flex space-x-2">
            {[
              { id: 'product-insight', name: 'Product Insight', icon: <BoxIcon /> },
              { id: 'interview-insight', name: 'Interview Insight', icon: <UsersIcon /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-2.5 py-2.5 px-4 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'product-insight' && (
          <ProductInsightPage productId={sampleProduct.id} />
        )}
        {activeTab === 'interview-insight' && renderInterviewInsight()}
      </div>
    </div>
  );
};

export default InsightPage;