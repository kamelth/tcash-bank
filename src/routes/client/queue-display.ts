// src/routes/display/queue-display.ts
import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Queue, QueueStatus } from '../../entity/queue';
import { MoreThan } from 'typeorm';

const router = Router();

// GET /display/queue
router.get('/queue', async (req: Request, res: Response) => {
// Ensure session and default language
if (!req.session.lang) {
req.session.lang = 'en';
}
const lang = req.session.lang as string;

// Language content
const content: Record<string, any> = {
en: {
title: 'Queue Display',
no_active_tickets: 'No active tickets at the moment.',
back_to_home: 'Back to Home',
serving_you_better: 'Serving You Better',
counter: 'Counter',
ticket_number: 'Ticket Number',
service_name: 'Service',
waiting_time: 'Waiting Time'
},
ar: {
title: 'عرض قائمة الانتظار',
no_active_tickets: 'لا توجد تذاكر نشطة في الوقت الحالي.',
back_to_home: 'العودة إلى الصفحة الرئيسية',
serving_you_better: 'نخدمكم بشكل أفضل',
counter: 'العداد',
ticket_number: 'رقم التذكرة',
service_name: 'الخدمة',
waiting_time: 'الوقت المتبقي'
},
fr: {
title: 'Affichage de la file d\'attente',
no_active_tickets: 'Aucun ticket actif pour le moment.',
back_to_home: 'Retour à l\'accueil',
serving_you_better: 'Nous vous servons mieux',
counter: 'Comptoir',
ticket_number: 'Numéro de ticket',
service_name: 'Service',
waiting_time: 'Temps d\'attente'
},
cn: {
title: '队列显示',
no_active_tickets: '目前没有活跃的票务',
back_to_home: '返回首页',
serving_you_better: '更好地为您服务',
counter: '柜台',
ticket_number: '票号',
service_name: '服务',
waiting_time: '等待时间'
}
};

// Fetch pending queue entries in last 24h
const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
const queueRepo = AppDataSource.getRepository(Queue);
const queues = await queueRepo.find({
where: {
status: QueueStatus.PENDING,
timestamp: MoreThan(oneDayAgo)
},
relations: ['service'],
order: {
assignedCounter: 'ASC',
timestamp: 'ASC'
}
});

// Group by counter
const queueData: Record<string, any[]> = {};
queues.forEach(q => {
if (!queueData[q.assignedCounter]) queueData[q.assignedCounter] = [];
queueData[q.assignedCounter].push({
ticketNumber: q.ticketNumber,
serviceName: q.service.serviceName,
timestamp: q.timestamp
});
});

// Count per counter
const counterCounts: Record<string, number> = {};
Object.entries(queueData).forEach(([counter, tickets]) => {
counterCounts[counter] = tickets.length;
});

res.render('client/queue-display', {
lang,
content: content[lang] || content.en,
queueData,
counterCounts,
year: new Date().getFullYear()
});
});

export default router;