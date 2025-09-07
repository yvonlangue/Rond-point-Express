import { Request, Response, NextFunction } from 'express';

// Mock authentication middleware for development
// In production, this would verify Clerk JWT tokens

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
    role: string;
    isPremium: boolean;
    eventCount: number;
  };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No valid authorization token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Mock token verification for development
    // In production, verify Clerk JWT token here
    if (token === 'mock-token') {
      req.user = {
        _id: 'mock-user-id',
        email: 'user@example.com',
        name: 'Mock User',
        role: 'organizer',
        isPremium: false,
        eventCount: 0,
      };
      return next();
    }

    // For now, reject all other tokens
    return res.status(401).json({ 
      error: 'Authentication failed',
      message: 'Invalid authentication token' 
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      error: 'Authentication failed',
      message: 'Invalid authentication token' 
    });
  }
};

// Optional auth middleware for routes that can work with or without authentication
export const optionalAuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Mock token verification for development
    if (token === 'mock-token') {
      req.user = {
        _id: 'mock-user-id',
        email: 'user@example.com',
        name: 'Mock User',
        role: 'organizer',
        isPremium: false,
        eventCount: 0,
      };
    }

    return next();
  } catch (error) {
    // Continue without user if auth fails
    console.warn('Optional auth failed:', error);
    next();
  }
};

export const adminMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

export const premiumMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!req.user.isPremium) {
    return res.status(403).json({ error: 'Premium subscription required' });
  }

  next();
};