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
