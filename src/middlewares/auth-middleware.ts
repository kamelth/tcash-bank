// src/middlewares/auth-middleware.ts

import { Request, Response, NextFunction } from 'express';

/**
 * Protects admin routes by ensuring the user is logged in.
 * If not authenticated, redirects to the admin login page.
 */
export function authCheck(req: Request, res: Response, next: NextFunction) {
  if (req.session.admin_logged_in) {
    return next();
  }
  return res.redirect('/admin/login');
}
