# Product Insights with Gemini AI

This feature provides AI-powered quantitative insights generation for products based on interview responses using Google's Gemini API.

## Overview

The Product Insights feature analyzes all standard interview question responses for a specific product and generates structured insights in a format optimized for data visualization. The insights are returned as JSON objects that can be directly used with charting libraries like Chart.js, D3.js, or Recharts.

## Features

- 🤖 **AI-Powered Analysis**: Uses Gemini Pro for intelligent response analysis
- 📊 **Structured Output**: Returns data in chart-ready JSON format
- 🎨 **Visualization Support**: Includes chart types, colors, and labels
- 🔍 **Comprehensive Aggregation**: Combines responses from multiple interviews
- ✅ **Validation**: Ensures data quality and format compliance
- 🚀 **Easy Integration**: Simple REST API endpoints

## Setup

### 1. Install Dependencies

```bash
npm install @google/generative-ai
```

### 2. Environment Configuration

Add your Gemini API key to your `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

### 3. Database Setup

Ensure your database has:
- Products with interviews conducted
- Standard interview questions defined
- User responses collected

## API Endpoints

### Generate Product Insights
```http
POST /api/product-insights/generate/{productId}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Product insights generated successfully",
  "data": {
    "productInsights": {
      "_id": "insights_id",
      "product": "product_id",
      "productReport": {
        "generatedAt": "2024-01-15T10:30:00.000Z",
        "productInfo": {
          "name": "Product Name",
          "description": "Product description",
          "totalInterviews": 5
        },
        "insights": [
          {
            "question_text": "How likely are you to purchase?",
            "question_type": "rating",
            "visualization_type": "bar_chart",
            "chart_data": {
              "labels": ["1", "2", "3", "4", "5"],
              "datasets": [
                {
                  "label": "Responses",
                  "data": [2, 1, 3, 5, 4],
                  "backgroundColor": ["#3B82F6", "#3B82F6", "#3B82F6", "#3B82F6", "#3B82F6"]
                }
              ]
            }
          }
        ]
      }
    }
  }
}
```

### Get Product Insights
```http
GET /api/product-insights/{productId}
```

### Get All Products with Insights Status
```http
GET /api/product-insights
```

### Test Gemini API Connection
```http
GET /api/product-insights/test/gemini
```

## Insight JSON Structure

Each insight follows this standardized format:

```typescript
{
  question_text: string,        // The survey/question text
  question_type: string,        // rating, likert, nps, multiple_choice, scale, percentage
  visualization_type: string,   // bar_chart, pie_chart, stacked_bar_chart, gauge_chart, heatmap, line_chart
  chart_data: {
    labels: string[],           // Chart labels
    datasets: [
      {
        label: string,          // Dataset label
        data: number[],         // Numeric values
        backgroundColor: string[], // Colors (hex codes)
        borderColor?: string[],    // Optional border colors
        borderWidth?: number       // Optional border width
      }
    ]
  }
}
```

## Visualization Types

- **bar_chart**: For comparing categories or ratings
- **pie_chart**: For showing proportions/percentages  
- **stacked_bar_chart**: For showing parts of a whole across categories
- **gauge_chart**: For single metrics or scores
- **heatmap**: For correlation or frequency analysis
- **line_chart**: For trends over time

## Question Types

- **rating**: Numeric ratings (1-10, 1-5)
- **likert**: Likert scale responses
- **nps**: Net Promoter Score
- **multiple_choice**: Multiple choice questions
- **scale**: Various scales
- **percentage**: Percentage-based responses

## Color Schemes

The AI uses a predefined color palette:
- Primary: `#3B82F6` (blue)
- Success: `#10B981` (green)
- Warning: `#F59E0B` (yellow)
- Danger: `#EF4444` (red)
- Purple: `#8B5CF6`
- Pink: `#EC4899`
- Indigo: `#6366F1`
- Gray: `#6B7280`

## Usage Examples

### Node.js Example
```javascript
const axios = require('axios');

async function generateInsights(productId) {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/product-insights/generate/${productId}`
    );
    
    console.log('Generated insights:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Usage
generateInsights('your_product_id_here');
```

### Frontend Integration (React)
```typescript
import axios from 'axios';

const ProductInsights = ({ productId }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/product-insights/generate/${productId}`
      );
      setInsights(response.data.data.productInsights.productReport.insights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateInsights} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Insights'}
      </button>
      
      {insights && (
        <div>
          {insights.map((insight, index) => (
            <div key={index}>
              <h3>{insight.question_text}</h3>
              <p>Type: {insight.question_type}</p>
              <p>Visualization: {insight.visualization_type}</p>
              {/* Render your chart here using the insight.chart_data */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Error Handling

The API includes comprehensive error handling:

- **400**: Bad request (missing product ID, no responses found)
- **404**: Product not found
- **500**: Internal server error (AI service issues, database errors)

Common error scenarios:
```json
{
  "success": false,
  "message": "No responses found for this product",
  "error": "Validation error"
}
```

## Testing

Use the provided example script to test the functionality:

```bash
node examples/productInsightsExample.js
```

Or test individual endpoints:

```bash
# Test connection
curl http://localhost:5000/api/product-insights/test/gemini

# Generate insights
curl -X POST http://localhost:5000/api/product-insights/generate/YOUR_PRODUCT_ID

# Get insights
curl http://localhost:5000/api/product-insights/YOUR_PRODUCT_ID
```

## Performance Considerations

- **Rate Limiting**: Gemini API has rate limits. Consider implementing caching for frequently accessed insights.
- **Response Time**: AI analysis can take 2-5 seconds depending on data volume.
- **Data Size**: Large response datasets may require chunking for optimal performance.

## Security

- Store your Gemini API key securely in environment variables
- Consider implementing API key rotation
- Validate input data before sending to AI service

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY is required"**
   - Ensure your `.env` file contains the API key
   - Restart the server after adding the key

2. **"No responses found for this product"**
   - Verify interviews exist for the product
   - Check that responses have been collected

3. **"Failed to generate insights"**
   - Check your Gemini API key validity
   - Verify internet connectivity
   - Check API rate limits

4. **Invalid JSON response from AI**
   - The AI service includes validation to catch malformed responses
   - Retry the request if this occurs

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will provide detailed error messages and API response logging.

## Future Enhancements

- [ ] Caching for improved performance
- [ ] Batch processing for multiple products
- [ ] Custom visualization templates
- [ ] Export functionality (PDF, Excel)
- [ ] Real-time insights updates
- [ ] Advanced AI models (Gemini Pro)
- [ ] Custom prompt templates

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Test with the provided examples
4. Check server logs for detailed error messages
