// src/middlewares/jwt-auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyStaffToken, StaffPayload } from '../utils/jwt';

// Extend Request to include staff payload
export interface JwtRequest extends Request {
  staff?: StaffPayload;
}

/**
 * JWT authentication middleware.
 * Verifies the Bearer token and attaches the decoded payload to req.staff.
 * Sends 401 if token is missing, invalid, or expired.
 */
export function jwtAuth(req: JwtRequest, res: Response, next: NextFunction) {
  // Try header first, then cookie
  let token: string | undefined;
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    token = auth.slice(7);
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).send('Missing auth token');
  }

  try {
    req.staff = verifyStaffToken(token);
    next();
  } catch {
    res.status(401).send('Invalid or expired token');
  }
}
