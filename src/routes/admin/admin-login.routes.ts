import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Admin } from '../../entity/admin';
import bcrypt from 'bcryptjs';

const router = Router();

declare module 'express-session' {
    interface SessionData {
      lang?: string;
      admin_logged_in?: boolean;
      admin_id?: number;
      admin_username?: string;
    }
  }

// GET /admin/login
router.get('/login', (req: Request, res: Response) => {
  if (req.session.admin_logged_in) {
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
router.post('/login', async (req: Request, res: Response) => {
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
          req.session.admin_logged_in = true;
          req.session.admin_id = admin.id;
          req.session.admin_username = admin.username;
          return res.redirect('dashboard');
        }
      }

      // fallback default admin/admin
      if (username === 'admin' && password === 'admin') {
        req.session.admin_logged_in = true;
        req.session.admin_username = 'admin';
        return res.redirect('/admin/dashboard');
      }

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
