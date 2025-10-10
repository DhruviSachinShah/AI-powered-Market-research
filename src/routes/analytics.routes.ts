import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';

const router = Router();
const analyticsController = new AnalyticsController();

// Analytics routes
router.get('/interview/:id', analyticsController.getInterviewAnalytics.bind(analyticsController));
router.get('/aggregate', analyticsController.getAggregateAnalytics.bind(analyticsController));
router.get('/template/:templateId', analyticsController.getTemplateAnalytics.bind(analyticsController));
router.get('/export/:id', analyticsController.exportInterviewData.bind(analyticsController));

export default router;
