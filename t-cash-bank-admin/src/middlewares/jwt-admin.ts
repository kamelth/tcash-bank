// src/middlewares/jwt-admin.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken } from '../utils/jwt';

export function jwtAdminAuth(req:any, res: Response, next: NextFunction): void {
    let usernameError = '';
  let passwordError = '';
  let loginError = '';
  const username = '';

   const token = req.cookies.adminToken;
   if(token){
    const admin = verifyAdminToken(token);
    if( admin.adminUsername ){
        req.admin = admin;
        next()
        return;
    }
    res.status(401).send('Token not Valid');
   } else {
    // res.status(401).send('Missing auth token');
    res.render('admin/admin-login', {
        loginError,
        usernameError,
        passwordError,
        username,
        year: new Date().getFullYear()
      });
   }
   return;
}

export default jwtAdminAuth;