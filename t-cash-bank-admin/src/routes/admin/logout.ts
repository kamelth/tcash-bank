// src/routes/admin/logout.ts
import { Router, Request, Response } from 'express';

const router = Router();

// GET /admin/logout
router.get('/logout', (req: Request, res: Response) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
});

export default router;