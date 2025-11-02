// models/Referral.js
import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
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
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String
  },
  status: {
    type: String,
    enum: ['submitted', 'under-review', 'interview', 'rejected', 'hired'],
    default: 'submitted'
  },
  referralBonus: {
    type: Number,
    default: 0
  },
  employeeNotes: {
    type: String
  },
  applicationLink: {
    type: String
  },
  interviewUpdates: [{
    stage: String,
    date: Date,
    notes: String,
    status: String
  }]
}, {
  timestamps: true
});

const Referral = mongoose.model('Referral', referralSchema);

export default Referral;