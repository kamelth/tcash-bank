// src/routes/staff/login.ts
import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Staff } from '../../entity/staff';
import bcrypt from 'bcryptjs';
import { signStaffToken, verifyStaffToken } from '../../utils/jwt';

const router = Router();

// GET /staff/login
router.get('/login', (req: Request, res: Response) => {
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
    const token = req.cookies.adminToken;
    const staff = token ? verifyStaffToken(token) : null;

    if (staff?.staffId) {
      return res.redirect('/staff/dashboard');
    }

  } catch (e: any) {
    return res.render('staff/login', { content: content[lang as keyof typeof content] || content.en, error: null, lang });
  }


  return res.render('staff/login', { content: content[lang as keyof typeof content] || content.en, error: null, lang });
});

// POST /staff/login
router.post('/login', async (req: any, res: Response) => {
  const { username, password, counter } = req.body;
  const lang = (req.cookies?.lang as string) || 'en';

  const content = {
    en: { invalid_credentials: 'Invalid username or password!', staff_not_found: 'Staff member not found!' },
    ar: { invalid_credentials: 'اسم المستخدم أو كلمة المرور غير صحيحة!', staff_not_found: 'الموظف غير موجود!' },
    fr: { invalid_credentials: "Nom d'utilisateur ou mot de passe invalide!", staff_not_found: 'Employé introuvable!' },
    cn: { invalid_credentials: '无效的用户名或密码!', staff_not_found: '未找到员工!' }
  };

  try {
    const staffRepo = AppDataSource.getRepository(Staff);
    const staff = await staffRepo.findOneBy({ username });
    if (!staff) {
      return res.render('staff/login', { content: content[lang as keyof typeof content], error: content[lang as keyof typeof content].staff_not_found, lang });
    }
    const valid = await bcrypt.compare(password, staff.password);

    if (!valid) {
      return res.render('staff/login', { content: content[lang as keyof typeof content], error: content[lang as keyof typeof content].invalid_credentials, lang });
    }

    const token = signStaffToken({
      lang,
      staffId: staff.id,
      role: staff.role
    });
    res.cookie('staffToken', token);
    await staffRepo.update(staff.id, { counterAssigned: counter, isOnline: true });

    req.staff = staff;
    // first login with temporary password
    if (staff.temporaryPassword === 'yes') {
      return res.redirect('/staff/change-password');
    }
    res.redirect('/staff/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;