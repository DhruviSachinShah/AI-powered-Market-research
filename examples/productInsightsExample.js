/**
 * Product Insights API Usage Examples
 * 
 * This script demonstrates how to use the Product Insights API
 * to generate AI-powered insights from interview responses.
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const GEMINI_API_KEY = 'your_gemini_api_key_here'; // Replace with your actual key

// Helper function to make API calls
async function makeApiCall(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error.response?.data || error.message);
    throw error;
  }
}

// Example 1: Test Gemini API Connection
async function testGeminiConnection() {
  console.log('\n=== Testing Gemini API Connection ===');
  
  try {
    const result = await makeApiCall('GET', '/product-insights/test/gemini');
    console.log('Gemini API Status:', result);
  } catch (error) {
    console.error('Failed to connect to Gemini API:', error.message);
  }
}

// Example 2: Get All Products with Response Counts
async function getAllProductsWithResponses() {
  console.log('\n=== Getting All Products with Response Counts ===');
  
  try {
    const result = await makeApiCall('GET', '/product-insights');
    console.log('Products with response counts:', result);
    return result.data;
  } catch (error) {
    console.error('Failed to get products:', error.message);
    return [];
  }
}

// Example 3: Generate Product Insights
async function generateProductInsights(productId) {
  console.log(`\n=== Generating Product Insights for Product ${productId} ===`);
  
  try {
    const result = await makeApiCall('POST', `/product-insights/generate/${productId}`);
    console.log('Generated insights:', JSON.stringify(result, null, 2));
    return result.data;
  } catch (error) {
    console.error('Failed to generate insights:', error.message);
    throw error;
  }
}

// Example 4: Get Existing Product Insights
async function getProductInsights(productId) {
  console.log(`\n=== Getting Product Insights for Product ${productId} ===`);
  
  try {
    const result = await makeApiCall('GET', `/product-insights/${productId}`);
    console.log('Retrieved insights:', JSON.stringify(result, null, 2));
    return result.data;
  } catch (error) {
    console.error('Failed to get insights:', error.message);
    throw error;
  }
}

// Example 5: Complete Workflow
async function completeWorkflow() {
  console.log('\n=== Complete Product Insights Workflow ===');
  
  try {
    // Step 1: Test connection
    await testGeminiConnection();
    
    // Step 2: Get all products
    const products = await getAllProductsWithResponses();
    
    if (products.length === 0) {
      console.log('No products found with responses. Please ensure you have:');
      console.log('1. Created products');
      console.log('2. Created interviews for those products');
      console.log('3. Added responses to those interviews');
      return;
    }
    
    // Step 3: Find a product with responses
    const productWithResponses = products.find(p => p.hasResponses && !p.insightsGenerated);
    
    if (!productWithResponses) {
      console.log('No products found that need insights generation.');
      console.log('Available products:', products.map(p => ({
        id: p.productId,
        name: p.productName,
        hasResponses: p.hasResponses,
        insightsGenerated: p.insightsGenerated
      })));
      return;
    }
    
    console.log(`\nSelected product: ${productWithResponses.productName} (ID: ${productWithResponses.productId})`);
    
    // Step 4: Generate insights
    const insights = await generateProductInsights(productWithResponses.productId);
    
    // Step 5: Retrieve the generated insights
    const retrievedInsights = await getProductInsights(productWithResponses.productId);
    
    console.log('\n=== Workflow Complete ===');
    console.log(`Successfully generated ${retrievedInsights.productReport.insights.length} insights for product: ${productWithResponses.productName}`);
    
    // Display sample insights
    if (retrievedInsights.productReport.insights.length > 0) {
      console.log('\nSample Insight:');
      console.log(JSON.stringify(retrievedInsights.productReport.insights[0], null, 2));
    }
    
  } catch (error) {
    console.error('Workflow failed:', error.message);
  }
}

// Example 6: Sample Data Setup (for testing)
async function setupSampleData() {
  console.log('\n=== Setting Up Sample Data ===');
  
  try {
    // Create a sample user
    const user = await makeApiCall('POST', '/users', {
      user_name: 'Test User',
      user_type: 'Software Engineer'
    });
    console.log('Created user:', user.data);
    
    // Create a sample product
    const product = await makeApiCall('POST', '/products', {
      prod_name: 'Sample Product',
      category: 'Technology',
      prod_desc: 'A sample product for testing insights generation',
      prod_price: 99.99,
      target_audience: 'Tech enthusiasts'
    });
    console.log('Created product:', product.data);
    
    // Create standard questions for the product
    const questions = await makeApiCall('POST', '/stdiq', {
      product: product.data._id,
      questions: [
        'How likely are you to purchase this product? (1-10)',
        'What is your biggest concern about this product?',
        'How much would you pay for this product?',
        'Rate the importance of these features (1-5): Design, Performance, Price'
      ]
    });
    console.log('Created questions:', questions.data);
    
    // Create an interview
    const interview = await makeApiCall('POST', '/interviews', {
      user: user.data.user_name,
      product: product.data._id
    });
    console.log('Created interview:', interview.data);
    
    // Add responses to the interview
    const responses = await makeApiCall('POST', '/stdiqres', {
      interview: interview.data._id,
      ques: questions.data._id,
      responses: {
        question1: '8',
        question2: 'Price is too high',
        question3: '$50-75',
        question4: 'Design: 4, Performance: 5, Price: 3'
      }
    });
    console.log('Added responses:', responses.data);
    
    console.log('\nSample data setup complete!');
    console.log(`You can now generate insights for product: ${product.data._id}`);
    
    return product.data._id;
    
  } catch (error) {
    console.error('Failed to setup sample data:', error.message);
  }
}

// Main execution
async function main() {
  console.log('Product Insights API Examples');
  console.log('============================');
  
  // Check if GEMINI_API_KEY is set
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log('\n⚠️  WARNING: Please set your GEMINI_API_KEY in the script');
    console.log('Get your API key from: https://makersuite.google.com/app/apikey');
    console.log('\nFor now, running examples without AI generation...');
  }
  
  try {
    // Run the complete workflow
    await completeWorkflow();
    
    // Uncomment the line below to setup sample data if needed
    // await setupSampleData();
    
  } catch (error) {
    console.error('Main execution failed:', error.message);
  }
}

// Export functions for use in other scripts
module.exports = {
  testGeminiConnection,
  getAllProductsWithResponses,
  generateProductInsights,
  getProductInsights,
  completeWorkflow,
  setupSampleData
};

// Run if this script is executed directly
if (require.main === module) {
  main();
}
