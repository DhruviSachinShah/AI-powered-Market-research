import { Router } from 'express';
import { InterviewController } from '../controllers/interviewController';

const router = Router();
const interviewController = new InterviewController();

// Interview routes
router.get('/', interviewController.getAllInterviews.bind(interviewController));
router.get('/:id', interviewController.getInterviewById.bind(interviewController));
router.get('/email/:email', interviewController.getInterviewsByEmail.bind(interviewController));
router.post('/', interviewController.createInterview.bind(interviewController));
router.put('/:id', interviewController.updateInterview.bind(interviewController));
router.delete('/:id', interviewController.deleteInterview.bind(interviewController));

export default router;
