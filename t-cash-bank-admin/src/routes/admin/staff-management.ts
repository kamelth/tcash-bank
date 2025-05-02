// src/routes/admin/staff-management.ts
import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Staff } from '../../entity/staff';

const router = Router();

// GET /admin/staff
router.get('/staff', async (req: Request, res: Response) => {
const staffRepo = AppDataSource.getRepository(Staff);
let deleteSuccess = false;
let deleteError: string | null = null;

const deleteId = req.query.delete_id as string | undefined;
if (deleteId) {
try {
const result = await staffRepo.delete(Number(deleteId));
if (result.affected && result.affected > 0) deleteSuccess = true;
else deleteError = 'No record found to delete';
} catch (err: any) {
deleteError = err.message;
}
}

const staffList = await staffRepo.find();
res.render('admin/staff-management', {
staffList,
deleteSuccess,
deleteError,
year: new Date().getFullYear(),
});
});

export default router;