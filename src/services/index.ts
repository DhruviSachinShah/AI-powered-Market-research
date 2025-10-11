// Export all services
export { productService } from './productService';
export { interviewService } from './interviewService';
export { healthService } from './healthService';

// Export existing services
export { default as api } from './api';
export { interviewService as localInterviewService } from './interviewService';

// Export types
export type { 
  User, 
  Product, 
  Interview, 
  Followup, 
  Stdiq, 
  Stdiqres, 
  ApiResponse 
} from '../types';
