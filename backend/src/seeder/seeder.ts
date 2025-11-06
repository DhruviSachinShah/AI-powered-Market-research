const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Interview = require('../models/Interview');
const StdInterviewQues = require('../models/StdInterviewQues');
const StdIqResponse = require('../models/StdIqResponse');
const Followup = require('../models/Followup');
const InterviewInsights = require('../models/InterviewInsights');
const ProductInsights = require('../models/ProductInsights');

const seedData = {
  users: [
    {
      user_name: "Sarah Chen",
      user_type: "Software Engineer"
    },
    {
      user_name: "Marcus Johnson",
      user_type: "Fitness Instructor"
    },
    {
      user_name: "Priya Patel",
      user_type: "College Student"
    },
    {
      user_name: "David Kim",
      user_type: "Marketing Manager"
    },
    {
      user_name: "Emma Rodriguez",
      user_type: "Freelance Designer"
    }
  ],
  
  products: [
    {
      prod_name: "Smart Home Security System",
      category: "Smart Home Technology",
      prod_desc: "AI-powered home security system with facial recognition, motion sensors, and integrated smart doorbell. Features real-time alerts, cloud storage, and voice assistant compatibility.",
      prod_price: 299.99,
      target_audience: "Homeowners aged 30-55, tech-savvy, security-conscious, middle to upper-middle income"
    },
    {
      prod_name: "Organic Protein Powder",
      category: "Health & Wellness",
      prod_desc: "Organic plant-based protein powder made from pea, hemp, and brown rice proteins. Non-GMO, gluten-free, with added probiotics and digestive enzymes. Available in vanilla, chocolate, and unflavored.",
      prod_price: 39.99,
      target_audience: "Health-conscious adults aged 25-45, fitness enthusiasts, vegetarians/vegans, environmentally aware consumers"
    },
    {
      prod_name: "Eco-friendly Sneakers",
      category: "Sustainable Fashion",
      prod_desc: "Eco-friendly sneakers made from recycled ocean plastic and natural rubber. Carbon-neutral production, machine washable, with replaceable insoles. Modern minimalist design available in 8 colors.",
      prod_price: 89.99,
      target_audience: "Environmentally conscious millennials and Gen Z, aged 18-35, urban lifestyle, values sustainability"
    }
  ],
  
  interview: [
    {
      user: "USR001",
      product: "PRD001"
    },
    {
      user: "USR002",
      product: "PRD002"
    },
    {
      user: "USR003",
      product: "PRD003"
    },
    {
      user: "USR001",
      product: "PRD002"
    },
    {
      user: "USR002",
      product: "PRD001"
    }
  ],
  
  std_interview_ques: [
    {
      product: "PRD001",
      questions: [
        "On a scale of 1-10, how concerned are you about home security?",
        "How likely are you to purchase a smart home security system in the next 6 months?",
        "What is your current monthly budget for home security (including monitoring fees)?",
        "How comfortable are you with facial recognition technology in your home?",
        "Which features are most important to you? (Rank top 3)"
      ]
    },
    {
      product: "PRD002",
      questions: [
        "How many times per week do you exercise or engage in physical activity?",
        "On a scale of 1-10, how important is organic certification when purchasing food products?",
        "What is the maximum you would pay for a 30-serving container of premium protein powder?",
        "How satisfied are you with your current protein supplement (if you use one)?",
        "Rate the importance of each factor in your protein powder decision"
      ]
    },
    {
      product: "PRD003",
      questions: [
        "How many pairs of sneakers do you purchase per year?",
        "On a scale of 1-10, how important is environmental sustainability in your purchasing decisions?",
        "How much more would you pay for eco-friendly sneakers compared to regular sneakers?",
        "How likely are you to recommend sustainable fashion brands to friends?",
        "Rank these factors by importance when buying sneakers"
      ]
    }
  ],
  
  std_iq_response: [
    {
      interview: "INT001",
      product: "PRD001",
      responses: []
    },
    {
      interview: "INT002",
      product: "PRD002",
      responses: []
    },
    {
      interview: "INT003",
      product: "PRD003",
      responses: []
    },
    {
      interview: "INT004",
      product: "PRD002",
      responses: []
    },
    {
      interview: "INT005",
      product: "PRD001",
      responses: []
    }
  ],
  
  followup: [
    {
      interview: null,
      followup_ques: null,
      followup_response: null
    }
  ],
  
  interview_insights: [
    {
      interview: null,
      interview_report: null
    }
  ],
  
  product_insights: [
    {
      product: null,
      product_report: null
    }
  ]
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/market_research', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Interview.deleteMany({});
    await StdInterviewQues.deleteMany({});
    await StdIqResponse.deleteMany({});
    await Followup.deleteMany({});
    await InterviewInsights.deleteMany({});
    await ProductInsights.deleteMany({});

    console.log('Existing data cleared...');

    // Insert seed data
    await User.insertMany(seedData.users);
    console.log('Users seeded...');

    await Product.insertMany(seedData.products);
    console.log('Products seeded...');

    await Interview.insertMany(seedData.interview);
    console.log('Interviews seeded...');

    await StdInterviewQues.insertMany(seedData.std_interview_ques);
    console.log('Standard Interview Questions seeded...');

    await StdIqResponse.insertMany(seedData.std_iq_response);
    console.log('Standard Interview Responses seeded...');

    await Followup.insertMany(seedData.followup);
    console.log('Followups seeded...');

    await InterviewInsights.insertMany(seedData.interview_insights);
    console.log('Interview Insights seeded...');

    await ProductInsights.insertMany(seedData.product_insights);
    console.log('Product Insights seeded...');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();