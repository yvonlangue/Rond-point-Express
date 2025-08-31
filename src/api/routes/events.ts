import express from 'express';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { AuthenticatedRequest, optionalAuthMiddleware } from '../middleware/auth';
import { premiumMiddleware } from '../middleware/admin';

const router = express.Router();

// GET /api/events - Get public events with optional filtering
router.get('/', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      search,
      artType,
      category,
      location,
      dateFrom,
      dateTo,
      price,
      featured,
      page = 1,
      limit = 20
    } = req.query;

    const query: any = {
      status: 'approved',
      isApproved: true,
      date: { $gte: new Date() }
    };

    // Search functionality
    if (search) {
      query.$text = { $search: search as string };
    }

    // Filters
    if (artType) query.artType = artType;
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (featured === 'true') query.isFeatured = true;
    if (price === 'free') query.price = { $in: [0, null, undefined] };
    if (price === 'paid') query.price = { $gt: 0 };

    // Date range
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom as string);
      if (dateTo) query.date.$lte = new Date(dateTo as string);
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const events = await Event.find(query)
      .sort({ isFeatured: -1, date: 1 })
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
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/featured - Get featured events
router.get('/featured', async (req, res) => {
  try {
    const events = await Event.getFeaturedEvents()
      .limit(6)
      .populate('organizerId', 'name email');

    res.json({ events });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({ error: 'Failed to fetch featured events' });
  }
});

// GET /api/events/:id - Get single event
router.get('/:id', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'name email bio website');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Only show approved events to non-authenticated users
    if (!req.user && event.status !== 'approved') {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Show draft/pending events only to the organizer or admin
    if (req.user && event.status !== 'approved') {
      if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST /api/events - Create new event (authenticated users only)
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user can create events
    if (!req.user.canCreateEvent()) {
      return res.status(403).json({ 
        error: 'Event limit reached',
        message: 'You have reached your free event limit. Upgrade to premium for unlimited events.' 
      });
    }

    const eventData = {
      ...req.body,
      organizerId: req.user._id,
      organizer: req.user.name,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    };

    const event = new Event(eventData);
    await event.save();

    // Update user's event count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { eventCount: 1 }
    });

    res.status(201).json({ event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT /api/events/:id - Update event (organizer or admin only)
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Non-admins can only update draft/pending events
    if (req.user.role !== 'admin' && event.status === 'approved') {
      return res.status(403).json({ error: 'Cannot edit approved events' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ event: updatedEvent });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id - Delete event (organizer or admin only)
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Update user's event count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { eventCount: -1 }
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// POST /api/events/:id/feature - Feature/unfeature event (admin only)
router.post('/:id/feature', premiumMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.isFeatured = !event.isFeatured;
    await event.save();

    res.json({ 
      event,
      message: event.isFeatured ? 'Event featured' : 'Event unfeatured' 
    });
  } catch (error) {
    console.error('Feature event error:', error);
    res.status(500).json({ error: 'Failed to update event feature status' });
  }
});

export default router;
