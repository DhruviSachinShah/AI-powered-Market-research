import express from 'express';
import {
  getAllFollowups,
  getFollowupsByInterviewId,
  createFollowup,
  updateFollowup,
  deleteFollowup
} from '../controllers/followup.controller';

const router = express.Router();

// Followup routes
router.get('/', getAllFollowups);
router.get('/interview/:interviewId', getFollowupsByInterviewId);
router.post('/', createFollowup);
router.put('/:id', updateFollowup);
router.delete('/:id', deleteFollowup);

export default router;
