
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-with-a-secure-secret';
const JWT_EXPIRY = '2h';

export interface StaffPayload {
  staffId: number;
  role: string;
  lang?: string;
}


// Sign a staff‐specific token
export function signStaffToken(payload: StaffPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

// Verify & decode a staff token
export function verifyStaffToken(token: string): StaffPayload {
  return jwt.verify(token, JWT_SECRET) as StaffPayload;
}
