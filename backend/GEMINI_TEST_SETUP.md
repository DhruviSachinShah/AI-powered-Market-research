# Gemini API Standalone Testing

This guide helps you test the Gemini API integration with hardcoded data without setting up the full backend API.

## Quick Setup

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Install Dependencies

```bash
npm install @google/generative-ai
```

### 3. Configure Environment Variables

Create or update your `.env` file in the backend directory:

```bash
# Add your Gemini API key to .env file
GEMINI_API_KEY=your_actual_api_key_here
```

Alternatively, you can set it as an environment variable when running the script:

```bash
GEMINI_API_KEY=your_actual_api_key_here node test-gemini-standalone.js
```

### 4. Run the Test

```bash
# Option 1: Using npm script
npm run test-gemini

# Option 2: Direct execution
node test-gemini-standalone.js
```

## What the Test Does

The standalone test script:

1. **Tests Connection**: Verifies your Gemini API key works
2. **Uses Hardcoded Data**: Tests with realistic interview response data
3. **Generates Insights**: Creates chart-ready JSON insights
4. **Validates Output**: Ensures the response matches your expected format
5. **Displays Results**: Shows formatted insights and raw JSON

## Sample Test Data

The script includes realistic test data for a "Smart Home Security System":

- **5 Interview Responses** with different question types
- **Rating Questions** (1-10 scales)
- **Multiple Choice Questions** (budget ranges, comfort levels)
- **Ranking Questions** (feature importance)

## Expected Output

The test will generate insights like:

```json
[
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
]
```

## Troubleshooting

### "GEMINI_API_KEY environment variable is not set"
- Make sure you've added the API key to your `.env` file
- Or set it as an environment variable when running the script
- The key should be a string like: `AIzaSyC...`

### "API connection failed"
- Check your internet connection
- Verify the API key is correct
- Check if you have API quota remaining

### "Invalid JSON response"
- This is normal for testing - the AI might return slightly different formats
- The validation will catch any major issues
- You can adjust the prompt in the script if needed

### Rate Limiting
- If you get rate limit errors, wait a few minutes and try again
- The free tier has usage limits

## Customizing Test Data

You can modify the test data in the script:

```javascript
const sampleResponsesText = `
// Your custom interview data here
`;
```

## Next Steps

Once the standalone test works:

1. The same Gemini service will work in your full API
2. You can integrate it with your existing product insights endpoints
3. The JSON format is ready for frontend chart libraries

## API Quota Information

- **Free Tier**: 15 requests per minute, 1M tokens per day
- **Paid Tier**: Higher limits available
- **Cost**: Very affordable for testing and development

## Support

If you encounter issues:

1. Check the console output for specific error messages
2. Verify your API key is active in Google AI Studio
3. Test with the sample data first before customizing
4. Check the Gemini API documentation for latest updates
