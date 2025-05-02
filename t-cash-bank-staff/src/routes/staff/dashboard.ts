// src/routes/staff/dashboard.ts
import { Router, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Staff } from '../../entity/staff';
import { Queue, QueueStatus } from '../../entity/queue';
import { Between } from 'typeorm';
const router = Router();

declare module 'express-session' {
    interface SessionData {
        totalServed?: number;
    }
}

// GET /staff/dashboard
router.get('/dashboard', async (req: any, res: Response) => {
    const staffId = req.staff.staffId as number;
    const staffRepo = AppDataSource.getRepository(Staff);
    const queueRepo = AppDataSource.getRepository(Queue);

    // Fetch staff details
    const staff = await staffRepo.findOneBy({ id: staffId });
    if (!staff) {
        res.status(404).send('Staff member not found');
        return;
    }

    // Determine assigned counter
    let counterName: string;
    let displayCounterName: string;
    const cid = staff.counterAssigned;
    if (cid === '7') {
        counterName = 'Counter 7';
        displayCounterName = 'VIP Counter';
    } else if (cid === '6') {
        counterName = 'Counter 6';
        displayCounterName = 'Special Counter';
    } else {
        counterName = `Counter ${cid}`;
        displayCounterName = counterName;
    }
    let servedCount = 0;
    // Initialize total served in session
    if (req.cookie?.totalServed == null) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        servedCount = await queueRepo.count({
            where: {
                assignedCounter: counterName,
                status: QueueStatus.COMPLETED,
                completedAt: Between(startOfToday, new Date())
            }
        });
        res.cookie('totalServed', servedCount, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: '/',
        });
    }
    const totalServed = req.cookie?.totalServed || servedCount as number;

    // Calculate average wait time for all completed
    const avgRow: any[] = await AppDataSource.manager.query(`
        SELECT AVG(TIMESTAMPDIFF(MINUTE, timestamp, completed_at)) AS avgWait
     FROM queue
     WHERE assigned_counter = '${counterName}' AND status = 'completed' AND completed_at IS NOT NULL
        `
    );

    const avgWaitTime = avgRow[0]?.avgWait ? parseFloat(Number(avgRow[0].avgWait).toFixed(1)) : 0;

    // Handle ticket completion via RabbitMQ
    const completeId = req.query.complete_ticket_id as string | undefined;

    // Handle ticket completion
    if (completeId) {
        await queueRepo.update(Number(completeId), {
            status: QueueStatus.COMPLETED,
            completedAt: new Date(),
            isCalling: false,
        });
        // req.session.totalServed = totalServed + 1;
        return res.redirect('/staff/dashboard');
    }

    // Fetch pending queue
    const queueData = await queueRepo.find({
        where: { assignedCounter: counterName, status: QueueStatus.PENDING },
        order: { timestamp: 'ASC' },
        relations: ['service']
    });
    const clientCount = queueData.length;

    return res.render('staff/dashboard', {
        staffUsername: staff.username,
        displayCounterName,
        createdAt: staff.createdAt,
        clientCount,
        totalServed,
        avgWaitTime,
        queueData,
        year: new Date().getFullYear()
    });
});

router.get('/dashboard/data', async (req: any, res: Response) => {
    const staffId = req.staff.staffId as number;
    const staffRepo = AppDataSource.getRepository(Staff);
    const queueRepo = AppDataSource.getRepository(Queue);

    const staff = await staffRepo.findOneBy({ id: staffId });
    if (!staff) {
        res.status(404).json({ error: 'Staff not found' });
        return;
    }
    let counterName: string;
    const cid = staff.counterAssigned;
    counterName = cid === '7' ? 'Counter 7' : cid === '6' ? 'Counter 6' : `Counter ${cid}`;

    const queueData = await queueRepo.find({
        where: { assignedCounter: counterName, status: QueueStatus.PENDING },
        order: { timestamp: 'ASC' },
        relations: ['service']
    });
    const clientCount = queueData.length;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const totalServed = await queueRepo.count({
        where: {
            assignedCounter: counterName,
            status: QueueStatus.COMPLETED,
            completedAt: Between(startOfToday, new Date())
        }
    });

    const avgRow: any[] = await AppDataSource.manager.query(`
        SELECT AVG(TIMESTAMPDIFF(MINUTE, timestamp, completed_at)) AS avgWait
        FROM queue
        WHERE assigned_counter = '${counterName}' AND status = 'completed' AND completed_at IS NOT NULL
    `);
    const avgWaitTime = avgRow[0]?.avgWait ? parseFloat(Number(avgRow[0].avgWait).toFixed(1)) : 0;

    res.json({
        clientCount,
        totalServed,
        avgWaitTime,
        queueData,
    });
});

export default router;