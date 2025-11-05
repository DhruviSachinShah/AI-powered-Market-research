import express from 'express';
import {
  generateProductInsights,
  getProductInsights,
  getAllProductInsights,
  deleteProductInsights,
  testGeminiConnection
} from '../controllers/productInsights.controllers';

const router = express.Router();

// Product Insights routes
router.post('/generate/:productId', generateProductInsights);
router.get('/:productId', getProductInsights);
router.get('/', getAllProductInsights);
router.delete('/:productId', deleteProductInsights);

// Utility routes
router.get('/test/gemini', testGeminiConnection);

export default router;
