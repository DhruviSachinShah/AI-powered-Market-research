/**
 * List Available Gemini Models
 * 
 * This script lists all available models from the Gemini API
 * to help identify the correct model name to use.
 */

const https = require('https');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listAvailableModels() {
  if (!GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY environment variable is not set');
    console.log('Please set it in your .env file first');
    return;
  }

  try {
    console.log('🔍 Fetching available Gemini models...\n');
    
    // Make direct HTTP request to Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    
    const response = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
    
    const models = response.models;
    
    console.log(`📋 Found ${models.length} available models:\n`);
    
    models.forEach((model, index) => {
      console.log(`${index + 1}. Model Name: ${model.name}`);
      console.log(`   Display Name: ${model.displayName || 'N/A'}`);
      console.log(`   Description: ${model.description || 'N/A'}`);
      console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      console.log('');
    });
    
    // Filter for models that support generateContent
    const supportedModels = models.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    );
    
    console.log(`\n✅ Models that support generateContent (${supportedModels.length}):`);
    supportedModels.forEach(model => {
      console.log(`   - ${model.name}`);
    });
    
    // Recommend the best model to use
    const recommendedModel = supportedModels.find(model => 
      model.name.includes('gemini-pro')
    ) || supportedModels[0];
    
    if (recommendedModel) {
      console.log(`\n🎯 Recommended model: ${recommendedModel.name}`);
      console.log('Update your code to use this model name.');
    }
    
  } catch (error) {
    console.error('❌ Error fetching models:', error.message);
    
    if (error.message.includes('404')) {
      console.log('\n💡 This might be an API key issue or the API endpoint has changed.');
    }
  }
}

if (require.main === module) {
  listAvailableModels();
}

module.exports = { listAvailableModels };
