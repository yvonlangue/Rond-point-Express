import express from 'express';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/admin/dashboard - Admin dashboard overview
router.get('/dashboard', async (req: AuthenticatedRequest, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      pendingEvents,
      premiumUsers,
      recentEvents,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Event.countDocuments({ status: 'pending' }),
      User.countDocuments({ isPremium: true }),
      Event.find().sort({ createdAt: -1 }).limit(5).populate('organizerId', 'name'),
      User.find().sort({ createdAt: -1 }).limit(5)
    ]);

    // Calculate growth metrics
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const [
      newUsersThisMonth,
      newEventsThisMonth
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: lastMonth } }),
      Event.countDocuments({ createdAt: { $gte: lastMonth } })
    ]);

    res.json({
      stats: {
        totalUsers,
        totalEvents,
        pendingEvents,
        premiumUsers,
        newUsersThisMonth,
        newEventsThisMonth
      },
      recentEvents,
      recentUsers
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/admin/events - Get events for moderation
router.get('/events', async (req: AuthenticatedRequest, res) => {
  try {
    const {
      status = 'pending',
      page = 1,
      limit = 20,
      search
    } = req.query;

    const query: any = {};
    
    if (status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('organizerId', 'name email');

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
    console.error('Admin events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /api/admin/events/:id/approve - Approve event
router.post('/events/:id/approve', async (req: AuthenticatedRequest, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.status = 'approved';
    event.isApproved = true;
    await event.save();

    res.json({ 
      event,
      message: 'Event approved successfully' 
    });
  } catch (error) {
    console.error('Approve event error:', error);
    res.status(500).json({ error: 'Failed to approve event' });
  }
});

// POST /api/admin/events/:id/reject - Reject event
router.post('/events/:id/reject', async (req: AuthenticatedRequest, res) => {
  try {
    const { reason } = req.body;
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.status = 'rejected';
    event.isApproved = false;
    await event.save();

    // TODO: Send notification to organizer about rejection

    res.json({ 
      event,
      message: 'Event rejected successfully' 
    });
  } catch (error) {
    console.error('Reject event error:', error);
    res.status(500).json({ error: 'Failed to reject event' });
  }
});

// GET /api/admin/users - Get users for management
router.get('/users', async (req: AuthenticatedRequest, res) => {
  try {
    const {
      role,
      isPremium,
      page = 1,
      limit = 20,
      search
    } = req.query;

    const query: any = {};
    
    if (role) query.role = role;
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-firebaseUid');

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id - Update user (role, premium status, etc.)
router.put('/users/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { role, isPremium, premiumExpiresAt } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user!._id.toString()) {
      return res.status(400).json({ error: 'Cannot modify your own role' });
    }

    const updateData: any = {};
    if (role) updateData.role = role;
    if (isPremium !== undefined) updateData.isPremium = isPremium;
    if (premiumExpiresAt) updateData.premiumExpiresAt = premiumExpiresAt;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-firebaseUid');

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/admin/users/:id - Suspend user
router.delete('/users/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from suspending themselves
    if (user._id.toString() === req.user!._id.toString()) {
      return res.status(400).json({ error: 'Cannot suspend your own account' });
    }

    // Instead of deleting, mark as suspended
    user.role = 'visitor'; // Demote to visitor
    await user.save();

    res.json({ message: 'User suspended successfully' });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ error: 'Failed to suspend user' });
  }
});

// GET /api/admin/analytics - Get analytics data
router.get('/analytics', async (req: AuthenticatedRequest, res) => {
  try {
    const { period = '30' } = req.query;
    const days = Number(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      newUsers,
      newEvents,
      premiumUpgrades,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Event.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments({ 
        isPremium: true, 
        premiumExpiresAt: { $gte: startDate } 
      }),
      // TODO: Calculate revenue from payment records
      0
    ]);

    // Event status distribution
    const eventStats = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // User role distribution
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      period: days,
      metrics: {
        newUsers,
        newEvents,
        premiumUpgrades,
        totalRevenue
      },
      eventStats,
      userStats
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
