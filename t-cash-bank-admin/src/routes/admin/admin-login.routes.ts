import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Admin } from '../../entity/admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signAdminToken, verifyAdminToken } from '../../utils/jwt';

const router = Router();

// GET /admin/login
router.get('/login', (req: any, res: Response) => {
   const token = req.cookies.adminToken;
   const admin = token ? verifyAdminToken(token) : null;

   if (admin) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/admin-login', {
    loginError: null,
    usernameError: null,
    passwordError: null,
    username: '',
    year: new Date().getFullYear()
  });
});

// POST /admin/login
router.post('/login', async (req: any, res: Response) => {
  const lang = (req.cookies?.lang as string) || 'en';

  const { username: rawUsername, password: rawPassword } = req.body;
  let usernameError = '';
  let passwordError = '';
  let loginError = '';
  const username = (rawUsername || '').trim();
  const password = (rawPassword || '').trim();

  // Validate inputs
  if (!username) usernameError = 'Please enter username.';
  if (!password) passwordError = 'Please enter your password.';

  if (!usernameError && !passwordError) {
    try {
      const repo = AppDataSource.getRepository(Admin);
      const admin = await repo.findOneBy({ username });

      if (admin) {
        const valid = await bcrypt.compare(password, admin.password);
        if (valid) {
          const token = signAdminToken({
            lang,
            adminId: admin.id,
            adminUsername: admin.username
          });
          res.cookie('adminToken', token);

          req.admin = admin;
          return res.redirect('dashboard');
        }
      }

      // fallback default admin/admin

      loginError = 'Invalid username or password.';
    } catch (err) {
      console.error(err);
      loginError = 'Oops! Something went wrong. Please try again later.';
    }
  }

  res.render('admin/admin-login', {
    loginError,
    usernameError,
    passwordError,
    username,
    year: new Date().getFullYear()
  });
});

export default router;
