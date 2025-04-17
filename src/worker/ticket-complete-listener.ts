import amqp from 'amqplib';
import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { Queue, QueueStatus } from '../entity/queue';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const COMPLETE_QUEUE = 'ticket.completed';

async function listen() {
    // Initialize DB connection
    await AppDataSource.initialize();

    // Connect to RabbitMQ
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    await ch.assertQueue(COMPLETE_QUEUE, { durable: true });

    console.log(' [*] Waiting for messages in', COMPLETE_QUEUE);
    ch.consume(
        COMPLETE_QUEUE,
        async msg => {
            if (msg) {
                try {
                    const { ticketId } = JSON.parse(msg.content.toString());
                    console.log(' [x] Received complete for ticket', ticketId);

                    const queueRepo = AppDataSource.getRepository(Queue);
                    await queueRepo.update(ticketId, {
                        status: QueueStatus.COMPLETED,
                        completedAt: new Date()
                    });

                    ch.ack(msg);
                    console.log(' [✓] Ticket updated in DB');
                } catch (err) {
                    console.error(' [!] Error handling message', err);
                    ch.nack(msg, false, false); // drop or dead-letter
                }
            }
        },
        { noAck: false }

    );
}

listen().catch(err => {
    console.error('Listener error', err);
    process.exit(1);
});