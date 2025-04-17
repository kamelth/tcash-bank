// src/routes/staff/logout.ts
import { Router, Request, Response } from 'express';
import { authCheck } from '../../middlewares/auth-middleware';

const router = Router();

// GET /staff/logout
router.get('/logout', authCheck, (req: Request, res: Response) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destroy error:', err);
            return res.redirect('/staff/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

export default router;