// src/routes/client/assign-queue.ts
import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Client as ClientEntity, ClientType } from '../../entity/client';
import { Service } from '../../entity/service';
import { Queue } from '../../entity/queue';
import crypto from 'crypto';

const router = Router();

// POST /client/assign_queue
router.post('/assign_queue', async (req: Request, res: Response) => {
// Session language default
if (!req.session.lang) {
req.session.lang = 'en';
}
const lang = req.session.lang as string;

// Language content
const langContent: Record<string, any> = {
en: {
title: 'Queue Ticket Confirmation',
client_type: 'Client Type:',
name: 'Name:',
phone: 'Phone Number:',
service: 'Service:',
counter: 'Counter:',
vip: 'VIP',
special: 'Special',
regular: 'Regular',
ticket_number: 'Ticket Number:',
status_message: 'Please proceed to the assigned counter for your service.',
view_queue: 'View Queue',
go_home: 'Go Home'
},
ar: {
title: 'تأكيد تذكرة الطابور',
client_type: 'نوع العميل:',
name: 'الاسم:',
phone: 'رقم الهاتف:',
service: 'الخدمة:',
counter: 'العداد:',
vip: 'VIP',
special: 'خاص',
regular: 'عادي',
ticket_number: 'رقم التذكرة:',
status_message: 'يرجى التوجه إلى العداد المخصص لخدمتك.',
view_queue: 'عرض الطابور',
go_home: 'الذهاب إلى الصفحة الرئيسية'
},
fr: {
title: 'Confirmation du ticket de file',
client_type: 'Type de client:',
name: 'Nom:',
phone: 'Numéro de téléphone:',
service: 'Service:',
counter: 'Comptoir:',
vip: 'VIP',
special: 'Spécial',
regular: 'Régulier',
ticket_number: 'Numéro de ticket:',
status_message: 'Veuillez vous rendre au comptoir assigné pour votre service.',
view_queue: 'Voir le file',
go_home: 'Retour à la page d\'accueil\''},
cn: {
title: '队列票确认',
client_type: '客户类型：',
name: '姓名：',
phone: '电话号码：',
service: '服务：',
counter: '柜台：',
vip: 'VIP',
special: '特别',
regular: '常规',
ticket_number: '票号：',
status_message: '请前往指定的柜台办理服务。',
view_queue: '查看队列',
go_home: '回到首页'
}
};

const { name, phone, client_type, service } = req.body;

try {
const clientRepo = AppDataSource.getRepository(ClientEntity);
const serviceRepo = AppDataSource.getRepository(Service);
const queueRepo = AppDataSource.getRepository(Queue);

// Insert client
const client = clientRepo.create({
  name,
  phone,
  clientType: client_type as ClientType
});
await clientRepo.save(client);

// Find service entity
const serviceEntity = await serviceRepo.findOneBy({ serviceName: service });
if (!serviceEntity) throw new Error('Service not found');

// Assign counter
let assignedCounter: string;
if (client_type === 'vip') assignedCounter = 'Counter 7';
else if (client_type === 'special') assignedCounter = 'Counter 6';
else {
  switch (service) {
    case 'loan': assignedCounter = 'Counter 1'; break;
    case 'Customer Care': assignedCounter = 'Counter 2'; break;
    case 'withdrawal': assignedCounter = 'Counter 3'; break;
    case 'banking': assignedCounter = 'Counter 4'; break;
    default: assignedCounter = 'Counter 5';
  }
}

// Generate ticket number
const ticketNumber = crypto.randomBytes(3).toString('hex').toUpperCase();

// Insert queue record
const queue = queueRepo.create({
  client,
  service: serviceEntity,
  assignedCounter,
  ticketNumber
});
await queueRepo.save(queue);

res.render('client/assign-queue', {
  lang,
  content: langContent[lang] || langContent.en,
  clientType: client_type,
  name,
  phone,
  service,
  assignedCounter,
  ticketNumber,
  year: new Date().getFullYear()
});

} catch (err: any) {
console.error(err);
res.status(500).send('Internal Server Error');
}
});

export default router;