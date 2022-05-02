import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs/promises';

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  const JWT_SECRET = await fs.readFile('jwt.evaluation.key', 'utf-8');
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }
  try {
    const decode = jwt.verify(token, JWT_SECRET);

    req.body.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
};
