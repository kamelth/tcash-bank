import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  // TODO: Implement login based on Staff Entity
  res.send('Login endpoint');
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Could not log out.');
    res.send('Logged out successfully.');
  });
};
