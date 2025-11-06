import express from 'express';
import {
  generateInterviewInsights,
  getInterviewInsights,
  getAllInterviewInsights,
  deleteInterviewInsights,
  testGeminiConnection
} from '../controllers/interviewInsights.controllers';

const router = express.Router();

// Interview Insights routes
router.post('/generate/:interviewId', generateInterviewInsights);
router.get('/:interviewId', getInterviewInsights);
router.get('/', getAllInterviewInsights);
router.delete('/:interviewId', deleteInterviewInsights);

// Utility routes
router.get('/test/gemini', testGeminiConnection);

export default router;