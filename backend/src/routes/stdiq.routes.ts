import express from 'express';
import {
  getAllQuestions,
  getQuestionById,
  getQuestionsByProduct,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../controllers/stdiq.controllers';

const router = express.Router();

// Standard Interview Questions routes
router.get('/', getAllQuestions);
router.get('/:quesId', getQuestionById);
router.get('/product/:productId', getQuestionsByProduct);
router.post('/', createQuestion);
router.put('/:quesId', updateQuestion);
router.delete('/:quesId', deleteQuestion);

export default router;
