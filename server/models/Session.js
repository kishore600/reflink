// models/Session.js
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  consultingOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConsultingOffer',
    required: true
  },
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String
  },
  notes: {
    type: String
  },
  employeeFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  },
  jobSeekerFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  },
  referralSubmitted: {
    type: Boolean,
    default: false
  },
  referral: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral'
  }
}, {
  timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;