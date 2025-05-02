import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const { method, originalUrl, ip } = req;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${originalUrl} from ${ip}`);
  if (method !== 'GET') {
    console.log(`Body:`, req.body);
  }

  next();
}
