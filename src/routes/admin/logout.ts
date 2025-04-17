// src/routes/admin/logout.ts
import { Router, Request, Response } from 'express';
import { authCheck } from '../../middlewares/auth-middleware';

const router = Router();

// GET /admin/logout
router.get('/logout', authCheck, (req: Request, res: Response) => {
req.session.destroy(err => {
if (err) {
console.error('Session destroy error:', err);
return res.redirect('/admin/dashboard');
}
res.clearCookie('connect.sid');
res.redirect('/admin/login');
});
});

export default router;