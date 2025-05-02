// src/middlewares/jwt-admin.ts
import { Response, NextFunction } from 'express';
import { verifyStaffToken } from '../utils/jwt';

export function jwtStaffAuth(req: any, res: Response, next: NextFunction): void {
  let usernameError = '';
  let passwordError = '';
  let loginError = '';
  const username = '';

  const lang = req.body.lang as string || 'en';
  const content = {
    en: {
      title: 'Staff Login', username: 'Username', password: 'Password', login: 'Login', home: 'Home', invalid_credentials: 'Invalid username or password!', staff_not_found: 'Staff member not found!'
    },
    ar: {
      title: 'تسجيل دخول الموظف', username: 'اسم المستخدم', password: 'كلمة المرور', login: 'تسجيل الدخول', home: 'الصفحة الرئيسية', invalid_credentials: 'اسم المستخدم أو كلمة المرور غير صحيحة!', staff_not_found: 'الموظف غير موجود!'
    },
    fr: {
      title: 'Connexion du personnel', username: "Nom d'utilisateur", password: 'Mot de passe', login: 'Se connecter', home: "Page d'accueil", invalid_credentials: "Nom d'utilisateur ou mot de passe invalide!", staff_not_found: 'Employé introuvable!'
    },
    cn: {
      title: '员工登录', username: '用户名', password: '密码', login: '登录', home: '主页', invalid_credentials: '无效的用户名或密码!', staff_not_found: '未找到员工!'
    }
  };

  try {
    const token = req.cookies.staffToken;

    if (token) {
      const staff = verifyStaffToken(token);
      if (staff.staffId) {
        req.staff = staff;
        return next()
      }
    }
  } catch (e: any) {
    return res.render('staff/login', { content: content[lang as keyof typeof content] || content.en, error: null, lang });
  }
  // res.status(401).send('Missing auth token');
  return res.render('staff/login', { content: content[lang as keyof typeof content] || content.en, error: null, lang });
}

export default jwtStaffAuth;