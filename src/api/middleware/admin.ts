import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authentication required' 
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Admin access required' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Error checking admin privileges' 
    });
  }
};

// Middleware for premium users (admin or premium)
export const premiumMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authentication required' 
      });
    }

    if (req.user.role === 'admin') {
      return next(); // Admins have all premium access
    }

    if (!req.user.isPremium) {
      return res.status(403).json({ 
        error: 'Premium required',
        message: 'Premium subscription required for this feature' 
      });
    }

    // Check if premium is still active
    if (req.user.premiumExpiresAt && req.user.premiumExpiresAt < new Date()) {
      return res.status(403).json({ 
        error: 'Premium expired',
        message: 'Your premium subscription has expired' 
      });
    }

    next();
  } catch (error) {
    console.error('Premium middleware error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Error checking premium status' 
    });
  }
};
