import { Router } from 'express';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    lang?: string;
  }
}

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

router.get('/', (req, res) => {
  const lang = req.session.lang || 'en';
  res.render('index', { lang: lang, lang_content: lang_content });
});

router.post('/set-lang', (req, res) => {
  req.session.lang = req.body.lang;
  res.redirect('/');
});

export default router;
