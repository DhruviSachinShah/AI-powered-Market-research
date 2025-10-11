import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import InterviewPage from "./components/Interview/InterviewPage";
import InsightPage from "./components/Insight/InsightPage";
import Admin from "./components/Admin/Admin";
import Products from "./components/Admin/Products";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/insight" element={<InsightPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
};

export default App;
