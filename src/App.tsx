import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import InterviewPage from "./components/Interview/InterviewPage";
import InsightPage from "./components/Insight/InsightPage";
import Admin from "./components/Admin/Admin";
import Products from "./components/Admin/Products";
import InterviewInsightsPage from "./components/Insight/InterviewInsight";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/insight" element={<InsightPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/products" element={<Products />} />
        <Route path="/interview/:id" element={<InterviewInsightsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
