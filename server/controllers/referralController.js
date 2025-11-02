// controllers/referralController.js
import Referral from '../models/Referral.js';
import Session from '../models/Session.js';
import User from '../models/User.js';

// @desc    Submit referral after session
// @route   POST /api/referrals
// @access  Private
const submitReferral = async (req, res) => {
  try {
    const { sessionId, company, position, jobDescription, applicationLink, employeeNotes } = req.body;

    const session = await Session.findById(sessionId).populate('jobSeeker');

    if (!session) {
      return res.status(404).json({
        message: 'Session not found'
      });
    }

    // Check if user is the employee in this session
    if (session.employee.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Not authorized to submit referral for this session'
      });
    }

    // Check if session is completed
    if (session.status !== 'completed') {
      return res.status(400).json({
        message: 'Can only submit referral for completed sessions'
      });
    }

    // Check if referral already exists
    const existingReferral = await Referral.findOne({ session: sessionId });
    if (existingReferral) {
      return res.status(400).json({
        message: 'Referral already submitted for this session'
      });
    }

    const referral = await Referral.create({
      session: sessionId,
      jobSeeker: session.jobSeeker._id,
      employee: req.user.id,
      company,
      position,
      jobDescription,
      applicationLink,
      employeeNotes
    });

    // Update session with referral
    session.referralSubmitted = true;
    session.referral = referral._id;
    await session.save();

    // Add success story
    await User.findByIdAndUpdate(
      session.jobSeeker._id,
      {
        $push: {
          successStories: {
            testimonial: `${req.user.name} from ${company} referred me for ${position} after a successful consulting session.`,
            employee: req.user.name,
            company
          }
        }
      }
    );

    await referral.populate('jobSeeker employee session');

    res.status(201).json(referral);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// @desc    Get user's referrals
// @route   GET /api/referrals
// @access  Private
const getUserReferrals = async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    let query = {};

    if (type === 'as-jobseeker') {
      query.jobSeeker = req.user.id;
    } else if (type === 'as-employee') {
      query.employee = req.user.id;
    } else {
      query = {
        $or: [
          { jobSeeker: req.user.id },
          { employee: req.user.id }
        ]
      };
    }

    const referrals = await Referral.find(query)
      .populate('jobSeeker', 'name username title')
      .populate('employee', 'name username title')
      .populate('session')
      .sort({ createdAt: -1 });

    res.json(referrals);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// @desc    Update referral status
// @route   PUT /api/referrals/:id/status
// @access  Private
const updateReferralStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({
        message: 'Referral not found'
      });
    }

    // Check if user is the job seeker or employee
    if (referral.jobSeeker.toString() !== req.user.id && 
        referral.employee.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Not authorized to update this referral'
      });
    }

    referral.status = status;

    if (status === 'interview' || status === 'hired') {
      referral.interviewUpdates.push({
        stage: status,
        date: new Date(),
        notes: notes || '',
        status
      });
    }

    await referral.save();
    await referral.populate('jobSeeker employee session');

    res.json(referral);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

export {
  submitReferral,
  getUserReferrals,
  updateReferralStatus
};