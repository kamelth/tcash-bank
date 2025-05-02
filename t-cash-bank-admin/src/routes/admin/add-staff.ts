import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Staff, StaffRole } from '../../entity/staff';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Queue } from '../../entity/queue';

const router = Router();

// GET /admin/staff/add
router.get('/staff/add', (req: Request, res: Response) => {
  res.render('admin/add-staff', { message: null, year: new Date().getFullYear() });
});

// POST /admin/staff/add
router.post('/staff/add', async (req: Request, res: Response) => {
  const { username, role } = req.body;
  // Generate a temporary password (8 chars hex)
  const tempPassword = crypto.randomBytes(4).toString('hex');

  try {
    const hashed = await bcrypt.hash(tempPassword, 10);
    const queueRepo = AppDataSource.getRepository(Queue);
    const countersWithCounts = await queueRepo
      .createQueryBuilder('queue')
      .select('queue.assigned_counter', 'counter')
      .addSelect('COUNT(*)', 'count')
      .where({
        status: 'pending'
      })
      .groupBy('queue.assigned_counter')
      .orderBy('count', 'DESC')
      .getRawMany();
    console.log({countersWithCounts})
    // Pick the busiest counter if any, otherwise default to "Counter 1"
    const busyCounter = countersWithCounts.length > 0
      ? countersWithCounts[0].counter.split(' ')[1]
      : 1;
    const staffRepo = AppDataSource.getRepository(Staff);
    const staff = staffRepo.create({
      username,
      password: hashed,
      role: role as StaffRole,
      temporaryPassword: 'yes',
      counterAssigned: busyCounter
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