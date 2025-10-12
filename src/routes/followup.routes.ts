import express from 'express';
import {
  getAllFollowups,
  getFollowupsByInterviewId,
  createFollowup,
  updateFollowup,
  deleteFollowup,
  generateFollowup
} from '../controllers/followup.controller';

const router = express.Router();

// Followup routes
router.get('/', getAllFollowups);
router.get('/interview/:interviewId', getFollowupsByInterviewId);
router.post('/', createFollowup);
router.post('/generate', generateFollowup);
router.put('/:id', updateFollowup);
router.delete('/:id', deleteFollowup);

export default router;
