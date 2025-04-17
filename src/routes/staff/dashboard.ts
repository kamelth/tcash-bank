// src/routes/staff/dashboard.ts
import { Router, Request, Response } from 'express';
import { authCheck } from '../../middlewares/auth-middleware';
import { AppDataSource } from '../../config/data-source';
import { Staff } from '../../entity/staff';
import { Queue, QueueStatus } from '../../entity/queue';
import { Between } from 'typeorm';
import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const COMPLETE_QUEUE = 'ticket.completed';

const router = Router();

declare module 'express-session' {
    interface SessionData {
        totalServed?: number;
    }
}

async function publishTicketComplete(ticketId: number) {
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    await ch.assertQueue(COMPLETE_QUEUE, { durable: true });
    ch.sendToQueue(COMPLETE_QUEUE, Buffer.from(JSON.stringify({ ticketId })), { persistent: true });
    await ch.close();
    await conn.close();
}

// GET /staff/dashboard
router.get('/dashboard', authCheck, async (req: Request, res: Response) => {
    const staffId = req.session.staff_id as number;
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

    // Initialize total served in session
    if (req.session.totalServed == null) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const servedCount = await queueRepo.count({
            where: {
                assignedCounter: counterName,
                status: QueueStatus.COMPLETED,
                completedAt: Between(startOfToday, new Date())
            }
        });
        req.session.totalServed = servedCount;
    }
    const totalServed = req.session.totalServed as number;

    // Calculate average wait time for all completed
    const avgRow: any[] = await AppDataSource.manager.query(`
        SELECT AVG(TIMESTAMPDIFF(MINUTE, timestamp, completed_at)) AS avgWait
     FROM queue
     WHERE assigned_counter = ? AND status = 'completed' AND completed_at IS NOT NULL,
        [counterName]
        `
    );
    const avgWaitTime = avgRow[0]?.avgWait ? parseFloat(avgRow[0].avgWait.toFixed(1)) : 0;

    // Handle ticket completion via RabbitMQ
    const completeId = req.query.complete_ticket_id as string | undefined;
    if (completeId) {
        const id = parseInt(completeId, 10);
        await publishTicketComplete(id);
        // optimistic redirect
        return res.redirect('/staff/dashboard');
    }

    // // Handle ticket completion
    // if (completeId) {
    //     await queueRepo.update(Number(completeId), {
    //         status: QueueStatus.COMPLETED,
    //         completedAt: new Date()
    //     });
    //     req.session.totalServed = totalServed + 1;
    //     return res.redirect('/staff/dashboard');
    // }

    // Fetch pending queue
    const queueData = await queueRepo.find({
        where: { assignedCounter: counterName, status: QueueStatus.PENDING },
        order: { timestamp: 'ASC' }
    });
    const clientCount = queueData.length;

    res.render('staff/dashboard', {
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

export default router;