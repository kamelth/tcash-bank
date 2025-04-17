// src/routes/admin/edit-staff.ts
import { Router, Request, Response } from 'express';
import { authCheck } from '../../middlewares/auth-middleware';
import { AppDataSource } from '../../config/data-source';
import { Staff } from '../../entity/staff';

const router = Router();

// GET /admin/staff/edit/:id
router.get('/staff/edit/:id', authCheck, async (req: Request, res: Response) => {
const staffRepo = AppDataSource.getRepository(Staff);
const id = Number(req.params.id);
let staff;
let errorMessage = null;
try {
staff = await staffRepo.findOneBy({ id });
if (!staff) {
errorMessage = 'Staff member not found.';
}
} catch (err: any) {
errorMessage = err.message;
}
res.render('admin/edit-staff', { staff, errorMessage, successMessage: null, year: new Date().getFullYear() });
});

// POST /admin/staff/edit/:id
router.post('/staff/edit/:id', authCheck, async (req: Request, res: Response) => {
const staffRepo = AppDataSource.getRepository(Staff);
const id = Number(req.params.id);
const { username, counter_assigned } = req.body;
let staff;
let successMessage = null;
let errorMessage = null;
try {
staff = await staffRepo.findOneBy({ id });
if (!staff) {
errorMessage = 'Staff member not found.';
} else {
staff.username = username;
staff.counterAssigned = counter_assigned;
await staffRepo.save(staff);
successMessage = 'Staff information updated successfully.';
}
} catch (err: any) {
errorMessage = err.message;
}
res.render('admin/edit-staff', { staff, errorMessage, successMessage, year: new Date().getFullYear() });
});

export default router;