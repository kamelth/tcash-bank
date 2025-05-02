import { Router } from 'express';

const router = Router();

const lang_content: any = {
  en: {
    title: 'Welcome to TcashBank Queue System',
    user_services: 'User Services',
    display_queue: 'Display Queue'
  },
  ar: {
    title: 'مرحبًا بك في نظام الطابور بنك تي كاش',
    user_services: 'خدمات المستخدم',
    display_queue: 'قائمة التذاكر'
  },
  fr: {
    title: 'Bienvenue dans le système de file d\'attente TcashBank',
    user_services: 'Services aux utilisateurs',
    display_queue: 'Afficher la file d\'attente'
  },
  cn: {
    title: '欢迎来到TcashBank排队系统',
    user_services: '用户服务',
    display_queue: '显示队列'
  }
};

router.get('/', (req:any, res) => {
  // read `lang` from cookie, default to 'en'
  const lang = (req.cookies?.lang as string) || 'en';
  res.render('index', {
    lang,
    lang_content
  });
});

router.post('/set-lang', (req:any, res) => {
  const chosen = req.body.lang as string;
  res.cookie('lang', chosen, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    path: '/',
  });
  res.redirect('/');
});

export default router;
