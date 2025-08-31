import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { User } from '../models/User';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

export interface AuthenticatedRequest extends Request {
  user?: any;
  firebaseUser?: admin.auth.DecodedIdToken;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No valid authorization token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decodedToken;

    // Get user from database
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User profile not found in database' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error instanceof Error && error.message.includes('auth/id-token-expired')) {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Authentication token has expired' 
      });
    }
    
    if (error instanceof Error && error.message.includes('auth/id-token-revoked')) {
      return res.status(401).json({ 
        error: 'Token revoked',
        message: 'Authentication token has been revoked' 
      });
    }

    return res.status(401).json({ 
      error: 'Authentication failed',
      message: 'Invalid authentication token' 
    });
  }
};

// Optional auth middleware for routes that can work with or without authentication
export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decodedToken;

    // Get user from database
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    req.user = user;
    
    next();
  } catch (error) {
    // Continue without user if auth fails
    console.warn('Optional auth failed:', error);
    next();
  }
};
