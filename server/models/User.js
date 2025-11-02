// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  experience: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  location: {
    type: String,
    required: true
  },
  remotePolicy: {
    type: String,
    default: 'Hybrid Preferred'
  },
  desiredRoles: [{
    type: String
  }],
  targetCompanies: [{
    type: String
  }],
  skills: [{
    name: String,
    level: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  }],
  projects: [{
    name: String,
    description: String,
    tech: [String],
    githubUrl: String,
    liveUrl: String,
    image: String
  }],
  consultingOffers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConsultingOffer'
  }],
  availableSlots: {
    type: Number,
    default: 0
  },
  completedSessions: {
    type: Number,
    default: 0
  },
  successStories: [{
    testimonial: String,
    employee: String,
    company: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  profileViews: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    portfolio: String
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;