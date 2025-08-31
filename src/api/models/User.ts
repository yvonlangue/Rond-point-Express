import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  role: 'visitor' | 'organizer' | 'admin';
  bio?: string;
  website?: string;
  contactEmail?: string;
  profileImage?: string;
  phoneNumber?: string;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  eventCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    enum: ['visitor', 'organizer', 'admin'],
    default: 'visitor'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  website: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL'
    }
  },
  contactEmail: {
    type: String,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Contact email must be a valid email address'
    }
  },
  profileImage: {
    type: String
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /^\+?[\d\s\-\(\)]+$/.test(v);
      },
      message: 'Phone number must be valid'
    }
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: {
    type: Date
  },
  eventCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isPremium: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for checking if premium is active
UserSchema.virtual('isPremiumActive').get(function() {
  if (!this.isPremium) return false;
  if (!this.premiumExpiresAt) return true;
  return this.premiumExpiresAt > new Date();
});

// Method to check if user can create more events
UserSchema.methods.canCreateEvent = function(): boolean {
  if (this.role === 'admin') return true;
  if (this.isPremiumActive) return true;
  return this.eventCount < 3; // Free users limited to 3 events
};

// Pre-save middleware to update premium status
UserSchema.pre('save', function(next) {
  if (this.premiumExpiresAt && this.premiumExpiresAt < new Date()) {
    this.isPremium = false;
  }
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
