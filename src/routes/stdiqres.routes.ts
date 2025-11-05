import express from 'express';
import {
  getAllResponses,
  getResponseByInterviewId,
  createResponse,
  updateResponse,
  deleteResponse
} from '../controllers/stdiqres.contollers';

const router = express.Router();

// Standard Interview Questions Response routes
router.get('/', getAllResponses);
router.get('/interview/:interviewId', getResponseByInterviewId);
router.post('/', createResponse);
router.put('/interview/:interviewId', updateResponse);
router.delete('/interview/:interviewId', deleteResponse);

export default router;
