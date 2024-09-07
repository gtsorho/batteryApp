import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

declare module 'express-serve-static-core' {
    interface Request {
      auth?: string | JwtPayload;
    }
  } 
  
dotenv.config();

const secretKey = process.env.JWT_KEY as string;

if (!secretKey) {
  throw new Error('JWT_KEY is not defined in environment variables');
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  let token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  token = token.split(' ')[1]; // Extract the token part after 'Bearer'

  try {
    const decoded = jwt.verify(token, secretKey) as string | JwtPayload;
    req.auth = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
}
