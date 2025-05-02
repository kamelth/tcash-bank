// src/routes/staff/change-password.ts
import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Staff } from '../../entity/staff';
import bcrypt from 'bcryptjs';

const router = Router();

// GET /staff/change-password
router.get('/change-password', async (req: any, res: Response) => {
    const staffId = req.staff.staffId as number;
    const staffRepo = AppDataSource.getRepository(Staff);
    const staff = await staffRepo.findOneBy({ id: staffId });
    if (!staff) {
        return res.redirect('/staff/login');
    }
    if (staff.temporaryPassword === 'no') {
        return res.redirect('/staff/dashboard');
    }
    res.render('staff/change-password', { error: null });
});

// POST /staff/change-password
router.post('/change-password', async (req: any, res: Response) => {
    const staffId = req.staff.staffId as number;

    const { new_password, confirm_password } = req.body;
    if (new_password !== confirm_password) {
        return res.render('staff/change-password', { error: 'Passwords do not match!' });
    }

    try {
        const hashed = await bcrypt.hash(new_password, 10);
        const staffRepo = AppDataSource.getRepository(Staff);
        await staffRepo.update(staffId, {
            password: hashed,
            temporaryPassword: 'no'
        });
        return res.redirect('/staff/dashboard');
    } catch (err) {
        console.error(err);
        return res.render('staff/change-password', { error: 'Error updating password.' });
    }
});

export default router;