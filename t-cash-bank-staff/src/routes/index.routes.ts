import { Router } from 'express';

const router = Router();

const lang_content: any = {
  en: {
    title: 'Welcome to TcashBank Queue System',
    select_role: 'Select your role and language',
    admin_login: 'Admin Login',
    staff_login: 'Staff Login',
    user_services: 'User Services',
  },
  ar: {
    title: 'مرحبًا بك في نظام الطابور بنك تي كاش',
    select_role: 'حدد دورك واللغة',
    admin_login: 'تسجيل دخول المسؤول',
    staff_login: 'تسجيل دخول الموظف',
    user_services: 'خدمات المستخدم',
  },
  fr: {
    title: 'Bienvenue dans le système de file d\'attente TcashBank',
    select_role: 'Sélectionnez votre rôle et langue',
    admin_login: 'Connexion administrateur',
    staff_login: 'Connexion du personnel',
    user_services: 'Services aux utilisateurs',
  },
  cn: {
    title: '欢迎来到TcashBank排队系统',
    select_role: '选择您的角色和语言',
    admin_login: '管理员登录',
    staff_login: '员工登录',
    user_services: '用户服务',
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
