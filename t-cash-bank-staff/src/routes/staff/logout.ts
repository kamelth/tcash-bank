// src/routes/staff/logout.ts
import { Router, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Staff } from '../../entity/staff';

const router = Router();

// GET /staff/logout
router.get('/logout', async (req: any, res: Response) => {
    let staff = req?.staff || null;
    console.log({staff})
    if(staff){
        const staffRepo = AppDataSource.getRepository(Staff);
        await staffRepo.update(staff.staffId, { isOnline: false });
    }
    res.clearCookie('staffToken');
    res.redirect('/staff/login');
});

export default router;