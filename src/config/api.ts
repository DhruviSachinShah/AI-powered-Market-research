// API Configuration
export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:9999/api',
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:9999/api',
  
  // API endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    STD_INTERVIEW_QUES: '/stdiq',
    // Product endpoints
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (productId: string) => `/products/${productId}`,
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second base delay
  },
  
  // Development settings
  IS_DEVELOPMENT: import.meta.env.DEV,
  DEBUG_MODE: import.meta.env.VITE_DEBUG === 'true',
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to log API calls in development
export const logApiCall = (method: string, url: string, data?: any) => {
  if (API_CONFIG.DEBUG_MODE) {
    console.log(`[API] ${method} ${url}`, data);
  }
};
