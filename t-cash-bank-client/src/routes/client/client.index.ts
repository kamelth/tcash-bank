import { Router, Request, Response } from 'express';

const router = Router();

// GET /client
router.get('/', (req: Request, res: Response) => {
    const lang = (req.cookies?.lang as string) || 'en';
    if (!lang) {
        res.cookie('lang', lang, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: '/',
        });
    }

    // Language content
    const langContent: Record<string, any> = {
        en: {
            title: 'Welcome to TcashBank Queue System',
            instructions: 'Enter your details and select the service you need',
            full_name: 'Full Name:',
            phone_number: 'Phone Number:',
            select_client_type: 'Select Client Type:',
            regular_client: 'Regular Client',
            vip_client: 'VIP Client',
            special_client: 'Special Client',
            select_service: 'Select Service:',
            loan: 'Loan',
            customer_care: 'Customer Care',
            withdrawal: 'Withdrawal',
            banking: 'Banking',
            queue_ticket: 'Get Queue Ticket',
            home: 'Home'
        },
        ar: {
            title: 'مرحبًا بك في نظام الطابور بنك تي كاش',
            instructions: 'أدخل التفاصيل الخاصة بك وحدد الخدمة التي تحتاجها',
            full_name: 'الاسم الكامل:',
            phone_number: 'رقم الهاتف:',
            select_client_type: 'حدد نوع العميل:',
            regular_client: 'عميل عادي',
            vip_client: 'عميل VIP',
            special_client: 'عميل خاص',
            select_service: 'حدد الخدمة:',
            loan: 'قرض',
            customer_care: 'خدمة العملاء',
            withdrawal: 'سحب',
            banking: 'البنوك',
            queue_ticket: 'الحصول على تذكرة الطابور',
            home: 'الصفحة الرئيسية'
        },
        fr: {
            title: "Bienvenue dans le système de file d'attente TcashBank",
            instructions: "Entrez vos détails et sélectionnez le service dont vous avez besoin",
            full_name: 'Nom complet:',
            phone_number: 'Numéro de téléphone:',
            select_client_type: 'Sélectionnez le type de client:',
            regular_client: 'Client régulier',
            vip_client: 'Client VIP',
            special_client: 'Client spécial',
            select_service: 'Sélectionner le service:',
            loan: 'Prêt',
            customer_care: 'Service clientèle',
            withdrawal: 'Retrait',
            banking: 'Banque',
            queue_ticket: 'Obtenir un ticket de file',
            home: 'Accueil'
        },
        cn: {
            title: '欢迎来到TcashBank排队系统',
            instructions: '请输入您的详细信息并选择所需的服务',
            full_name: '全名：',
            phone_number: '电话号码：',
            select_client_type: '选择客户类型：',
            regular_client: '普通客户',
            vip_client: 'VIP客户',
            special_client: '特殊客户',
            select_service: '选择服务：',
            loan: '贷款',
            customer_care: '客户服务',
            withdrawal: '取款',
            banking: '银行业务',
            queue_ticket: '获取排队票',
            home: '首页'
        }
    };
    const errorMessage = req.query.error as string || null;

    res.render('client/index', {
        lang,
        content: langContent[lang] || langContent.en,
        errorMessage,
    });
});

export default router;