import { Router } from 'express';
import staffLoginRouter     from './staff-login';
import dashRouter     from './dashboard';
import changePass from './change-password';
import logout from './logout';

const router = Router();
router.use(staffLoginRouter);      // handles GET/POST /admin/login
router.use(dashRouter);      // handles GET/POST /admin/login
router.use(changePass);  // handles GET /admin/dashboard
router.use(logout);  // handles GET /admin/dashboard

export default router;
