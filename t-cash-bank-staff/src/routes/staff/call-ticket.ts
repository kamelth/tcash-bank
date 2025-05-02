// src/routes/staff/call-ticket.ts
import { Router, Request, Response } from 'express';
import { Queue } from '../../entity/queue';
import { AppDataSource } from '../../config/data-source';

const router = Router();

router.post(
  '/call-ticket',
  async (req: Request, res: Response): Promise<void> => {
    const { ticketNumber, counter } = req.body as {
      ticketNumber?: string;
      counter?: string;
    };
    if (!ticketNumber || !counter) {
      res.status(400).json({ error: 'Missing ticketNumber or counter' });
      return;
    }

    const queueRepo = AppDataSource.getRepository(Queue);

    try {
      // Get currently calling tickets
      const callingTickets = await queueRepo.find({
        where: { isCalling: true },
        order: { updatedAt: 'ASC' } // oldest first
      });
      // If there are already 3 calling tickets, unmark the oldest one
      if (callingTickets?.length >= 3) {
        const oldest = callingTickets[0];
        oldest.isCalling = false;
        await queueRepo.save(oldest);
      }

      // Mark the newly called ticket
      const currentTicket = await queueRepo.findOneBy({ ticketNumber });
      console.log({currentTicket})
      if (!currentTicket) {
        res.status(404).json({ error: 'Ticket not found' });
        return;
      }

      currentTicket.isCalling = true;
      await queueRepo.save(currentTicket);

      // Publish the call event (optional depending on your frontend logic)
      // await publishCall(ticketNumber, counter);

      res.json({ ok: true });
    } catch (err) {
      console.error('Error in /staff/call-ticket:', err);
      res.status(500).json({ error: 'Failed to update calling ticket' });
    }
  }
);

export default router;
