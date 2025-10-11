/**
 * Standalone Gemini API Testing Script
 * 
 * This script tests the Gemini API with hardcoded interview response data
 * without requiring the full backend API to be running.
 * 
 * Usage:
 * 1. Set your GEMINI_API_KEY in environment variables
 * 2. Run: node test-gemini-standalone.js
 *    or: GEMINI_API_KEY=your_key node test-gemini-standalone.js
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// ===== CONFIGURATION =====
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ===== HARDCODED TEST DATA =====
const sampleProductData = {
  productName: 'Smart Home Security System',
  productDescription: 'AI-powered home security system with facial recognition, motion sensors, and integrated smart doorbell. Features real-time alerts, cloud storage, and voice assistant compatibility.',
  targetAudience: 'Homeowners aged 30-55, tech-savvy, security-conscious, middle to upper-middle income',
  totalInterviews: 5
};

// ===== SCHEMA-COMPLIANT TEST DATA =====
const sampleSchemaData = {
  // StdInterviewQues schema format
  stdInterviewQues: {
    _id: "ques_12345",
    product: "prod_67890", // ObjectId reference
    questions: [
      "On a scale of 1-10, how concerned are you about home security?",
      "How likely are you to purchase a smart home security system in the next 6 months?",
      "What is your current monthly budget for home security (including monitoring fees)?",
      "How comfortable are you with facial recognition technology in your home?",
      "Which features are most important to you? (Rank top 3)"
    ]
  },
  
  // StdIqResponse schema format - Multiple responses from different interviews
  stdIqResponses: [
    {
      _id: "res_001",
      interview: "int_001",
      ques: "ques_12345",
      responses: {
        question1: "8",
        question2: "7",
        question3: "$50-100",
        question4: "Very comfortable",
        question5: ["Motion sensors", "Real-time alerts", "Cloud storage"]
      }
    },
    {
      _id: "res_002", 
      interview: "int_002",
      ques: "ques_12345",
      responses: {
        question1: "9",
        question2: "8", 
        question3: "$100-150",
        question4: "Somewhat comfortable",
        question5: ["Facial recognition", "Motion sensors", "Voice assistant"]
      }
    },
    {
      _id: "res_003",
      interview: "int_003", 
      ques: "ques_12345",
      responses: {
        question1: "7",
        question2: "6",
        question3: "$50-100", 
        question4: "Neutral",
        question5: ["Real-time alerts", "Cloud storage", "Motion sensors"]
      }
    },
    {
      _id: "res_004",
      interview: "int_004",
      ques: "ques_12345", 
      responses: {
        question1: "8",
        question2: "9",
        question3: "$150-200",
        question4: "Very comfortable", 
        question5: ["Facial recognition", "Real-time alerts", "Motion sensors"]
      }
    },
    {
      _id: "res_005",
      interview: "int_005",
      ques: "ques_12345",
      responses: {
        question1: "6",
        question2: "5", 
        question3: "$25-50",
        question4: "Somewhat uncomfortable",
        question5: ["Real-time alerts", "Motion sensors", "Cloud storage"]
      }
    }
  ]
};

// Generate schema-compliant responses text
const sampleResponsesText = `
PRODUCT ANALYSIS: Smart Home Security System
Product Description: AI-powered home security system with facial recognition, motion sensors, and integrated smart doorbell. Features real-time alerts, cloud storage, and voice assistant compatibility.
Target Audience: Homeowners aged 30-55, tech-savvy, security-conscious, middle to upper-middle income
Total Interviews Conducted: 5

STANDARD INTERVIEW QUESTIONS:
============================
Product ID: ${sampleSchemaData.stdInterviewQues.product}
Questions Set ID: ${sampleSchemaData.stdInterviewQues._id}

QUESTION 1: ${sampleSchemaData.stdInterviewQues.questions[0]}
QUESTION 2: ${sampleSchemaData.stdInterviewQues.questions[1]}
QUESTION 3: ${sampleSchemaData.stdInterviewQues.questions[2]}
QUESTION 4: ${sampleSchemaData.stdInterviewQues.questions[3]}
QUESTION 5: ${sampleSchemaData.stdInterviewQues.questions[4]}

INTERVIEW RESPONSES (Schema Format):
====================================

INTERVIEW 1 (ID: int_001):
  Question 1 Response: ${sampleSchemaData.stdIqResponses[0].responses.question1}
  Question 2 Response: ${sampleSchemaData.stdIqResponses[0].responses.question2}
  Question 3 Response: ${sampleSchemaData.stdIqResponses[0].responses.question3}
  Question 4 Response: ${sampleSchemaData.stdIqResponses[0].responses.question4}
  Question 5 Response: ${JSON.stringify(sampleSchemaData.stdIqResponses[0].responses.question5)}

INTERVIEW 2 (ID: int_002):
  Question 1 Response: ${sampleSchemaData.stdIqResponses[1].responses.question1}
  Question 2 Response: ${sampleSchemaData.stdIqResponses[1].responses.question2}
  Question 3 Response: ${sampleSchemaData.stdIqResponses[1].responses.question3}
  Question 4 Response: ${sampleSchemaData.stdIqResponses[1].responses.question4}
  Question 5 Response: ${JSON.stringify(sampleSchemaData.stdIqResponses[1].responses.question5)}

INTERVIEW 3 (ID: int_003):
  Question 1 Response: ${sampleSchemaData.stdIqResponses[2].responses.question1}
  Question 2 Response: ${sampleSchemaData.stdIqResponses[2].responses.question2}
  Question 3 Response: ${sampleSchemaData.stdIqResponses[2].responses.question3}
  Question 4 Response: ${sampleSchemaData.stdIqResponses[2].responses.question4}
  Question 5 Response: ${JSON.stringify(sampleSchemaData.stdIqResponses[2].responses.question5)}

INTERVIEW 4 (ID: int_004):
  Question 1 Response: ${sampleSchemaData.stdIqResponses[3].responses.question1}
  Question 2 Response: ${sampleSchemaData.stdIqResponses[3].responses.question2}
  Question 3 Response: ${sampleSchemaData.stdIqResponses[3].responses.question3}
  Question 4 Response: ${sampleSchemaData.stdIqResponses[3].responses.question4}
  Question 5 Response: ${JSON.stringify(sampleSchemaData.stdIqResponses[3].responses.question5)}

INTERVIEW 5 (ID: int_005):
  Question 1 Response: ${sampleSchemaData.stdIqResponses[4].responses.question1}
  Question 2 Response: ${sampleSchemaData.stdIqResponses[4].responses.question2}
  Question 3 Response: ${sampleSchemaData.stdIqResponses[4].responses.question3}
  Question 4 Response: ${sampleSchemaData.stdIqResponses[4].responses.question4}
  Question 5 Response: ${JSON.stringify(sampleSchemaData.stdIqResponses[4].responses.question5)}

SUMMARY:
========
Total Questions: ${sampleSchemaData.stdInterviewQues.questions.length}
Total Interview Responses: ${sampleSchemaData.stdIqResponses.length}
Total Individual Responses: ${sampleSchemaData.stdIqResponses.length * sampleSchemaData.stdInterviewQues.questions.length}
Average Responses per Question: ${(sampleSchemaData.stdIqResponses.length * sampleSchemaData.stdInterviewQues.questions.length) / sampleSchemaData.stdInterviewQues.questions.length}

RESPONSE DATA STRUCTURE:
- Each interview has a unique ID (int_001, int_002, etc.)
- Each response set references a questions set (ques_12345)
- Responses are stored as key-value pairs (question1, question2, etc.)
- Multiple choice responses are stored as arrays
- All responses follow the StdIqResponse schema format
`;

// ===== GEMINI SERVICE CLASS =====
class GeminiService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set. Please set it in your .env file or as an environment variable.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateProductInsights(responsesText) {
    try {
      console.log('🤖 Sending request to Gemini API...');
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

      const prompt = `
You are a data analyst specializing in market research. I will provide you with interview responses for a specific product, and you need to analyze them and return quantitative insights in a specific JSON format.

INSTRUCTIONS:
1. Analyze the provided interview responses
2. Identify patterns, trends, and quantitative data points
3. For each question or topic, determine the appropriate visualization type
4. Return the data in the exact JSON format specified below

RESPONSE FORMAT:
Return an array of objects, where each object represents one insight with the following structure:

{
  "question_text": "string",        // The survey/question text or topic being analyzed
  "question_type": "string",        // rating, likert, nps, multiple_choice, scale, percentage, etc.
  "visualization_type": "string",   // bar_chart, pie_chart, stacked_bar_chart, gauge_chart, heatmap, line_chart
  "chart_data": {
    "labels": ["string"],           // e.g., ["1", "2", "3"] or ["Feature A", "Feature B"] or ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    "datasets": [
      {
        "label": "string",          // e.g., "Responses", "Count", "Percentage"
        "data": [number],           // numeric values corresponding to labels
        "backgroundColor": ["string"], // colors for chart segments (hex codes)
        "borderColor": ["string"],     // optional - border colors
        "borderWidth": number          // optional - border width
      }
    ]
  }
}

VISUALIZATION TYPES:
- bar_chart: For comparing categories or ratings
- pie_chart: For showing proportions/percentages
- stacked_bar_chart: For showing parts of a whole across categories
- gauge_chart: For single metrics or scores
- heatmap: For correlation or frequency analysis
- line_chart: For trends over time

QUESTION TYPES:
- rating: Numeric ratings (1-10, 1-5)
- likert: Likert scale responses
- nps: Net Promoter Score
- multiple_choice: Multiple choice questions
- scale: Various scales
- percentage: Percentage-based responses

COLOR SCHEMES (use these hex codes):
- Primary: #3B82F6 (blue)
- Success: #10B981 (green)
- Warning: #F59E0B (yellow)
- Danger: #EF4444 (red)
- Purple: #8B5CF6
- Pink: #EC4899
- Indigo: #6366F1
- Gray: #6B7280

INTERVIEW RESPONSES TO ANALYZE:
${responsesText}

Please analyze these responses and return the insights in the exact JSON format specified above. Focus on quantitative patterns and trends. Return only valid JSON, no additional text.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('📊 Raw AI Response:');
      console.log('=' .repeat(50));
      console.log(text);
      console.log('=' .repeat(50));

      // Clean the response text - remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Parse the JSON response
      const insights = JSON.parse(cleanText);
      
      // Validate the response structure
      this.validateInsightFormat(insights);
      
      return insights;
    } catch (error) {
      console.error('❌ Error generating product insights:', error);
      throw new Error(`Failed to generate insights: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  validateInsightFormat(insights) {
    if (!Array.isArray(insights)) {
      throw new Error('Response must be an array of insights');
    }

    for (const insight of insights) {
      if (!insight.question_text || typeof insight.question_text !== 'string') {
        throw new Error('Each insight must have a valid question_text string');
      }
      
      if (!insight.question_type || typeof insight.question_type !== 'string') {
        throw new Error('Each insight must have a valid question_type string');
      }
      
      if (!insight.visualization_type || typeof insight.visualization_type !== 'string') {
        throw new Error('Each insight must have a valid visualization_type string');
      }
      
      if (!insight.chart_data || typeof insight.chart_data !== 'object') {
        throw new Error('Each insight must have a valid chart_data object');
      }
      
      if (!Array.isArray(insight.chart_data.labels)) {
        throw new Error('chart_data.labels must be an array');
      }
      
      if (!Array.isArray(insight.chart_data.datasets)) {
        throw new Error('chart_data.datasets must be an array');
      }
      
      for (const dataset of insight.chart_data.datasets) {
        if (!dataset.label || typeof dataset.label !== 'string') {
          throw new Error('Each dataset must have a valid label string');
        }
        
        if (!Array.isArray(dataset.data)) {
          throw new Error('Each dataset must have a data array');
        }
        
        if (!Array.isArray(dataset.backgroundColor)) {
          throw new Error('Each dataset must have a backgroundColor array');
        }
      }
    }
  }

  async testConnection() {
    try {
      console.log('🔌 Testing Gemini API connection...');
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
      const result = await model.generateContent('Test connection - respond with "OK"');
      const response = await result.response;
      const text = response.text();
      return text.trim().toLowerCase().includes('ok');
    } catch (error) {
      console.error('❌ Gemini API connection test failed:', error);
      return false;
    }
  }
}

// ===== TESTING FUNCTIONS =====
async function testGeminiConnection() {
  console.log('\n🧪 Testing Gemini API Connection');
  console.log('=' .repeat(40));
  
  try {
    const geminiService = new GeminiService(GEMINI_API_KEY);
    const isConnected = await geminiService.testConnection();
    
    if (isConnected) {
      console.log('✅ Gemini API connection successful!');
      return true;
    } else {
      console.log('❌ Gemini API connection failed!');
      return false;
    }
  } catch (error) {
    console.log('❌ Error testing connection:', error.message);
    return false;
  }
}

async function testInsightGeneration() {
  console.log('\n📊 Testing Product Insights Generation');
  console.log('=' .repeat(40));
  
  try {
    const geminiService = new GeminiService(GEMINI_API_KEY);
    
    console.log('📝 Sample Product Data:');
    console.log(`   Product: ${sampleProductData.productName}`);
    console.log(`   Total Interviews: ${sampleProductData.totalInterviews}`);
    console.log(`   Target Audience: ${sampleProductData.targetAudience}`);
    
    console.log('\n📋 Schema-Compliant Response Data:');
    console.log(`   Questions Set ID: ${sampleSchemaData.stdInterviewQues._id}`);
    console.log(`   Product Reference: ${sampleSchemaData.stdInterviewQues.product}`);
    console.log(`   Total Questions: ${sampleSchemaData.stdInterviewQues.questions.length}`);
    console.log(`   Total Response Sets: ${sampleSchemaData.stdIqResponses.length}`);
    
    console.log('\n📊 Sample Responses (Schema Format):');
    sampleSchemaData.stdIqResponses.forEach((response, index) => {
      console.log(`   Interview ${index + 1} (${response.interview}):`);
      console.log(`     Q1: ${response.responses.question1}`);
      console.log(`     Q2: ${response.responses.question2}`);
      console.log(`     Q3: ${response.responses.question3}`);
      console.log(`     Q4: ${response.responses.question4}`);
      console.log(`     Q5: ${JSON.stringify(response.responses.question5)}`);
    });
    
    const insights = await geminiService.generateProductInsights(sampleResponsesText);
    
    console.log('\n✅ Successfully generated insights!');
    console.log(`📈 Total insights generated: ${insights.length}`);
    
    return insights;
  } catch (error) {
    console.log('❌ Error generating insights:', error.message);
    throw error;
  }
}

function displayInsights(insights) {
  console.log('\n📊 Generated Insights Summary');
  console.log('=' .repeat(40));
  
  insights.forEach((insight, index) => {
    console.log(`\n${index + 1}. ${insight.question_text}`);
    console.log(`   Type: ${insight.question_type}`);
    console.log(`   Visualization: ${insight.visualization_type}`);
    console.log(`   Labels: [${insight.chart_data.labels.join(', ')}]`);
    console.log(`   Data: [${insight.chart_data.datasets[0].data.join(', ')}]`);
    console.log(`   Colors: [${insight.chart_data.datasets[0].backgroundColor.slice(0, 3).join(', ')}...]`);
  });
}

function displayJsonOutput(insights) {
  console.log('\n📄 Complete JSON Output');
  console.log('=' .repeat(40));
  console.log(JSON.stringify(insights, null, 2));
}

async function runCompleteTest() {
  console.log('🚀 Gemini API Standalone Test');
  console.log('=' .repeat(50));
  console.log('This script tests the Gemini API with hardcoded interview data');
  console.log('without requiring the full backend API to be running.\n');
  
  // Check API key
  if (!GEMINI_API_KEY) {
    console.log('⚠️  WARNING: GEMINI_API_KEY environment variable is not set');
    console.log('Please set it in one of these ways:');
    console.log('1. Add GEMINI_API_KEY=your_key_here to your .env file');
    console.log('2. Run: GEMINI_API_KEY=your_key_here node test-gemini-standalone.js');
    console.log('3. Export: export GEMINI_API_KEY=your_key_here');
    console.log('\nGet your API key from: https://makersuite.google.com/app/apikey');
    console.log('\nFor demonstration, showing the expected output format...');
    
    // Show sample output
    const sampleOutput = [
      {
        "question_text": "Security Concern Level (1-10 scale)",
        "question_type": "rating",
        "visualization_type": "bar_chart",
        "chart_data": {
          "labels": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          "datasets": [
            {
              "label": "Responses",
              "data": [0, 0, 0, 0, 0, 1, 1, 3, 0, 0],
              "backgroundColor": ["#6B7280", "#6B7280", "#6B7280", "#6B7280", "#6B7280", "#F59E0B", "#F59E0B", "#EF4444", "#EF4444", "#EF4444"]
            }
          ]
        }
      }
    ];
    
    console.log('\n📄 Sample Expected Output:');
    console.log(JSON.stringify(sampleOutput, null, 2));
    return;
  }
  
  try {
    // Step 1: Test connection
    const isConnected = await testGeminiConnection();
    if (!isConnected) {
      console.log('\n❌ Cannot proceed without API connection');
      return;
    }
    
    // Step 2: Generate insights
    const insights = await testInsightGeneration();
    
    // Step 3: Display results
    displayInsights(insights);
    displayJsonOutput(insights);
    
    console.log('\n✅ Test completed successfully!');
    console.log('🎉 The Gemini API is working correctly with your interview data format.');
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your GEMINI_API_KEY environment variable is set correctly');
    console.log('2. Verify your internet connection');
    console.log('3. Check if you have API quota remaining');
    console.log('4. Try again in a few minutes if rate limited');
    console.log('5. Make sure your .env file is in the same directory as the script');
  }
}

// ===== MAIN EXECUTION =====
if (require.main === module) {
  runCompleteTest().catch(console.error);
}

module.exports = {
  GeminiService,
  testGeminiConnection,
  testInsightGeneration,
  sampleProductData,
  sampleSchemaData,
  sampleResponsesText
};
