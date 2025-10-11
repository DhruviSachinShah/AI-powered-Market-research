import { Link } from 'react-router-dom';
import { MessageSquare, TrendingUp, Users, Zap, DollarSign, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { GridCanvas } from './GridCanvas';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center glow-primary">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl">ResearchAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/products" className="hidden sm:block text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
            Products
          </Link>
          <Link to="/insight" className="hidden sm:block text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
            Dashboard
          </Link>
          <Link 
            to="/admin" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
          >
            Admin Panel
          </Link>
        </div>
      </nav>

      {/* Hero Section with Canvas Background */}
      <section className="relative min-h-[85vh] flex items-start justify-center overflow-hidden bg-white">
        {/* Gradient Overlays */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>

        {/* Canvas-type Box Container */}
        <div className="relative z-10 w-full max-w-none mx-auto px-2 lg:px-4 pb-16">
          <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-800 shadow-2xl shadow-gray-900/20 p-16 lg:p-20 relative overflow-hidden min-h-[70vh] mx-4">
            {/* Grid Background INSIDE the canvas box */}
            <div className="absolute inset-0 z-0">
              <GridCanvas />
            </div>
            
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 pointer-events-none z-10"></div>
            {/* Prominent inner border */}
            <div className="absolute inset-4 border border-gray-300 pointer-events-none z-20"></div>
            {/* Hero Content */}
            <div className="text-center relative z-30">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">Dare 2 Dream VC Hackathon Project</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-gradient">AI-Driven Qualitative</span>
                <br />
                <span className="text-gray-800">Market Research Platform</span>
              </h1>
              
              <p className="text-gray-600 mb-10 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                Transform market research with autonomous AI interviews that reduce costs by 70%, 
                eliminate human error, and deliver insights in record time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link 
                  to="/interview" 
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 inline-flex items-center gap-2"
                >
                  Start Free Interview
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/insight" 
                  className="bg-white border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 hover:scale-105 text-gray-700 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-indigo-500/20"
                >
                  View Insights
                </Link>
              </div>
              
              <div className="text-sm text-gray-500">
                No credit card required • 5-minute setup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
            <div className="group hover:scale-105 transition-transform">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">60-70%</div>
              <div className="text-blue-100">Cost Reduction</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">$20B</div>
              <div className="text-purple-100">Annual Market Opportunity</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">10x</div>
              <div className="text-blue-100">Faster Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">The Challenge We're Solving</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Traditional market research is broken. Manual processes cost billions and slow down critical business decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 hover:border-red-300 transition-all shadow-lg">
            <h3 className="text-2xl font-bold text-red-700 mb-6">Current Pain Points</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-600 font-bold mt-1">✗</span>
                <span>Manual respondent recruitment and scheduling delays</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-600 font-bold mt-1">✗</span>
                <span>Human moderator fatigue and consistency issues</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-600 font-bold mt-1">✗</span>
                <span>Labor-intensive recording and analysis prone to errors</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-600 font-bold mt-1">✗</span>
                <span>High field costs reaching $20B annually</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 hover:border-green-300 transition-all shadow-lg">
            <h3 className="text-2xl font-bold text-green-700 mb-6">Our AI Solution</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Automated 24/7 interview scheduling and execution</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Consistent, unbiased AI-driven conversations</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Instant transcription and intelligent analysis</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Billions in cost savings for research firms</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="relative z-10 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">Core Functionality</h2>
            <p className="text-gray-600 text-lg">
              Powered by advanced AI to deliver human-like research interviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MessageSquare,
                title: "Conversational AI Agent",
                description: "Advanced chatbot capable of asking nuanced, open-ended questions that feel natural and engaging.",
                color: "blue"
              },
              {
                icon: TrendingUp,
                title: "Adaptive Probing",
                description: "Intelligently digs deeper based on responses, prompting for elaboration where needed to uncover insights.",
                color: "purple"
              },
              {
                icon: Zap,
                title: "Instant Insights",
                description: "Automatically synthesizes findings and generates comprehensive summaries upon interview completion.",
                color: "green"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-white border border-gray-200 hover:border-blue-300 rounded-2xl p-8 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">How It Works</h2>
          <p className="text-gray-600 text-lg">
            Three simple steps to revolutionize your market research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Set Up Your Study", description: "Define your research objectives, target audience, and key questions in minutes.", color: "from-blue-500 to-blue-600" },
            { step: "2", title: "AI Conducts Interviews", description: "Our AI agent autonomously interviews 10-20 respondents with human-like conversation.", color: "from-purple-500 to-purple-600" },
            { step: "3", title: "Get Actionable Insights", description: "Receive synthesized findings, key themes, and strategic recommendations instantly.", color: "from-green-500 to-green-600" }
          ].map((item, index) => (
            <div key={index} className="text-center group">
              <div className={`w-20 h-20 bg-gradient-to-br ${item.color} text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business Impact */}
      <section className="relative z-10 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">Business Impact</h2>
            <p className="text-gray-600 text-lg">
              Transforming the $50 billion market research industry
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: DollarSign, title: "Cost Efficiency", description: "Reduce field costs by 60-70%, saving billions annually.", color: "text-green-600" },
              { icon: Clock, title: "Speed to Insights", description: "Accelerate research cycles from weeks to days.", color: "text-blue-600" },
              { icon: Users, title: "Scale Effortlessly", description: "Conduct hundreds of interviews simultaneously.", color: "text-purple-600" },
              { icon: Zap, title: "Zero Human Error", description: "Eliminate inconsistencies and bias from moderators.", color: "text-orange-600" },
              { icon: TrendingUp, title: "Better Quality", description: "Consistent probing leads to richer, more reliable data.", color: "text-indigo-600" },
              { icon: MessageSquare, title: "24/7 Availability", description: "No scheduling constraints for respondents.", color: "text-pink-600" }
            ].map((impact, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all hover:scale-105 shadow-lg">
                <impact.icon className={`w-10 h-10 ${impact.color} mb-4`} />
                <h3 className="text-lg font-bold mb-2 text-gray-900">{impact.title}</h3>
                <p className="text-gray-600 text-sm">{impact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Market Research?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join the AI revolution and start conducting smarter interviews today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/interview" 
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 hover:scale-105 hover:text-blue-700 transition-all duration-300 shadow-xl hover:shadow-gray-200/50 inline-flex items-center justify-center gap-2 group"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/dashboard" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 hover:scale-105 hover:border-white/80 transition-all duration-300"
            >
              View Dashboard
            </Link>
          </div>
          <p className="text-white/80 text-sm mt-6">Dare 2 Dream VC Hackathon Submission • Built with ❤️ for researchers</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">ResearchAI</span>
              </div>
              <p className="text-gray-600 text-sm">
                Revolutionizing market research with AI-powered interviews.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Demo</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition">About</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Team</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">API</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2024 ResearchAI. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition">Terms</a>
              <a href="#" className="hover:text-gray-900 transition">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;