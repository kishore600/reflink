// models/ConsultingOffer.js
import mongoose from 'mongoose';

const consultingOfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required']
  },
  description: {
    type: String,
    required: [true, 'Offer description is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required']
  },
  skills: [{
    type: String
  }],
  benefits: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    default: 0 // Free for referral exchange
  },
  category: {
    type: String,
    enum: ['code-review', 'optimization', 'implementation', 'audit', 'consulting'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  }
}, {
  timestamps: true
});

const ConsultingOffer = mongoose.model('ConsultingOffer', consultingOfferSchema);

export default ConsultingOffer;