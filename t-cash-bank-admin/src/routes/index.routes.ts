import { Router } from 'express';

const router = Router();

const lang_content: any = {
  en: {
    title: 'Welcome to TcashBank Queue System',
    admin_login: 'Admin Login',
  },
  ar: {
    title: 'مرحبًا بك في نظام الطابور بنك تي كاش',
    admin_login: 'تسجيل دخول المسؤول',
  },
  fr: {
    title: 'Bienvenue dans le système de file d\'attente TcashBank',
    admin_login: 'Connexion administrateur',
  },
  cn: {
    title: '欢迎来到TcashBank排队系统',
    admin_login: '管理员登录',
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
