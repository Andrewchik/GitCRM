import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthedRequest extends Request {
  user?: { id: string; email: string }; // payload з JWT
}

export default function auth(req: AuthedRequest, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = hdr.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_me') as any;
    req.user = { id: String(payload.id), email: String(payload.email) };
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
