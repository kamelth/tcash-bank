import { Router, Request, Response } from 'express';
import { authCheck } from '../../middlewares/auth-middleware';
import { AppDataSource } from '../../config/data-source';
import { Staff, StaffRole } from '../../entity/staff';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const router = Router();

// GET /admin/staff/add
router.get('/staff/add', authCheck, (req: Request, res: Response) => {
  res.render('admin/add-staff', { message: null, year: new Date().getFullYear() });
});

// POST /admin/staff/add
router.post('/staff/add', authCheck, async (req: Request, res: Response) => {
  const { username, role, counter_assigned } = req.body;
  // Generate a temporary password (8 chars hex)
  const tempPassword = crypto.randomBytes(4).toString('hex');

  try {
    const hashed = await bcrypt.hash(tempPassword, 10);
    const staffRepo = AppDataSource.getRepository(Staff);
    const staff = staffRepo.create({
      username,
      password: hashed,
      role: role as StaffRole,
      temporaryPassword: 'yes',
      counterAssigned: counter_assigned
    });
    await staffRepo.save(staff);

    const msg = `Staff added successfully! Temporary Password for ${username}: ${tempPassword}`;
    res.render('admin/add-staff', { message: { type: 'success', text: msg }, year: new Date().getFullYear() });
  } catch (err: any) {
    console.error(err);
    res.render('admin/add-staff', { message: { type: 'danger', text: 'Error: ' + err.message }, year: new Date().getFullYear() });
  }
});

export default router;