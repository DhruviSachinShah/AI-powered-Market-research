import express from 'express';
import {
  getAllInterviews,
  getInterviewById,
  getInterviewsByUser,
  getInterviewsByProduct,
  createInterview,
  updateInterview,
  deleteInterview
} from '../controllers/interviews.controllers';

const router = express.Router();

// Interview routes
router.get('/', getAllInterviews);
router.get('/:interviewId', getInterviewById);
router.get('/user/:userId', getInterviewsByUser);
router.get('/product/:productId', getInterviewsByProduct);
router.post('/', createInterview);
router.put('/:interviewId', updateInterview);
router.delete('/:interviewId', deleteInterview);

export default router;
