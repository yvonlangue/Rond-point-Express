import express from 'express';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/users/profile - Get current user profile
router.get('/profile', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user!._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', async (req: AuthenticatedRequest, res) => {
  try {
    const { name, bio, website, contactEmail, phoneNumber } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (website !== undefined) updateData.website = website;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    const updatedUser = await User.findByIdAndUpdate(
      req.user!._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/users/events - Get user's events
router.get('/events', async (req: AuthenticatedRequest, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 20
    } = req.query;

    const query: any = { organizerId: req.user!._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/users/stats - Get user statistics
router.get('/stats', async (req: AuthenticatedRequest, res) => {
  try {
    const [
      totalEvents,
      approvedEvents,
      pendingEvents,
      rejectedEvents,
      featuredEvents
    ] = await Promise.all([
      Event.countDocuments({ organizerId: req.user!._id }),
      Event.countDocuments({ organizerId: req.user!._id, status: 'approved' }),
      Event.countDocuments({ organizerId: req.user!._id, status: 'pending' }),
      Event.countDocuments({ organizerId: req.user!._id, status: 'rejected' }),
      Event.countDocuments({ organizerId: req.user!._id, isFeatured: true })
    ]);

    // Calculate event views (placeholder for future analytics)
    const totalViews = 0; // TODO: Implement view tracking

    res.json({
      stats: {
        totalEvents,
        approvedEvents,
        pendingEvents,
        rejectedEvents,
        featuredEvents,
        totalViews
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// POST /api/users/upgrade - Upgrade to premium
router.post('/upgrade', async (req: AuthenticatedRequest, res) => {
  try {
    const { plan, paymentMethod } = req.body;
    
    if (!plan || !paymentMethod) {
      return res.status(400).json({ error: 'Plan and payment method required' });
    }

    const user = await User.findById(req.user!._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isPremium) {
      return res.status(400).json({ error: 'User is already premium' });
    }

    // Calculate expiration date
    const expiresAt = new Date();
    if (plan === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (plan === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // Update user to premium
    user.isPremium = true;
    user.premiumExpiresAt = expiresAt;
    await user.save();

    // TODO: Process payment with mobile money API
    // TODO: Create payment record

    res.json({ 
      user,
      message: 'Successfully upgraded to premium',
      expiresAt
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({ error: 'Failed to upgrade account' });
  }
});

// POST /api/users/cancel-premium - Cancel premium subscription
router.post('/cancel-premium', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user!._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isPremium) {
      return res.status(400).json({ error: 'User is not premium' });
    }

    // Keep premium until current period expires
    // Don't set isPremium to false immediately
    res.json({ 
      user,
      message: 'Premium subscription will be cancelled at the end of current period'
    });
  } catch (error) {
    console.error('Cancel premium error:', error);
    res.status(500).json({ error: 'Failed to cancel premium' });
  }
});

export default router;
