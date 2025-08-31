import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  artType: string;
  category: string;
  images: string[];
  organizerId: mongoose.Types.ObjectId;
  organizer: string;
  isFeatured: boolean;
  isApproved: boolean;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  price?: number;
  ticketUrl?: string;
  maxAttendees?: number;
  currentAttendees: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  artType: {
    type: String,
    required: true,
    enum: [
      'Painting', 'Sculpture', 'Photography', 'Digital Art', 'Installation',
      'Printmaking', 'Video Art', 'Textile Arts', 'Ceramics', 'Drawing',
      'Mixed Media', 'Performance Art', 'Architecture'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Vernissage', 'Solo Exhibition', 'Group Exhibition', 'Retrospective',
      'Art Fair', 'Biennial / Triennial', 'Open Studios', 'Artist Talk',
      'Panel Discussion', 'Workshop', 'Art Auction', 'Performance',
      'Screening', 'Gallery Walk'
    ]
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be valid'
    }
  }],
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizer: {
    type: String,
    required: true,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'pending'
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  ticketUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Ticket URL must be valid'
    }
  },
  maxAttendees: {
    type: Number,
    min: 1
  },
  currentAttendees: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
EventSchema.index({ status: 1, isApproved: 1 });
EventSchema.index({ date: 1 });
EventSchema.index({ location: 1 });
EventSchema.index({ artType: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ organizerId: 1 });
EventSchema.index({ isFeatured: 1 });
EventSchema.index({ tags: 1 });
EventSchema.index({ title: 'text', description: 'text' });

// Virtual for checking if event is full
EventSchema.virtual('isFull').get(function() {
  if (!this.maxAttendees) return false;
  return this.currentAttendees >= this.maxAttendees;
});

// Virtual for checking if event is free
EventSchema.virtual('isFree').get(function() {
  return !this.price || this.price === 0;
});

// Pre-save middleware to update approval status
EventSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'approved') {
    this.isApproved = true;
  }
  next();
});

// Static method to get public events
EventSchema.statics.getPublicEvents = function() {
  return this.find({
    status: 'approved',
    isApproved: true,
    date: { $gte: new Date() }
  }).sort({ date: 1 });
};

// Static method to get featured events
EventSchema.statics.getFeaturedEvents = function() {
  return this.find({
    status: 'approved',
    isApproved: true,
    isFeatured: true,
    date: { $gte: new Date() }
  }).sort({ date: 1 });
};

export const Event = mongoose.model<IEvent>('Event', EventSchema);
