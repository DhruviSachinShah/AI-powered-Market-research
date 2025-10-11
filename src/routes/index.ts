import express from 'express';
import userRoutes from './users.routes';
import productRoutes from './products.routes';
import interviewRoutes from './interviews.routes';
import followupRoutes from './followup.routes';
import stdiqRoutes from './stdiq.routes';
import stdiqresRoutes from './stdiqres.routes';

const router = express.Router();

// API version prefix
const API_PREFIX = '/api';

// Mount all routes
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/products`, productRoutes);
router.use(`${API_PREFIX}/interviews`, interviewRoutes);
router.use(`${API_PREFIX}/followups`, followupRoutes);
router.use(`${API_PREFIX}/stdiq`, stdiqRoutes);
router.use(`${API_PREFIX}/stdiqres`, stdiqresRoutes);

export default router;
