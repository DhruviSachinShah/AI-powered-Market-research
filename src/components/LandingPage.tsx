import { Link } from 'react-router-dom';
import { MessageSquare, TrendingUp, Users, Zap, DollarSign, Clock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl">ResearchAI</span>
        </div>
        <Link 
          to="/admin" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
        >
          Admin Panel
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20 text-center">
        <div className="relative">
          <div className="absolute -top-8 left-4 sm:left-20 w-16 sm:w-24 h-16 sm:h-24 bg-blue-200 rounded-full opacity-40 blur-2xl"></div>
          <div className="absolute top-0 right-8 sm:right-32 w-20 sm:w-32 h-20 sm:h-32 bg-purple-200 rounded-full opacity-40 blur-2xl"></div>
          
          <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🚀 Dare 2 Dream VC Hackathon Project
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight px-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Driven Qualitative<br />
            Market Research Platform
          </h1>
          <p className="text-gray-600 mb-8 text-lg sm:text-xl px-4 max-w-3xl mx-auto leading-relaxed">
            Transform market research with autonomous AI interviews that reduce costs by 70%, eliminate human error, and deliver insights in record time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/interview" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition shadow-lg"
            >
              Start Free Interview
            </Link>
            <Link 
              to="/insight" 
              className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-base font-semibold hover:border-gray-400 transition"
            >
              View Insights
            </Link>
          </div>
          <div className="mt-6 text-sm text-gray-500">No credit card required • 5-minute setup</div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">60-70%</div>
              <div className="text-blue-100 text-sm sm:text-base">Cost Reduction</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">$20B</div>
              <div className="text-blue-100 text-sm sm:text-base">Annual Market Opportunity</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">10x</div>
              <div className="text-blue-100 text-sm sm:text-base">Faster Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">The Challenge We're Solving</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Traditional market research is broken. Manual processes cost billions and slow down critical business decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-red-900 mb-4">Current Pain Points</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold mt-1">✗</span>
                <span>Manual respondent recruitment and scheduling delays</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold mt-1">✗</span>
                <span>Human moderator fatigue and consistency issues</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold mt-1">✗</span>
                <span>Labor-intensive recording and analysis prone to errors</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold mt-1">✗</span>
                <span>High field costs reaching $20B annually</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-green-900 mb-4">Our AI Solution</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span>Automated 24/7 interview scheduling and execution</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span>Consistent, unbiased AI-driven conversations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span>Instant transcription and intelligent analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span>Billions in cost savings for research firms</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Core Functionality</h2>
            <p className="text-gray-600 text-lg">
              Powered by advanced AI to deliver human-like research interviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Conversational AI Agent</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced chatbot capable of asking nuanced, open-ended questions that feel natural and engaging.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Adaptive Probing</h3>
              <p className="text-gray-600 leading-relaxed">
                Intelligently digs deeper based on responses, prompting for elaboration where needed to uncover insights.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically synthesizes findings and generates comprehensive summaries upon interview completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg">
            Three simple steps to revolutionize your market research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 className="text-xl font-bold mb-3">Set Up Your Study</h3>
            <p className="text-gray-600">
              Define your research objectives, target audience, and key questions in minutes.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 className="text-xl font-bold mb-3">AI Conducts Interviews</h3>
            <p className="text-gray-600">
              Our AI agent autonomously interviews 10-20 respondents with human-like conversation.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 className="text-xl font-bold mb-3">Get Actionable Insights</h3>
            <p className="text-gray-600">
              Receive synthesized findings, key themes, and strategic recommendations instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Business Impact */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Business Impact</h2>
            <p className="text-gray-600 text-lg">
              Transforming the $50 billion market research industry
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <DollarSign className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Cost Efficiency</h3>
              <p className="text-gray-600 text-sm">
                Reduce field costs by 60-70%, saving billions annually across the industry.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <Clock className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Speed to Insights</h3>
              <p className="text-gray-600 text-sm">
                Accelerate research cycles from weeks to days, enabling faster strategic decisions.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <Users className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Scale Effortlessly</h3>
              <p className="text-gray-600 text-sm">
                Conduct hundreds of interviews simultaneously without additional human resources.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <Zap className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Zero Human Error</h3>
              <p className="text-gray-600 text-sm">
                Eliminate inconsistencies, fatigue, and bias from human moderators.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <TrendingUp className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Better Quality</h3>
              <p className="text-gray-600 text-sm">
                Consistent probing and questioning leads to richer, more reliable data.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <MessageSquare className="w-10 h-10 text-pink-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">24/7 Availability</h3>
              <p className="text-gray-600 text-sm">
                No scheduling constraints—interviews happen whenever respondents are ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Roadmap */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Product Roadmap</h2>
          <p className="text-gray-600 text-lg">
            Our vision for the future of market research
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold">
                Q1
              </div>
              <h3 className="text-2xl font-bold">Phase 1: Core Platform (Current)</h3>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Robust, human-like conversational agent for qualitative interviews • Adaptive probing capabilities • Automated insight synthesis • Mobile & web accessibility
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold">
                Q2
              </div>
              <h3 className="text-2xl font-bold">Phase 2: Panel Management</h3>
            </div>
            <p className="text-purple-100 leading-relaxed">
              Respondent database & panel management • Automated recruitment workflows • Demographic targeting • Incentive management system
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold">
                Q3
              </div>
              <h3 className="text-2xl font-bold">Phase 3: Advanced Analytics</h3>
            </div>
            <p className="text-green-100 leading-relaxed">
              Behavioral analytics engine • Sentiment analysis • Consumption pattern tracking • Predictive modeling • Real-time trend detection
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center font-bold">
                Q4
              </div>
              <h3 className="text-2xl font-bold">Phase 4: Full Ecosystem</h3>
            </div>
            <p className="text-orange-100 leading-relaxed">
              Quantitative survey integration • Consumer input portal • API for third-party integrations • Enterprise features • White-label solutions
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Perfect For</h2>
            <p className="text-gray-600 text-lg">
              Industries and teams that rely on market research
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="font-bold mb-2">Research Agencies</h3>
              <p className="text-sm text-gray-600">Scale operations and reduce costs dramatically</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="font-bold mb-2">Consumer Brands</h3>
              <p className="text-sm text-gray-600">Understand customer preferences faster</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-bold mb-2">Startups</h3>
              <p className="text-sm text-gray-600">Validate product-market fit quickly</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-bold mb-2">Product Teams</h3>
              <p className="text-sm text-gray-600">Gather user feedback continuously</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Market Research?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the AI revolution and start conducting smarter interviews today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/interview" 
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-xl"
            >
              Start Your Free Trial
            </Link>
            <Link 
              to="/insight" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition"
            >
              View Dashboard
            </Link>
          </div>
          <p className="text-blue-100 text-sm mt-6">Dare 2 Dream VC Hackathon Submission • Built with ❤️ for researchers</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl">ResearchAI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing market research with AI-powered interviews.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
                <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Team</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">©️ 2024 ResearchAI. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}