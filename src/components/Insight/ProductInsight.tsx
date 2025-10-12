import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999/api';

interface ProductInsightPageProps {
  productId: string;
}

const ProductInsightPage: React.FC<ProductInsightPageProps> = ({ productId }) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE_URL}/product-insights/${productId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch product insights");

        const result = await res.json();
        const productReport = result?.data?.product_report;

        if (productReport) setInsights(productReport);
        else setError("No product insights found");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [productId]);

  const generateColors = (num: number) =>
    Array.from({ length: num }, (_, i) => {
      const hue = 220 + (i * 40) % 140;
      return `hsl(${hue}, 85%, 65%)`;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">Error Loading Data</h3>
          <p className="text-center text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!insights || !insights.quantitative?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">No Data Available</h3>
          <p className="text-center text-gray-600">There are no insights to display at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white py-6 sm:py-8 lg:py-12 px-4 sm:px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Product Insights Dashboard</h1>
          </div>
          <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Comprehensive analysis and data visualization</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        {/* Quantitative Insights Grid */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
            Quantitative Analysis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {insights.quantitative.map((q: any, index: number) => {
              const labels = q.chart_data?.labels || [];
              const data = q.chart_data?.datasets?.[0]?.data || [];
              const colors = generateColors(data.length);

              if (q.visualization_type === "pie_chart") {
                return (
                  <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 border border-gray-100">
                    <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-5">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                        </svg>
                      </div>
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-800 leading-tight">{q.question_text}</h3>
                    </div>
                    <div className="h-48 sm:h-64 flex items-center justify-center">
                      <Pie
                        data={{
                          labels,
                          datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { 
                              position: 'bottom', 
                              labels: { 
                                padding: 8, 
                                font: { size: 10 },
                                usePointStyle: true,
                                pointStyle: 'circle'
                              } 
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              }

              if (q.visualization_type === "bar_chart") {
                return (
                  <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 border border-gray-100">
                    <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-5">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-800 leading-tight">{q.question_text}</h3>
                    </div>
                    <div className="h-48 sm:h-64">
                      <Bar
                        data={{
                          labels,
                          datasets: [{
                            label: q.chart_data?.datasets?.[0]?.label || "Responses",
                            data,
                            backgroundColor: colors,
                            borderRadius: 6,
                            borderWidth: 0,
                          }],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false }
                          },
                          scales: {
                            y: { 
                              beginAtZero: true, 
                              grid: { color: 'rgba(0,0,0,0.05)' },
                              ticks: { font: { size: 10 } }
                            },
                            x: { 
                              grid: { display: false },
                              ticks: { font: { size: 10 } }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              }

              if (q.visualization_type === "gauge_chart") {
                const value = q.chart_data?.datasets?.[0]?.data?.[0] || 0;
                const percentage = (value / 10) * 100;
                
                return (
                  <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 border border-gray-100">
                    <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-5">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-800 leading-tight">{q.question_text}</h3>
                    </div>
                    <div className="flex flex-col items-center justify-center py-4 sm:py-8">
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
                        <svg className="transform -rotate-90 w-full h-full">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 0.45}`}
                            strokeDashoffset={`${2 * Math.PI * 0.45 * (1 - percentage / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#9333ea" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{value}</span>
                          <span className="text-gray-500 text-xs sm:text-sm font-medium mt-1">out of 10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>

        {/* Qualitative Insights */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
            Qualitative Insights
          </h2>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Key Findings</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                  {insights.qualitative || "No qualitative insights available at this time."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInsightPage;