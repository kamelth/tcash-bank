import { Router } from 'express';
import clientRouter     from './client.index';
import assignQueue from './assign-queue';
import queueRouter     from '../client/queue-display';

const router = Router();
router.use(clientRouter);      // handles GET/POST /admin/login
router.use(assignQueue);  // handles GET /admin/dashboard
router.use(queueRouter);      // handles GET/POST /admin/login

export default router;
