// src/routes/admin/client-management.ts
import { Router, Request, Response } from 'express';
import { authCheck } from '../../middlewares/auth-middleware';
import { AppDataSource } from '../../config/data-source';
import { Client } from '../../entity/client';

const router = Router();

// GET /admin/clients
router.get('/clients', authCheck, async (req: Request, res: Response) => {
try {
const clientRepo = AppDataSource.getRepository(Client);
const clients = await clientRepo.find();
res.render('admin/client-management', { clients, year: new Date().getFullYear() });
} catch (err: any) {
console.error(err);
res.render('admin/client-management', { clients: [], error: err.message, year: new Date().getFullYear() });
}
});

export default router;