import { Router } from 'express';
import loginRouter     from './admin-login.routes';
import dashboardRouter from './dashboard.routes';
import addStaffRouter from './add-staff';
import staffMgm from './staff-management';
import editStaff from './edit-staff';
import clientMgm from './client-management';
import logout from './logout';
import jwtAdminAuth from '../../middlewares/jwt-admin';

const router = Router();
router.use(loginRouter);

router.use(jwtAdminAuth);
router.use(dashboardRouter);  // handles GET /admin/dashboard
router.use(addStaffRouter);     // handles GET /admin/logout
router.use(staffMgm);     // handles GET /admin/logout
router.use(editStaff);     // handles GET /admin/logout
router.use(clientMgm);     // handles GET /admin/logout
router.use(logout);     // handles GET /admin/logout
export default router;
