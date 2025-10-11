import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
        const res = await fetch(`http://localhost:9999/api/product-insights/generate/${productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch product insights");

        const result = await res.json();
        console.log("API response:", result);

        // ✅ Correctly access nested structure
        const productReport = result?.data?.productInsights?.product_report;

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

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!insights || !insights.quantitative?.length) return <p className="text-center">No data available</p>;

  // Helper for generating colors
  const generateColors = (num: number) =>
    Array.from({ length: num }, (_, i) => `hsl(${(i * 60) % 360}, 70%, 60%)`);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">📊 Product Insights Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {insights.quantitative.map((q: any, index: number) => {
          const labels = q.chart_data?.labels || [];
          const data = q.chart_data?.datasets?.[0]?.data || [];
          const colors = generateColors(data.length);

          if (q.visualization_type === "pie_chart") {
            return (
              <div key={index} className="bg-white shadow-md p-6 rounded-2xl">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">{q.question_text}</h2>
                <Pie
                  data={{
                    labels,
                    datasets: [{ data, backgroundColor: colors }],
                  }}
                />
              </div>
            );
          }

          if (q.visualization_type === "bar_chart") {
            return (
              <div key={index} className="bg-white shadow-md p-6 rounded-2xl">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">{q.question_text}</h2>
                <Bar
                  data={{
                    labels,
                    datasets: [
                      {
                        label: q.chart_data?.datasets?.[0]?.label || "Responses",
                        data,
                        backgroundColor: colors,
                      },
                    ],
                  }}
                />
              </div>
            );
          }

          if (q.visualization_type === "gauge_chart") {
            const value = q.chart_data?.datasets?.[0]?.data?.[0] || 0;
            return (
              <div key={index} className="bg-white shadow-md p-6 rounded-2xl flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">{q.question_text}</h2>
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div
                    className="absolute w-full h-full rounded-full border-8"
                    style={{
                      borderColor: `conic-gradient(hsl(${value * 36}, 70%, 60%) ${value * 36}deg, #e5e7eb 0deg)`,
                    }}
                  ></div>
                  <span className="text-xl font-bold">{value}/10</span>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Qualitative section */}
      <div className="bg-white shadow-md p-6 rounded-2xl mt-10">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">🧠 Qualitative Insights</h2>
        <p className="text-gray-600">{insights.qualitative || "No qualitative insights available."}</p>
      </div>
    </div>
  );
};

export default ProductInsightPage;