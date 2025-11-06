# API Endpoints Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Health Check
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health check with database info

## Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:userId` - Get user by ID (using user_name)
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:userId` - Update user by ID
- `DELETE /api/v1/users/:userId` - Delete user by ID

## Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:productId` - Get product by ID
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/:productId` - Update product by ID
- `DELETE /api/v1/products/:productId` - Delete product by ID

## Interviews
- `GET /api/v1/interviews` - Get all interviews
- `GET /api/v1/interviews/:interviewId` - Get interview by ID
- `GET /api/v1/interviews/user/:userId` - Get interviews by user
- `GET /api/v1/interviews/product/:productId` - Get interviews by product
- `POST /api/v1/interviews` - Create new interview
- `PUT /api/v1/interviews/:interviewId` - Update interview by ID
- `DELETE /api/v1/interviews/:interviewId` - Delete interview by ID

## Followups
- `GET /api/v1/followups` - Get all followups
- `GET /api/v1/followups/interview/:interviewId` - Get followups by interview ID
- `POST /api/v1/followups` - Create new followup
- `PUT /api/v1/followups/:id` - Update followup by ID
- `DELETE /api/v1/followups/:id` - Delete followup by ID

## Product Insights (AI-Powered)
- `GET /api/product-insights` - Get all products with response counts and insights status
- `GET /api/product-insights/:productId` - Get product insights by product ID
- `POST /api/product-insights/generate/:productId` - Generate AI insights for a product
- `DELETE /api/product-insights/:productId` - Delete product insights
- `GET /api/product-insights/test/gemini` - Test Gemini API connection

## Standard Interview Questions (STDIQ)
- `GET /api/v1/stdiq` - Get all standard interview questions
- `GET /api/v1/stdiq/:quesId` - Get question by ID
- `GET /api/v1/stdiq/product/:productId` - Get questions by product
- `POST /api/v1/stdiq` - Create new question
- `PUT /api/v1/stdiq/:quesId` - Update question by ID
- `DELETE /api/v1/stdiq/:quesId` - Delete question by ID

## Standard Interview Questions Responses (STDIQRES)
- `GET /api/v1/stdiqres` - Get all responses
- `GET /api/v1/stdiqres/interview/:interviewId` - Get response by interview ID
- `POST /api/v1/stdiqres` - Create new response
- `PUT /api/v1/stdiqres/interview/:interviewId` - Update response by interview ID
- `DELETE /api/v1/stdiqres/interview/:interviewId` - Delete response by interview ID

## Response Format
All API responses follow this format:
```json
{
  "success": true|false,
  "message": "Optional message",
  "data": "Response data",
  "count": "Number of items (for list endpoints)"
}
```

## Error Responses
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error



```
- user

http://localhost:9999/api/users

{"user_name": "Marcus Johnson", "user_type": "Fitness Instructor"}

- product

http://localhost:9999/api/products

{
  "prod_name": "Organic Protein Powder",
  "category": "Health & Wellness",
  "prod_desc": "Organic plant-based protein powder made from pea, hemp, and brown rice proteins. Non-GMO, gluten-free, with added probiotics and digestive enzymes. Available in vanilla, chocolate, and unflavored.",
  "prod_price": 39.99,
  "target_audience": "Health-conscious adults aged 25-45, fitness enthusiasts, vegetarians/vegans, environmentally aware consumers"
}

- interviews

http://localhost:9999/api/interviews

{
    "user": "USER_ID",
    "product": "PRODUCT_ID"
}

- stdiq

http://localhost:9999/api/stdiq

{
    "product": "PRODUCT_ID",
    "questions": [
      "On a scale of 1-10, how concerned are you about home security?",
      "How likely are you to purchase a smart home security system in the next 6 months?",
      "What is your current monthly budget for home security (including monitoring fees)?",
      "How comfortable are you with facial recognition technology in your home?",
      "Which features are most important to you? (Rank top 3)"
    ]
}

- stdiqres

http://localhost:9999/api/stdiqres

{
    "interview": "INTERVIEW_ID",
    "ques": "INTERVIEW_QUESTION_ID",
    "responses": {
      "question1": "8",
      "question2": "7",
      "question3": "$50-100",
      "question4": "Very comfortable",
      "question5": ["Motion sensors", "Facial recognition", "Cloud storage"]
    }
}

- followups

http://localhost:9999/api/followups

{
    "interview": "INTERVIEW_ID",
    "followup_ques": "Would you be interested in a free trial of our security system?",
    "followup_response": "Yes, I would like to try it for 30 days"
}

## Product Insights Examples

- Generate Product Insights (AI-Powered)

POST http://localhost:5000/api/product-insights/generate/PRODUCT_ID

Response:
```json
{
  "success": true,
  "message": "Product insights generated successfully",
  "data": {
    "productInsights": {
      "_id": "INSIGHTS_ID",
      "product": "PRODUCT_ID",
      "productReport": {
        "generatedAt": "2024-01-15T10:30:00.000Z",
        "productInfo": {
          "name": "Smart Home Security System",
          "description": "AI-powered home security system...",
          "totalInterviews": 5
        },
        "insights": [
          {
            "question_text": "Security Concern Level (1-10 scale)",
            "question_type": "rating",
            "visualization_type": "bar_chart",
            "chart_data": {
              "labels": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
              "datasets": [
                {
                  "label": "Responses",
                  "data": [0, 0, 1, 2, 3, 4, 5, 6, 2, 1],
                  "backgroundColor": ["#3B82F6", "#3B82F6", "#3B82F6", "#3B82F6", "#3B82F6", "#F59E0B", "#F59E0B", "#F59E0B", "#EF4444", "#EF4444"]
                }
              ]
            }
          }
        ],
        "metadata": {
          "totalQuestions": 5,
          "totalResponses": 25,
          "aiModel": "gemini-1.5-flash"
        }
      }
    },
    "aggregatedData": {
      "productName": "Smart Home Security System",
      "totalInterviews": 5,
      "totalQuestions": 5,
      "totalResponses": 25
    }
  }
}
```

- Get Product Insights

GET http://localhost:5000/api/product-insights/PRODUCT_ID

- Get All Products with Insights Status

GET http://localhost:5000/api/product-insights

Response:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "productId": "PRODUCT_ID_1",
      "productName": "Smart Home Security System",
      "interviewCount": 5,
      "hasResponses": true,
      "insightsGenerated": true,
      "lastGenerated": "2024-01-15T10:30:00.000Z"
    },
    {
      "productId": "PRODUCT_ID_2",
      "productName": "Organic Protein Powder",
      "interviewCount": 3,
      "hasResponses": true,
      "insightsGenerated": false,
      "lastGenerated": null
    }
  ]
}
```

- Test Gemini API Connection

GET http://localhost:5000/api/product-insights/test/gemini

Response:
```json
{
  "success": true,
  "data": {
    "connected": true,
    "message": "Gemini API connection successful"
  }
}
```



